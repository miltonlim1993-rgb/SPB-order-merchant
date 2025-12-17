-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Categories
create table if not exists categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  sort_order serial
);

-- 2. Meat Categories (from config)
create table if not exists meat_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  tag_color text
);

-- 3. Option Groups
create table if not exists option_groups (
  id text primary key,
  name text not null,
  max_selection int default 1,
  is_required boolean default false,
  display_mode text,
  is_customization boolean default false
);

-- 4. Options
create table if not exists options (
  id uuid default uuid_generate_v4() primary key,
  option_group_id text references option_groups(id) on delete cascade,
  name text not null,
  price numeric default 0,
  type text,
  is_combo_trigger boolean default false
);

-- 5. Menu Items
create table if not exists menu_items (
  id text primary key,
  name text not null,
  price numeric default 0,
  category_name text references categories(name) on delete set null,
  description text,
  image_url text,
  is_hidden boolean default false,
  meat_type text,
  availability_schedule text
);

-- 6. Menu Item Option Groups (Many-to-Many)
create table if not exists menu_item_option_groups (
  menu_item_id text references menu_items(id) on delete cascade,
  option_group_id text references option_groups(id) on delete cascade,
  primary key (menu_item_id, option_group_id)
);

-- 7. Outlets
create table if not exists outlets (
  id text primary key,
  name text not null,
  address text,
  phone text,
  whatsapp_number text,
  is_active boolean default true,
  opening_time text,
  closing_time text,
  lat numeric,
  lng numeric
);

-- RLS Policies (Optional but recommended)
alter table categories enable row level security;
create policy "Public read access" on categories for select using (true);

alter table meat_categories enable row level security;
create policy "Public read access" on meat_categories for select using (true);

alter table option_groups enable row level security;
create policy "Public read access" on option_groups for select using (true);

alter table options enable row level security;
create policy "Public read access" on options for select using (true);

alter table menu_items enable row level security;
create policy "Public read access" on menu_items for select using (true);

alter table menu_item_option_groups enable row level security;
create policy "Public read access" on menu_item_option_groups for select using (true);

alter table outlets enable row level security;
create policy "Public read access" on outlets for select using (true);
