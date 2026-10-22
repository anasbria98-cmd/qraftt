begin;
grant usage on schema public to anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '' check (length(display_name) <= 100),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.subscriptions (
  id text primary key check (id ~ '^I-[A-Z0-9]+$'),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null default 'paypal' check (provider = 'paypal'),
  provider_plan_id text not null check (provider_plan_id ~ '^P-[A-Z0-9]+$'),
  billing_interval text not null check (billing_interval in ('monthly','yearly')),
  status text not null check (status in ('approval_pending','approved','active','cancelled','suspended','expired','payment_failed')),
  plan text not null default 'pro' check (plan = 'pro'),
  current_period_start timestamptz,
  current_period_end timestamptz,
  last_event_time timestamptz not null default '-infinity',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_user_id_idx on public.subscriptions(user_id, updated_at desc);
create table public.billing_webhook_events (
  id text primary key,
  subscription_id text not null references public.subscriptions(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.download_usage (
  principal text not null,
  day date not null,
  count integer not null check (count between 1 and 3),
  primary key (principal, day)
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_webhook_events enable row level security;
alter table public.download_usage enable row level security;
revoke all on public.profiles, public.subscriptions, public.billing_webhook_events, public.download_usage from anon, authenticated;
grant select on public.profiles, public.subscriptions to authenticated;
grant update(display_name) on public.profiles to authenticated;
grant all on public.profiles, public.subscriptions, public.billing_webhook_events, public.download_usage to service_role;
create policy profiles_read_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own_name on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy subscriptions_read_own on public.subscriptions for select to authenticated using ((select auth.uid()) = user_id);
-- No client write policies for subscriptions, plan, email, quota, or webhook events.

create function public.qraftt_touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_updated before update on public.profiles for each row execute function public.qraftt_touch_updated_at();
create trigger subscriptions_updated before update on public.subscriptions for each row execute function public.qraftt_touch_updated_at();

create function public.qraftt_sync_auth_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,email) values(new.id,coalesce(new.email,''))
  on conflict(id) do update set email=excluded.email;
  return new;
end;
$$;
create trigger qraftt_auth_profile after insert or update of email on auth.users for each row execute function public.qraftt_sync_auth_profile();
insert into public.profiles(id,email) select id,coalesce(email,'') from auth.users on conflict(id) do nothing;

create function public.qraftt_consume_download(p_principal text) returns boolean language plpgsql security definer set search_path = '' as $$
declare used integer;
begin
  if length(p_principal) > 100 or p_principal = '' then raise exception 'Invalid principal'; end if;
  insert into public.download_usage(principal,day,count) values(p_principal,(now() at time zone 'UTC')::date,1)
  on conflict(principal,day) do update set count=public.download_usage.count+1 where public.download_usage.count<3
  returning count into used;
  return used is not null;
end;
$$;

create function public.qraftt_apply_verified_subscription(
  p_id text, p_status text, p_observed_at timestamptz,
  p_event_id text default null,
  p_period_start timestamptz default null, p_period_end timestamptz default null
) returns void language plpgsql security definer set search_path = '' as $$
declare owner_id uuid; current_event timestamptz; inserted integer;
begin
  select user_id into owner_id from public.subscriptions where id=p_id;
  if owner_id is null then raise exception 'Unknown subscription'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(owner_id::text,0));
  select last_event_time into current_event from public.subscriptions where id=p_id for update;
  if p_event_id is not null then
    insert into public.billing_webhook_events(id,subscription_id) values(p_event_id,p_id) on conflict(id) do nothing;
    get diagnostics inserted = row_count;
    if inserted=0 then return; end if;
  end if;
  if p_observed_at < current_event then return; end if;
  update public.subscriptions set status=p_status, last_event_time=p_observed_at,
    current_period_start=coalesce(p_period_start,current_period_start), current_period_end=coalesce(p_period_end,current_period_end)
    where id=p_id;
  update public.profiles set plan=case when exists(select 1 from public.subscriptions where user_id=owner_id and status='active') then 'pro' else 'free' end where id=owner_id;
end;
$$;
revoke all on function public.qraftt_sync_auth_profile(), public.qraftt_touch_updated_at() from public,anon,authenticated;
revoke all on function public.qraftt_consume_download(text), public.qraftt_apply_verified_subscription(text,text,timestamptz,text,timestamptz,timestamptz) from public,anon,authenticated;
grant execute on function public.qraftt_consume_download(text), public.qraftt_apply_verified_subscription(text,text,timestamptz,text,timestamptz,timestamptz) to service_role;

commit;
