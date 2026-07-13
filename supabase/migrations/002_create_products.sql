-- Migration 002: products table
-- Every brand-specific table carries brand_id (see /docs/architecture.md).
-- This is what lets a second or third brand launch on the same schema
-- without touching this table's structure.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  description text,
  price_cents integer not null,
  image_url text,
  sku text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_brand_id_idx on products(brand_id);

comment on table products is 'Products for sale, scoped to a single brand via brand_id.';

-- Row Level Security: enabled from the first migration, not added later.
alter table products enable row level security;

-- Public (anon key) can only read products that are marked active.
-- Inactive/draft products stay invisible to the storefront until published.
create policy "Public can read active products"
  on products for select
  using (active = true);
