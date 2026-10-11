-- ============================================================
-- Vet Care LTD — Complete Database Setup & Seed
-- Paste this entire file into the Supabase SQL Editor and click RUN.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. Auth & Session Tables (Better Auth)
-- ------------------------------------------------------------
create table if not exists "user" (
  "id" text not null primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null,
  "image" text,
  "createdAt" timestamptz default current_timestamp not null,
  "updatedAt" timestamptz default current_timestamp not null
);

create table if not exists "session" (
  "id" text not null primary key,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "createdAt" timestamptz default current_timestamp not null,
  "updatedAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user" ("id") on delete cascade
);

create table if not exists "account" (
  "id" text not null primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user" ("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz default current_timestamp not null,
  "updatedAt" timestamptz not null
);

create table if not exists "verification" (
  "id" text not null primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz default current_timestamp not null,
  "updatedAt" timestamptz default current_timestamp not null
);

create index if not exists "session_userId_idx" on "session" ("userId");
create index if not exists "account_userId_idx" on "account" ("userId");
create index if not exists "verification_identifier_idx" on "verification" ("identifier");

create table if not exists salon_staff_accounts (
  id text primary key references "user" (id) on delete cascade,
  email text not null unique,
  name text not null,
  role text not null check (role in ('admin', 'manager', 'receptionist', 'stylist')),
  team_member_id text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists salon_staff_accounts_role_idx on salon_staff_accounts (role);

-- ------------------------------------------------------------
-- 2. Clinic Operations Tables
-- ------------------------------------------------------------
create table if not exists salon_customers (
  id text primary key,
  name text not null,
  phone text not null,
  since date,
  notes text not null default '',
  preferred_stylist_id text,
  created_at timestamptz not null default now()
);

create table if not exists salon_appointments (
  id text primary key,
  service_id text not null,
  stylist_id text not null,
  any_stylist boolean not null default false,
  date date not null,
  time text not null,
  style text not null default '',
  notes text not null default '',
  total integer not null,
  deposit integer not null,
  remaining integer not null,
  payment_method text not null,
  status text not null,
  source text not null default 'appointment',
  customer_id text not null,
  customer_name text not null,
  customer_phone text not null,
  payment_order_id text,
  checked_in_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists salon_appointments_date_idx on salon_appointments (date);
create index if not exists salon_appointments_status_idx on salon_appointments (status);
create index if not exists salon_appointments_order_idx on salon_appointments (payment_order_id);

create table if not exists salon_queue (
  id text primary key,
  appointment_id text not null references salon_appointments(id) on delete cascade,
  position integer not null default 0,
  status text not null,
  arrived_at timestamptz not null,
  started_at timestamptz,
  completed_at timestamptz
);

create table if not exists salon_payments (
  id text primary key,
  booking_id text not null,
  customer_id text not null,
  customer_name text not null,
  amount integer not null,
  method text not null,
  status text not null,
  order_id text,
  phone text not null,
  description text not null default '',
  kind text not null default 'deposit',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create unique index if not exists salon_payments_order_unique on salon_payments (order_id) where order_id is not null;
create index if not exists salon_payments_booking_idx on salon_payments (booking_id);

create table if not exists salon_notifications (
  id text primary key,
  title text not null,
  body text not null,
  audience text not null,
  appointment_id text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists salon_reviews (
  id text primary key,
  appointment_id text not null,
  customer_name text not null,
  service_id text not null,
  stylist_id text not null,
  rating integer not null,
  quote text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists salon_offers (
  id text primary key,
  title text not null,
  copy text not null,
  service_id text,
  discount_percent integer not null default 0,
  start_date date,
  end_date date,
  active boolean not null default true
);

create table if not exists salon_audit (
  id text primary key,
  actor text not null,
  action text not null,
  target text not null,
  before_value text,
  after_value text,
  created_at timestamptz not null default now()
);

create table if not exists salon_settings (
  key text primary key,
  value text not null
);

create table if not exists salon_services (
  id text primary key,
  name text not null,
  category text not null,
  description text not null default '',
  price_min integer not null default 500,
  price_max integer,
  duration_min integer not null default 60,
  duration_max integer,
  deposit_percent integer not null default 50,
  image text,
  available boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists salon_staff (
  id text primary key,
  name text not null,
  title text not null,
  role text not null,
  phone text,
  email text,
  service_ids text[] not null default '{}',
  active boolean not null default true
);

create table if not exists salon_media (
  id text primary key,
  kind text not null check (kind in ('service', 'gallery', 'staff', 'customer_ref', 'promo')),
  owner_id text,
  url text not null,
  alt text default '',
  sort_order int default 0,
  visible boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists salon_waitlist (
  id text primary key,
  customer_id text,
  phone text not null,
  customer_name text,
  service_id text not null,
  staff_id text,
  date_from text not null,
  date_to text not null,
  time_from text,
  time_to text,
  status text not null default 'waiting',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. Row Level Security & Anon Access
-- ------------------------------------------------------------
alter table "user" enable row level security;
alter table "session" enable row level security;
alter table "account" enable row level security;
alter table "verification" enable row level security;
alter table salon_staff_accounts enable row level security;

alter table salon_customers enable row level security;
alter table salon_appointments enable row level security;
alter table salon_queue enable row level security;
alter table salon_payments enable row level security;
alter table salon_notifications enable row level security;
alter table salon_reviews enable row level security;
alter table salon_offers enable row level security;
alter table salon_audit enable row level security;
alter table salon_settings enable row level security;
alter table salon_services enable row level security;
alter table salon_staff enable row level security;
alter table salon_media enable row level security;
alter table salon_waitlist enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'salon_customers','salon_appointments','salon_queue','salon_payments',
    'salon_notifications','salon_reviews','salon_offers','salon_audit',
    'salon_settings','salon_services','salon_staff','salon_media','salon_waitlist'
  ]
  loop
    execute format('drop policy if exists salon_anon_all on %I', t);
    execute format(
      'create policy salon_anon_all on %I for all to anon, authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;

-- ------------------------------------------------------------
-- 4. Clean Seed: Real Vet Care LTD Services & Staff
-- ------------------------------------------------------------
insert into salon_settings (key, value)
values
  ('salon_name', 'Vet Care LTD'),
  ('test_price_tsh', '500'),
  ('payment_provider', 'mpesa')
on conflict (key) do update set value = excluded.value;

-- Real Vet Care Services
insert into salon_services (id, name, category, description, price_min, price_max, duration_min, duration_max, deposit_percent, image, available)
values
  (
    'wellness-exam',
    'Health & Wellness Exam',
    'wellness',
    'A thorough physical examination with vital signs, weight check, and clear guidance tailored to your pet’s age and lifestyle.',
    35000, 55000, 30, 45, 30,
    '/images/vet/service-wellness.jpg',
    true
  ),
  (
    'vaccines-prevention',
    'Vaccines & Parasite Prevention',
    'vaccines',
    'Essential core vaccinations and parasite protection to keep your pet protected year-round, with official certificates.',
    45000, 75000, 20, 30, 30,
    '/images/vet/service-vaccine.jpg',
    true
  ),
  (
    'dental-care',
    'Dental Care & Hygiene',
    'dental',
    'Safe ultrasonic cleaning and polishing to remove tartar, prevent gum disease, and keep breath fresh.',
    50000, 120000, 45, 60, 40,
    '/images/vet/service-dental.jpg',
    true
  ),
  (
    'diagnostics',
    'Ultrasound & Lab Diagnostics',
    'diagnostics',
    'Fast, precise in-house diagnostics and imaging for quick answers and effective care plans.',
    60000, 150000, 30, 60, 40,
    '/images/vet/service-diagnostics.jpg',
    true
  ),
  (
    'medicated-grooming',
    'Medicated Pet Grooming',
    'grooming',
    'Gentle therapeutic baths and grooming to soothe sensitive skin and maintain coat vitality.',
    40000, 90000, 45, 75, 30,
    '/images/vet/service-grooming.jpg',
    true
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  price_min = excluded.price_min,
  price_max = excluded.price_max,
  duration_min = excluded.duration_min,
  duration_max = excluded.duration_max,
  deposit_percent = excluded.deposit_percent,
  image = excluded.image,
  available = excluded.available;

-- Clinic Veterinary Staff
insert into salon_staff (id, name, title, role, phone, email, service_ids, active)
values
  ('dr-amina', 'Dr. Amina Hassan', 'Lead Veterinarian', 'stylist', '+255 713 325 000', 'amina@vetcare.co.tz', array['wellness-exam', 'vaccines-prevention', 'diagnostics'], true),
  ('dr-james', 'Dr. James K.', 'Veterinary Surgeon & Dental Lead', 'stylist', '+255 713 325 000', 'james@vetcare.co.tz', array['dental-care', 'diagnostics', 'wellness-exam'], true),
  ('nurse-grace', 'Grace M.', 'Veterinary Technician & Groomer', 'stylist', '+255 713 325 000', 'grace@vetcare.co.tz', array['medicated-grooming', 'vaccines-prevention'], true)
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  role = excluded.role,
  service_ids = excluded.service_ids,
  active = excluded.active;
