-- Everything the website needs in Supabase. Paste the whole file into Supabase → SQL Editor → Run.
-- Safe to run again: it only creates what is missing and replaces the functions/policies.
--
-- Who can do what:
--   The public (anon key)       nothing. The site's server functions write with the secret key.
--   Signed-in admins            read RSVPs, subscribers and analytics; mark attendance & notes.
--   Signed-in non-admins        nothing. Being in public.admins is what makes someone an admin.

-- ─── Tables ──────────────────────────────────────────────────────────────────────────────────

create table if not exists public.subscribers (
  id          bigint generated always as identity primary key,
  email       text not null unique check (email = lower(email)),
  source      text,
  created_at  timestamptz not null default now()
);

create table if not exists public.rsvps (
  id                 bigint generated always as identity primary key,
  name               text not null,
  contact            text not null,              -- phone number or email, as typed
  visit_when         text not null,              -- This Sunday | Next Sunday | Not sure yet
  visit_date         date,                       -- the Sunday it means, in Lagos time; null if not sure
  people             int  not null check (people between 1 and 20),
  first_time         boolean not null default true,
  attended           boolean,                    -- filled in by the welcome team on /admin
  notes              text,
  follow_up_sent_at  timestamptz,
  created_at         timestamptz not null default now()
);
create index if not exists rsvps_visit_date_idx on public.rsvps (visit_date);

-- One row per page view. No cookies and no IP addresses are stored: visitor_hash is a one-way
-- hash that changes every day, so a visitor can be counted once per day but never followed.
create table if not exists public.page_views (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  path           text not null,
  referrer_host  text,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  country        text,
  device         text,                           -- mobile | tablet | desktop
  visitor_hash   text not null
);
create index if not exists page_views_created_at_idx on public.page_views (created_at);

create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  created_at  timestamptz not null default now()
);

-- ─── Access ──────────────────────────────────────────────────────────────────────────────────

alter table public.subscribers enable row level security;
alter table public.rsvps       enable row level security;
alter table public.page_views  enable row level security;
alter table public.admins      enable row level security;

revoke all on public.subscribers, public.rsvps, public.page_views, public.admins
  from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

grant select on public.rsvps, public.subscribers to authenticated;
grant update (attended, notes) on public.rsvps to authenticated;

drop policy if exists "admins read rsvps" on public.rsvps;
create policy "admins read rsvps" on public.rsvps
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "admins update rsvps" on public.rsvps;
create policy "admins update rsvps" on public.rsvps
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admins read subscribers" on public.subscribers;
create policy "admins read subscribers" on public.subscribers
  for select to authenticated using ((select public.is_admin()));

-- ─── Analytics summary for /admin ────────────────────────────────────────────────────────────
-- Days are counted in Lagos time. Raw page views are never sent to the browser, only totals.

create or replace function public.admin_analytics(days int default 30)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  since timestamptz;
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  days := least(greatest(coalesce(days, 30), 1), 366);
  since := ((now() at time zone 'Africa/Lagos')::date - (days - 1)) at time zone 'Africa/Lagos';

  with views as (
    select *, (created_at at time zone 'Africa/Lagos')::date as day
    from public.page_views
    where created_at >= since
  ),
  calendar as (
    select generate_series(since at time zone 'Africa/Lagos',
                           now() at time zone 'Africa/Lagos', interval '1 day')::date as day
  )
  select jsonb_build_object(
    'days', days,
    'totals', jsonb_build_object(
      'views',       (select count(*) from views),
      'visitors',    (select count(distinct (day, visitor_hash)) from views),
      'rsvps',       (select count(*) from public.rsvps where created_at >= since),
      'subscribers', (select count(*) from public.subscribers where created_at >= since)
    ),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object('day', c.day, 'views', coalesce(v.views, 0),
                                                   'visitors', coalesce(v.visitors, 0)) order by c.day), '[]')
      from calendar c
      left join (
        select day, count(*) as views, count(distinct visitor_hash) as visitors
        from views group by day
      ) v using (day)
    ),
    'pages',     (select coalesce(jsonb_agg(t), '[]') from (
                    select path as label, count(*) as views, count(distinct (day, visitor_hash)) as visitors
                    from views group by path order by views desc limit 10) t),
    'referrers', (select coalesce(jsonb_agg(t), '[]') from (
                    select coalesce(utm_source, referrer_host, 'Direct / unknown') as label,
                           count(distinct (day, visitor_hash)) as visitors
                    from views group by 1 order by visitors desc limit 10) t),
    'countries', (select coalesce(jsonb_agg(t), '[]') from (
                    select coalesce(country, 'Unknown') as label, count(distinct (day, visitor_hash)) as visitors
                    from views group by 1 order by visitors desc limit 10) t),
    'devices',   (select coalesce(jsonb_agg(t), '[]') from (
                    select coalesce(device, 'Unknown') as label, count(distinct (day, visitor_hash)) as visitors
                    from views group by 1 order by visitors desc) t)
  ) into result;

  return result;
end;
$$;
revoke all on function public.admin_analytics(int) from public, anon;
grant execute on function public.admin_analytics(int) to authenticated;
