-- İş Birlikleri (partnerler) tablosu + güvenlik (RLS)
-- Supabase Dashboard → SQL Editor → yapıştır → Run
create table if not exists public.partners (
  id            bigint generated always as identity primary key,
  name          text not null,
  description   text,                         -- kısa açıklama
  benefit       text,                         -- üyelere özel fayda / indirim
  url           text,                         -- firma web / link (opsiyonel)
  logo          text,                         -- logo görsel URL'si
  category      text,                         -- Servis / Sigorta / Aksesuar / Şarj vb.
  enabled       boolean not null default true,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.partners enable row level security;

create policy "partners_public_read"
  on public.partners for select
  to anon, authenticated
  using (enabled = true);

create policy "partners_admin_all"
  on public.partners for all
  to authenticated
  using (true) with check (true);
