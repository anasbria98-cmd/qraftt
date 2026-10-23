-- Apply once after checking for schema conflicts; preserve all existing accounts
-- and subscriptions. Fail atomically rather than leaving a partial schema.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';
create table if not exists public.saved_qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  storage_bytes bigint generated always as (octet_length(document::text) + octet_length(title)) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists saved_qr_owner on public.saved_qr_codes(user_id, updated_at desc);
alter table public.saved_qr_codes enable row level security;
-- No browser writes: mutations and reads go through the service-only RPC after
-- server authentication. Users cannot choose their owner, plan, limits or usage.
revoke all on public.saved_qr_codes from anon, authenticated;
grant all on public.saved_qr_codes to service_role;
create policy saved_qr_account_isolation on public.saved_qr_codes for select to authenticated using (auth.uid() = user_id);

create or replace function public.qraftt_saved_qr(
  p_user uuid, p_plans text[], p_action text,
  p_id uuid default null, p_title text default null, p_document jsonb default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_interval text;
  v_limit integer := 0;
  v_capacity bigint := 0;
  v_count integer;
  v_used bigint;
  v_old bigint := 0;
  v_bytes bigint;
  v_id uuid;
  v_result jsonb;
begin
  -- Serializes all saves/edits/deletes for one account. Concurrent requests
  -- cannot both pass the same remaining-count/storage check.
  perform 1 from public.profiles where id = p_user for update;
  if not found then raise exception 'ACCOUNT_REQUIRED'; end if;
  select billing_interval into v_interval from public.subscriptions
    where user_id = p_user and status = 'active' and provider_plan_id = any(p_plans)
    order by updated_at desc limit 1;
  if v_interval is not null then
    v_limit := case when v_interval = 'yearly' then 500 else 100 end;
    v_capacity := case when v_interval = 'yearly' then 1000000000 else 250000000 end;
  end if;
  select count(*), coalesce(sum(storage_bytes), 0) into v_count, v_used
    from public.saved_qr_codes where user_id = p_user;
  if p_action = 'usage' then
    return jsonb_build_object('count',v_count,'bytes',v_used,'savedLimit',v_limit,'storageLimit',v_capacity,'interval',v_interval);
  end if;
  if p_action = 'delete' then
    -- Owners may delete retained data even after cancellation/downgrade.
    delete from public.saved_qr_codes where id = p_id and user_id = p_user;
    if not found then raise exception 'NOT_FOUND'; end if;
    return jsonb_build_object('deleted',true);
  end if;
  if p_action = 'list' then
    select coalesce(jsonb_agg(to_jsonb(q) order by q.updated_at desc), '[]') into v_result
      from (select id,title,storage_bytes,created_at,updated_at from public.saved_qr_codes where user_id=p_user) q;
    return v_result;
  end if;
  if v_limit = 0 then raise exception 'PRO_REQUIRED'; end if;
  if p_action = 'get' then
    select to_jsonb(q) into v_result from public.saved_qr_codes q where id=p_id and user_id=p_user;
    if v_result is null then raise exception 'NOT_FOUND'; end if;
    return v_result;
  elsif p_action <> 'save' then raise exception 'INVALID_ACTION'; end if;
  if p_title is null or char_length(p_title) not between 1 and 100
    or p_document is null or jsonb_typeof(p_document) <> 'object' then raise exception 'INVALID_DOCUMENT'; end if;
  v_bytes := octet_length(p_document::text) + octet_length(p_title);
  if v_bytes > 1100000 then raise exception 'DOCUMENT_TOO_LARGE'; end if;
  if p_id is not null then
    select storage_bytes into v_old from public.saved_qr_codes where id=p_id and user_id=p_user;
    if not found then raise exception 'NOT_FOUND'; end if;
    if v_count > v_limit then raise exception 'SAVED_QR_LIMIT'; end if;
  elsif v_count >= v_limit then raise exception 'SAVED_QR_LIMIT'; end if;
  if v_used - v_old + v_bytes > v_capacity then raise exception 'STORAGE_LIMIT'; end if;
  if p_id is null then
    insert into public.saved_qr_codes(user_id,title,document) values(p_user,p_title,p_document) returning id into v_id;
  else
    update public.saved_qr_codes set title=p_title, document=p_document, updated_at=now() where id=p_id and user_id=p_user returning id into v_id;
  end if;
  return jsonb_build_object('id',v_id);
end;
$$;
revoke all on function public.qraftt_saved_qr(uuid,text[],text,uuid,text,jsonb) from public, anon, authenticated;
grant execute on function public.qraftt_saved_qr(uuid,text[],text,uuid,text,jsonb) to service_role;
notify pgrst, 'reload schema';
commit;
