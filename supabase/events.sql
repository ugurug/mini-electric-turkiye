-- Etkinlikler tablosu + güvenlik (RLS)
-- Supabase Dashboard → SQL Editor → yapıştır → "Run and enable RLS"

create table if not exists public.events (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text,
  location    text,
  event_date  timestamptz,
  category    text,                         -- Buluşma / Sürüş / Sergi / İşbirliği
  images      jsonb not null default '[]'::jsonb,
  enabled     boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "events_public_read"
  on public.events for select
  to anon, authenticated
  using (enabled = true);

create policy "events_admin_all"
  on public.events for all
  to authenticated
  using (true) with check (true);
