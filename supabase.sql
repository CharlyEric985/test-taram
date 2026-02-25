-- =========================
-- DROP TRIGGERS, FUNCTIONS, TABLES
-- =========================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;
drop function if exists public.insert_property;
drop table if exists properties cascade;
drop table if exists profiles cascade;

-- =========================
-- TABLE PROFILES
-- =========================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('agent','client')) not null default 'client',
  firstname text,
  lastname text,
  created_at timestamp default now()
);

-- =========================
-- TABLE PROPERTIES
-- =========================
create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric not null check (price >= 0),
  city text not null,
  agent_id uuid not null references profiles(id) on delete cascade,
  is_published boolean default false,
  created_at timestamp default now()
);

-- =========================
-- INDEX PERFORMANCE
-- =========================
create index idx_properties_agent on properties(agent_id);
create index idx_properties_city on properties(city);
create index idx_properties_published on properties(is_published);

-- =========================
-- TRIGGER CREATE PROFILE AUTOMATIQUE
-- =========================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =========================
-- FONCTION SECURISEE POUR INSERT
-- =========================
create or replace function public.insert_property(
  p_title text,
  p_description text,
  p_price numeric,
  p_city text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Vérifie que l'utilisateur est un agent
  if not exists (
    select 1 from profiles where id = auth.uid() and role='agent'
  ) then
    raise exception 'Only agents can insert properties';
  end if;

  -- Insère en forçant agent_id = auth.uid()
  insert into properties(title, description, price, city, agent_id)
  values (p_title, p_description, p_price, p_city, auth.uid());
end;
$$;

-- =========================
-- ACTIVER RLS
-- =========================
alter table profiles enable row level security;
alter table properties enable row level security;

-- =========================
-- POLICIES PROFILES
-- =========================
create policy "Users can read own profile"
on profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles
for update
using (auth.uid() = id);

-- =========================
-- POLICIES PROPERTIES
-- =========================
-- UPDATE seulement agents propriétaires
create policy "Only agents can update own properties"
on properties
for update
using (
  auth.uid() = agent_id
  and exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'agent'
  )
);

-- SELECT biens publiés pour tous
create policy "Read published properties"
on properties
for select
using (is_published = true);

-- SELECT biens propres pour agent
create policy "Agent read own properties"
on properties
for select
using (auth.uid() = agent_id);
