-- Etkinlik detay sayfası için uzun metin alanı
-- Supabase Dashboard → SQL Editor → yapıştır → Run
alter table public.events
  add column if not exists content text;
