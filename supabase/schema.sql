-- HANIA Electronics — Supabase schema (Sydney empty project)
-- Run in Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

-- Categories
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  image text,
  featured boolean not null default false,
  sort_order int not null default 99,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  category_id text not null references public.categories(id) on delete restrict,
  subcategory text,
  short_description text not null default '',
  description text not null default '',
  price numeric(12,2) not null default 0,
  sale_price numeric(12,2),
  compare_at_price numeric(12,2),
  stock_quantity int not null default 0,
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock','out_of_stock','preorder')),
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  sale_badge boolean not null default false,
  manual_badges jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  features jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_published_idx on public.products(published);

-- Banners
create table if not exists public.banners (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  cta_text text not null default 'Shop Now',
  cta_link text not null default '/shop',
  desktop_image text not null,
  mobile_image text not null,
  active boolean not null default true,
  sort_order int not null default 99,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Announcement (single-row style; keep id)
create table if not exists public.announcement_bar (
  id text primary key,
  text text not null default '',
  link text,
  link_target text not null default '_self' check (link_target in ('_self','_blank')),
  background_color text not null default '#0B6BCB',
  text_color text not null default '#FFFFFF',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Homepage merchandising
create table if not exists public.homepage_config (
  id text primary key default 'homepage',
  featured_category_ids jsonb not null default '[]'::jsonb,
  featured_product_ids jsonb not null default '[]'::jsonb,
  best_seller_product_ids jsonb not null default '[]'::jsonb,
  new_arrival_product_ids jsonb not null default '[]'::jsonb,
  sale_product_ids jsonb not null default '[]'::jsonb,
  marketing_banner_id text,
  sections jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id text primary key,
  order_number text not null unique,
  customer jsonb not null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_method text not null default 'cod',
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_order_number_idx on public.orders(order_number);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;
alter table public.announcement_bar enable row level security;
alter table public.homepage_config enable row level security;
alter table public.orders enable row level security;

-- Public reads
drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories"
  on public.categories for select
  using (active = true);

drop policy if exists "Public read published products" on public.products;
create policy "Public read published products"
  on public.products for select
  using (published = true);

drop policy if exists "Public read active banners" on public.banners;
create policy "Public read active banners"
  on public.banners for select
  using (active = true);

drop policy if exists "Public read announcement" on public.announcement_bar;
create policy "Public read announcement"
  on public.announcement_bar for select
  using (true);

drop policy if exists "Public read homepage" on public.homepage_config;
create policy "Public read homepage"
  on public.homepage_config for select
  using (true);

-- Orders: guests cannot list; tracking goes through service role API
-- No public select on orders (API uses service role)

-- Storage bucket for uploads (admin API uses service role)
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read uploads" on storage.objects;
create policy "Public read uploads"
  on storage.objects for select
  using (bucket_id = 'uploads');

-- Site / store contact settings (Admin → Store settings)
create table if not exists public.site_settings (
  id text primary key default 'main',
  store_name text not null default 'HANIA ELECTRONICS',
  tagline text not null default '',
  support_line text not null default '',
  email text not null default '',
  address text not null default '',
  facebook_url text not null default '',
  map_url text not null default '',
  whatsapp text not null default '',
  whatsapp_e164 text not null default '',
  phone_primary text not null default '',
  phone_primary_display text not null default '',
  phone_secondary text not null default '',
  phone_secondary_display text not null default '',
  phone_landline text not null default '',
  phone_landline_display text not null default '',
  contacts jsonb not null default '[]'::jsonb,
  business_hours jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings for select
  using (true);
