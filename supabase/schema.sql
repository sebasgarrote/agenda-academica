-- Agenda Académica: esquema para un proyecto Supabase nuevo
-- No ejecutar si ya existen las tablas, salvo que se necesite recrearlas.

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  short_name text not null,
  color text not null default '#10B981',
  year integer not null default 2026,
  semester text not null default 'Segundo',
  status text not null default 'activa',
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  type text not null,
  description text,
  start_date date not null,
  due_date date not null,
  due_time time,
  status text not null default 'Pendiente',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  days_before jsonb not null default '[3, 1, 0]'::jsonb,
  notifications_enabled boolean not null default true,
  campus_url text not null default 'https://tua.sied.utn.edu.ar/my/index.php',
  push_subscription jsonb,
  updated_at timestamptz not null default now()
);

alter table public.subjects enable row level security;
alter table public.activities enable row level security;
alter table public.notification_preferences enable row level security;

drop policy if exists "Acceso propio a materias" on public.subjects;
create policy "Acceso propio a materias" on public.subjects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Acceso propio a actividades" on public.activities;
create policy "Acceso propio a actividades" on public.activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Acceso propio a preferencias" on public.notification_preferences;
create policy "Acceso propio a preferencias" on public.notification_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists activities_user_due_date_idx
  on public.activities (user_id, due_date);
