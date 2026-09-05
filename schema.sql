-- ============================================================================
-- VOZARO GLOBAL RESOURCE LIMITED — Database Schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / DROP ... IF EXISTS guards where sensible.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── ENUM TYPES ──────────────────────────────────────────────────────────────
do $$ begin
  create type product_type as enum ('PHYSICAL', 'DIGITAL_BOOK');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('PENDING', 'CONTACTED', 'INVOICED', 'FULFILLED', 'CANCELLED');
exception when duplicate_object then null; end $$;

-- ── ADMIN USERS ─────────────────────────────────────────────────────────────
-- Authentication itself is handled by Supabase Auth (auth.users) — passwords
-- are never stored in application tables. This table is a whitelist that maps
-- an auth.users.id to an admin profile. There is intentionally NO public
-- signup route; admins are created via `npm run seed:admin` or the Supabase
-- dashboard, then inserted into this table.
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

-- ── SERVICES ─────────────────────────────────────────────────────────────────
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  icon_name text not null default 'Sun',
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── PRODUCTS ─────────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type product_type not null default 'PHYSICAL',
  description text not null default '',
  price numeric(12,2) not null default 0,
  specifications jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  selar_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── ORDERS ───────────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  product_id uuid references products(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text,
  additional_notes text,
  status order_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_products_type on products(type);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_services_slug on services(slug);

-- ── updated_at triggers ───────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute procedure set_updated_at();

drop trigger if exists trg_services_updated_at on services;
create trigger trg_services_updated_at before update on services
  for each row execute procedure set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
  for each row execute procedure set_updated_at();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table admin_users enable row level security;
alter table services enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Public (anon) can read services & products — needed for the public website.
drop policy if exists "public read services" on services;
create policy "public read services" on services for select using (true);

drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);

-- Public (anon) can INSERT orders only — the order/consultation form.
-- They cannot read, update, or delete orders (that's admin-only).
drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders for insert
  with check (true);

-- Only authenticated admins (present in admin_users) can read/write everything.
drop policy if exists "admin full access services" on services;
create policy "admin full access services" on services for all
  using (exists (select 1 from admin_users where id = auth.uid()))
  with check (exists (select 1 from admin_users where id = auth.uid()));

drop policy if exists "admin full access products" on products;
create policy "admin full access products" on products for all
  using (exists (select 1 from admin_users where id = auth.uid()))
  with check (exists (select 1 from admin_users where id = auth.uid()));

drop policy if exists "admin full access orders" on orders;
create policy "admin full access orders" on orders for all
  using (exists (select 1 from admin_users where id = auth.uid()))
  with check (exists (select 1 from admin_users where id = auth.uid()));

drop policy if exists "admin read own row" on admin_users;
create policy "admin read own row" on admin_users for select
  using (id = auth.uid());

-- ── SEED DATA (Vozaro's real services from the roll-up banner) ──────────────
insert into services (title, slug, description, icon_name, sort_order) values
  ('Solar Installation', 'solar-installation', 'Sales and installation of solar energy modules — panels, inverters, and battery banks sized to your home or business.', 'Sun', 1),
  ('Inverter Setup & Repair', 'inverter-setup-repair', 'Professional inverter installation, configuration, and repair to keep your backup power running when you need it.', 'BatteryCharging', 2),
  ('System Maintenance', 'system-maintenance', 'Scheduled maintenance and servicing for solar and inverter systems to protect your investment long-term.', 'Wrench', 3),
  ('Electrical & CCTV Installation', 'electrical-cctv-installation', 'Electrical wiring, CCTV installation, and electric fence setup for homes and businesses.', 'ShieldCheck', 4),
  ('Audits & Distribution Networks', 'audits-distribution-networks', 'Energy audits, training, and distribution network support to plan the right system for your needs.', 'ClipboardCheck', 5)
on conflict (slug) do nothing;

-- ============================================================================
-- ADMIN CREATION (do this AFTER running `npm run seed:admin` — see README.md)
-- The seed script creates the Supabase Auth user AND inserts the matching
-- row into admin_users automatically. No manual SQL needed for that step.
-- ============================================================================
