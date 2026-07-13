-- Seed data for local/dev use. Values here are placeholders — replace the
-- domain and theme_tokens once real brand details are decided.
-- Run automatically by `supabase db reset`, or paste manually into the
-- Supabase SQL editor for a hosted project.

insert into brands (domain, name, theme_tokens, sms_sender_name)
values (
  'bloomwithme.example.com',
  'Bloom With Me',
  '{"primary": "#D9A5A0", "secondary": "#F5E9E2", "accent": "#8C6A5D"}'::jsonb,
  'Bloom With Me'
)
on conflict (domain) do nothing;

-- Two sample products, just so the homepage grid (Step 4) has something to
-- show. Safe to delete once real product data exists.
insert into products (brand_id, name, description, price_cents, sku, active)
select id, 'Sample Bouquet — Blush & Cream', 'Placeholder product to verify the storefront chain works end to end.', 4500, 'SAMPLE-001', true
from brands where domain = 'bloomwithme.example.com'
on conflict do nothing;

insert into products (brand_id, name, description, price_cents, sku, active)
select id, 'Sample Bouquet — Mauve Garden', 'Placeholder product to verify the storefront chain works end to end.', 5200, 'SAMPLE-002', true
from brands where domain = 'bloomwithme.example.com'
on conflict do nothing;
