-- Схема для Supabase. Выполнить целиком в SQL Editor. Можно запускать повторно.
-- Перед этим включить Authentication → Sign In / Providers → Anonymous Sign-Ins.

create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('playground','toilet','ramp','obstacle','cafe','shop','event')),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  ages text[] not null default '{}',
  starts_at timestamptz,
  price integer check (price >= 0),
  organizer text,
  author_id uuid not null default auth.uid(),
  author_name text not null check (char_length(author_name) between 1 and 40),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  pin_id uuid not null references public.pins(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 1 and 1000),
  author_id uuid not null default auth.uid(),
  author_name text not null check (char_length(author_name) between 1 and 40),
  created_at timestamptz not null default now()
);

alter table public.pins enable row level security;
alter table public.reviews enable row level security;

-- Читать могут все, кто вошёл (включая анонимный вход).
drop policy if exists "pins read" on public.pins;
create policy "pins read" on public.pins for select to authenticated using (true);
drop policy if exists "reviews read" on public.reviews;
create policy "reviews read" on public.reviews for select to authenticated using (true);

-- Писать и удалять можно только своё.
drop policy if exists "pins insert own" on public.pins;
create policy "pins insert own" on public.pins for insert to authenticated with check (author_id = auth.uid());
drop policy if exists "reviews insert own" on public.reviews;
create policy "reviews insert own" on public.reviews for insert to authenticated with check (author_id = auth.uid());
drop policy if exists "pins delete own" on public.pins;
create policy "pins delete own" on public.pins for delete to authenticated using (author_id = auth.uid());
drop policy if exists "reviews delete own" on public.reviews;
create policy "reviews delete own" on public.reviews for delete to authenticated using (author_id = auth.uid());

-- Жалобы на метки и отзывы. Отправлять может любой вошедший, читать — только владелец проекта
-- (в панели Supabase: Table Editor → reports). Политики на select нет, значит из приложения не прочитать.
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  pin_id uuid references public.pins(id) on delete cascade,
  review_id uuid references public.reviews(id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 500),
  reporter_id uuid not null default auth.uid(),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "reports insert own" on public.reports;
create policy "reports insert own" on public.reports for insert to authenticated with check (reporter_id = auth.uid());

-- Права для роли authenticated (анонимный вход тоже даёт эту роль).
-- Нужны на случай, если при создании проекта отключено «Automatically expose new tables».
-- Доступ к строкам всё равно ограничивают политики выше.
grant usage on schema public to authenticated;
grant select, insert, delete on public.pins to authenticated;
grant select, insert, delete on public.reviews to authenticated;
grant insert on public.reports to authenticated;

-- Миграция 2 (препятствия и проезд с коляской). Можно запускать повторно.
alter table public.pins add column if not exists tags text[] not null default '{}';
alter table public.pins add column if not exists stroller text check (stroller in ('yes','partial','no'));
