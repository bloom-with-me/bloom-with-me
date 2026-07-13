-- Migration 001: brands table
-- This is the top of the multi-tenant hierarchy. Every brand-specific table
-- in later migrations points back to a row in this table via brand_id.
-- See /docs/architecture.md for why this pattern exists.

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  domain text not null unique,
  name text not null,
  theme_tokens jsonb not null default '{}'::jsonb,
  stripe_account_id text,
  sms_sender_name text,
  created_at timestamptz not null default now()
);

comment on table brands is 'One row per storefront brand (e.g. Bloom With Me, Bloom & Bijoux). theme_tokens holds colors/fonts for that brand''s UI.';

-- Row Level Security: enabled from the first migration, not bolted on later.
-- Brand name/domain/theme are public info (needed to render the storefront),
-- but nothing can INSERT/UPDATE/DELETE through the public anon key.
alter table brands enable row level security;

create policy "Public can read brands"
  on brands for select
  using (true);

