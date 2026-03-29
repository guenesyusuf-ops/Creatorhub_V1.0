-- ============================================
-- CreatorHub Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- USERS TABLE
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'read', -- 'admin', 'read', 'creator'
  status text not null default 'pending', -- 'active', 'pending'
  must_change_password boolean default true,
  created_at timestamptz default now()
);

-- CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text default '📁',
  position integer default 0,
  created_at timestamptz default now()
);

-- CREATORS TABLE
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  initials text not null,
  color_from text default '#7c3aed',
  color_to text default '#c8f035',
  category_id uuid references public.categories(id) on delete cascade,
  invite_code text unique,
  user_id uuid references public.users(id),
  created_at timestamptz default now()
);

-- DATES TABLE
create table if not exists public.dates (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete cascade,
  month text not null, -- format: YYYY-MM
  created_at timestamptz default now(),
  unique(creator_id, month)
);

-- LINKS TABLE
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  date_id uuid references public.dates(id) on delete cascade,
  creator_id uuid references public.creators(id) on delete cascade,
  title text not null,
  url text not null,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- SEED DEFAULT CATEGORIES
insert into public.categories (name, icon, position) values
  ('Bilder', '🖼️', 1),
  ('Videos', '🎬', 2),
  ('Influencer Videos', '⭐', 3)
on conflict do nothing;

-- SEED ADMIN USER (password: Admin1234! — will be forced to change)
-- bcrypt hash of 'Admin1234!'
insert into public.users (name, email, password_hash, role, status, must_change_password) values
  ('Admin', 'marketing@filapen.de', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', false)
on conflict (email) do nothing;
