begin;
alter table public.subscriptions add column paypal_custom_id text;
create table public.pending_paypal_checkouts (
  id uuid primary key,
  secret_hash text not null unique check (secret_hash ~ '^[a-f0-9]{64}$'),
  subscription_id text unique check (subscription_id ~ '^I-[A-Z0-9]+$'),
  provider_plan_id text not null check (provider_plan_id ~ '^P-[A-Z0-9]+$'),
  billing_interval text not null check (billing_interval in ('monthly','yearly')),
  state text not null default 'open' check (state in ('open','claimed','cancelling','cancelled')),
  claimed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours',
  claimed_at timestamptz
);
alter table public.pending_paypal_checkouts enable row level security;
revoke all on public.pending_paypal_checkouts from public,anon,authenticated;
grant all on public.pending_paypal_checkouts to service_role;
create index pending_paypal_expiry on public.pending_paypal_checkouts(expires_at) where claimed_by is null;

create function public.qraftt_claim_paypal_checkout(
  p_checkout uuid, p_secret_hash text, p_user uuid, p_status text,
  p_observed_at timestamptz, p_period_start timestamptz default null, p_period_end timestamptz default null
) returns text language plpgsql security definer set search_path = '' as $$
declare pending public.pending_paypal_checkouts;
begin
  select * into pending from public.pending_paypal_checkouts where id=p_checkout for update;
  if not found or pending.secret_hash <> p_secret_hash then raise exception 'Invalid checkout'; end if;
  if pending.claimed_by is not null then
    if pending.claimed_by <> p_user then raise exception 'Checkout already linked'; end if;
    return pending.subscription_id;
  end if;
  if pending.state <> 'open' or pending.expires_at <= now() or pending.subscription_id is null then raise exception 'Checkout expired or unavailable'; end if;
  if p_status <> 'active' then raise exception 'Active PayPal subscription required'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,0));
  if exists(select 1 from public.subscriptions where user_id=p_user and status='active') then raise exception 'Account already has Pro'; end if;
  insert into public.subscriptions(id,user_id,provider_plan_id,billing_interval,status,paypal_custom_id)
    values(pending.subscription_id,p_user,pending.provider_plan_id,pending.billing_interval,'approval_pending','checkout:' || pending.id::text);
  perform public.qraftt_apply_verified_subscription(pending.subscription_id,p_status,p_observed_at,null,p_period_start,p_period_end);
  update public.pending_paypal_checkouts set state='claimed',claimed_by=p_user,claimed_at=now() where id=p_checkout;
  return pending.subscription_id;
end;
$$;
revoke all on function public.qraftt_claim_paypal_checkout(uuid,text,uuid,text,timestamptz,timestamptz,timestamptz) from public,anon,authenticated;
grant execute on function public.qraftt_claim_paypal_checkout(uuid,text,uuid,text,timestamptz,timestamptz,timestamptz) to service_role;
commit;
