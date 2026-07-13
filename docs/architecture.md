# Architecture: the `brand_id` pattern

## The problem it solves

This platform will eventually run more than one storefront: Bloom With Me
today, Bloom & Bijoux (and maybe others) later. Those brands share the same
codebase, the same database, and the same hosting — but their products,
theming, and orders must never mix.

The naive way to support a second brand is to copy the whole codebase and
database and stand up a second deployment. That doubles the maintenance work
forever: every bug fix, every migration, every feature has to be done twice.

## The pattern

Instead, every table that holds brand-specific data has a `brand_id` column
— a foreign key pointing at a row in the `brands` table. One codebase, one
database, one deployment. A single `products` table holds every brand's
products; a `brand_id` column says which brand each row belongs to.

```
brands
  id ─────────────┐
  domain          │
  name            │
  theme_tokens    │
                   │
products          │
  id               │
  brand_id ────────┘   <- foreign key back to brands.id
  name
  price_cents
  ...
```

When the storefront loads, it looks at which domain the visitor is on (e.g.
`bloomwithme.com` vs `bloomandbijoux.com`), finds the matching row in
`brands`, and then only queries `products` (and later, orders, customers,
etc.) `where brand_id = that brand's id`. The `theme_tokens` column on
`brands` holds that brand's colors, so the same components render
differently per brand without any code branching.

## Why this is worth the extra column now

Adding `brand_id` to a table costs almost nothing on day one — it's one
extra column and one extra `.eq("brand_id", ...)` filter in every query.
Retrofitting it after the fact is a real migration: every existing row needs
a value backfilled, every query in the codebase needs to be found and
updated, and there's real risk of one brand's data leaking into another's
storefront during the transition.

Because we pay that small cost upfront, launching Bloom & Bijoux later is
mostly a matter of: add a row to `brands`, point its domain at the app,
upload its products with the right `brand_id`, and set its theme colors.
No schema changes, no rewritten queries.

## Row Level Security ties into this too

Every table also has Supabase Row Level Security (RLS) turned on from its
first migration (see `/supabase/migrations`). Today the policies are simple
("anyone can read active products"), but the same `brand_id` column is what
will let us write policies later like "a brand's staff can only see that
brand's orders" — the isolation the whole pattern exists for is enforced at
the database level, not just in application code.

## Rule of thumb for new tables

Building a new table that stores anything brand-specific (products, orders,
delivery zones, gift messages, promo codes, etc.)? It needs a `brand_id`
column referencing `brands(id)`, and RLS turned on in the same migration
that creates it. This isn't optional — see `CLAUDE.md`.
