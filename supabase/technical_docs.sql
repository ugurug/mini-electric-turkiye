-- Teknik Kütüphane tablosu + güvenlik (RLS)
-- Supabase Dashboard → SQL Editor → yapıştır → Run

create table if not exists public.technical_docs (
  id            bigint generated always as identity primary key,
  title         text not null,
  slug          text unique not null,
  category      text,
  summary       text,
  content       text,                         -- makale gövdesi (## Başlık + paragraflar)
  enabled       boolean not null default true,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.technical_docs enable row level security;

-- Herkes (ziyaretçi) yalnızca AKTİF dokümanları okuyabilir
create policy "technical_docs_public_read"
  on public.technical_docs for select
  to anon, authenticated
  using (enabled = true);

-- Giriş yapmış adminler her şeyi yapabilir (okuma dahil, pasifleri de görür)
create policy "technical_docs_admin_all"
  on public.technical_docs for all
  to authenticated
  using (true) with check (true);
