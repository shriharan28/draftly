-- ============================================================
-- DRAFTLY — 0001_init.sql
-- Run this ONCE in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================


-- ============================================================
-- SECTION 1: PROFILES
-- One profile per user. Created automatically by the trigger below.
-- Stores: niche, platforms, tone — the "brand voice" from onboarding.
-- ============================================================
create table public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  username             text unique,
  full_name            text,
  niche                text,
  platforms            text[] not null default '{}',
  tone                 text not null default 'chill',
  keywords             text[] not null default '{}',
  timezone             text not null default 'utc',
  onboarding_completed boolean not null default false,
  plan                 text not null default 'free'
                       check (plan in ('free','pro')),
  credits_reset_at     timestamptz not null default (now() + interval '30 days'),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);


-- ============================================================
-- SECTION 2: BRAND VOICES
-- v1 uses the single voice from onboarding.
-- v1.1 will allow multiple named voices.
-- ============================================================
create table public.brand_voices (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null default 'My voice',
  tones       text[] not null default '{}',
  keywords    text[] not null default '{}',
  sample_text text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);


-- ============================================================
-- SECTION 3: GENERATIONS
-- Every AI generation request. Stores all 3 variants as JSON.
-- ============================================================
create table public.generations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  brand_voice_id uuid references public.brand_voices(id) on delete set null,
  content_type   text not null check (content_type in
                   ('ig_caption','reel_hook','x_thread','x_post','linkedin_post','yt_desc')),
  topic          text not null check (char_length(topic) between 3 and 500),
  tone           text not null,
  variants       jsonb not null default '[]',   -- [{text, favorited}]
  chosen_index   int,
  status         text not null default 'pending'
                 check (status in ('pending','complete','failed')),
  error_code     text,
  model          text,
  latency_ms     int,
  created_at     timestamptz not null default now()
);


-- ============================================================
-- SECTION 4: CREDIT LEDGER (append-only — the source of truth)
-- NEVER update or delete rows here. Balance = balance_after of newest row.
-- The idempotency_key prevents double-charging on retries/double-clicks.
-- ============================================================
create table public.credit_ledger (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  delta           int not null,
  reason          text not null check (reason in
                    ('signup_grant','monthly_grant','plan_grant','generation','refund','admin_adjust')),
  balance_after   int not null check (balance_after >= 0),
  generation_id   uuid references public.generations(id) on delete set null,
  idempotency_key text unique not null,
  created_at      timestamptz not null default now()
);
-- Enforce append-only: app role may never UPDATE or DELETE ledger rows
revoke update, delete on public.credit_ledger from anon, authenticated;


-- ============================================================
-- SECTION 5: SUBSCRIPTIONS (Stripe mirror)
-- Stripe is always the source of truth. This is a local cache
-- so we don't have to call Stripe on every page load.
-- ============================================================
create table public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  status                 text not null check (status in
                           ('active','trialing','past_due','canceled','incomplete')),
  price_id               text,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);


-- ============================================================
-- SECTION 6: SIGNUP TRIGGER
-- When a user signs up via Supabase Auth, this runs automatically.
-- It creates their profile AND gives them 15 credits — in ONE transaction.
-- This means there's NEVER a state where a user exists without credits.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.credit_ledger (user_id, delta, reason, balance_after, idempotency_key)
  values (new.id, 15, 'signup_grant', 15, 'signup_' || new.id);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- SECTION 7: ATOMIC SPEND FUNCTION (money-critical)
-- Called from our API route — never from the browser directly.
-- "FOR UPDATE" locks the row so two simultaneous requests can't
-- both think the user has enough credits and double-charge.
-- ============================================================
create or replace function public.spend_credits(
  p_amount int, p_reason text, p_generation_id uuid
) returns int language plpgsql security definer set search_path = public as $$
declare v_balance int;
begin
  -- Lock the newest row for this user (prevents race conditions)
  select balance_after into v_balance
    from public.credit_ledger where user_id = auth.uid()
    order by id desc limit 1 for update;

  if v_balance is null or v_balance < p_amount then
    raise exception 'insufficient_credits';
  end if;

  insert into public.credit_ledger
    (user_id, delta, reason, balance_after, generation_id, idempotency_key)
  values
    (auth.uid(), -p_amount, p_reason, v_balance - p_amount, p_generation_id,
     'gen_' || p_generation_id);  -- unique key = double-click can never double-charge

  return v_balance - p_amount;
end $$;


-- ============================================================
-- SECTION 8: ROW LEVEL SECURITY
-- Even if our app has a bug, the database itself refuses to
-- show User A's data to User B. This is the second wall.
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.brand_voices  enable row level security;
alter table public.generations   enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: users can only read and update their OWN profile
create policy "profiles_select_own"  on public.profiles      for select using (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles      for update using (auth.uid() = id);

-- Brand voices: full CRUD on own voices only
create policy "voices_all_own"       on public.brand_voices  for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Generations: select/insert/update own only
create policy "gen_select_own"       on public.generations   for select using (auth.uid() = user_id);
create policy "gen_insert_own"       on public.generations   for insert with check (auth.uid() = user_id);
create policy "gen_update_own"       on public.generations   for update using (auth.uid() = user_id);

-- Ledger: select own and insert own
create policy "ledger_select_own"    on public.credit_ledger for select using (auth.uid() = user_id);
create policy "ledger_insert_own"    on public.credit_ledger for insert with check (auth.uid() = user_id);

-- Subscriptions: select own only (write happens via service role in webhook)
create policy "subs_select_own"      on public.subscriptions for select using (auth.uid() = user_id);


-- ============================================================
-- SECTION 9: INDEXES
-- Speed up the most common queries.
-- ============================================================
create index idx_generations_user_created on public.generations (user_id, created_at desc);
create index idx_ledger_user_id           on public.credit_ledger (user_id, id desc);
create index idx_ledger_reason_time       on public.credit_ledger (reason, created_at desc);
create index idx_subscriptions_customer   on public.subscriptions (stripe_customer_id);
