-- Site geneli ayarlar (tek satır) — panelden yönetilir
-- Supabase Dashboard → SQL Editor → yapıştır → Run
create table if not exists public.site_settings (
  id           int primary key default 1,
  join_enabled boolean not null default true,                                    -- "Kulübe Katıl" butonu açık/kapalı
  join_url     text not null default 'https://www.jotform.com/form/251503841296053',
  updated_at   timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "site_settings_public_read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings_admin_all"
  on public.site_settings for all
  to authenticated
  using (true) with check (true);
