-- Site / store contact settings (editable from Admin)
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
