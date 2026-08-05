-- Topluluk Rakamları — tek satırlık, panelden düzenlenir
-- Supabase Dashboard → SQL Editor → yapıştır → Run
create table if not exists public.community_stats (
  id             int primary key default 1,
  members        int not null default 0,       -- toplam üye
  cities         int not null default 0,       -- şehir sayısı
  models         jsonb not null default '[]'::jsonb,  -- [{label, value}]
  colors         jsonb not null default '[]'::jsonb,  -- [{label, value, hex}]
  cities_dist    jsonb not null default '[]'::jsonb,  -- [{label, value}]
  growth         jsonb not null default '[]'::jsonb,  -- [{label(yıl), value}]
  survey_summary text,                                -- kasko anketi özeti
  updated_at     timestamptz not null default now(),
  constraint community_stats_single_row check (id = 1)
);

-- tek satırı oluştur (yoksa)
insert into public.community_stats (id) values (1)
on conflict (id) do nothing;

alter table public.community_stats enable row level security;

create policy "community_stats_public_read"
  on public.community_stats for select
  to anon, authenticated
  using (true);

create policy "community_stats_admin_all"
  on public.community_stats for all
  to authenticated
  using (true) with check (true);
