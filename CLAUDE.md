# Bloom With Me — Platform

@AGENTS.md

## What this is
Multi-tenant floral e-commerce platform. Two brands launch on it: Bloom With Me
(everyday delivery, blush/cream/mauve theme) and Bloom & Bijoux (commissioned
gallery pieces, dark jewel-tone theme). Built for a solo non-developer operator
who can direct Claude Code but cannot debug unassisted — code must be simple,
well-commented, and favor boring/proven patterns over clever ones.

## Stack (do not deviate without discussion)
- Next.js (App Router) on Vercel
- Supabase (Postgres + Auth + Storage)
- Stripe Checkout — HOSTED ONLY. Never write code that touches raw card
  data. Never store card numbers, CVVs, or full PANs anywhere in this repo.
  This is a hard rule, not a preference.
- Twilio for SMS, Resend for transactional email
- Tailwind CSS for styling

## Non-negotiable architecture rule
EVERY table that holds brand-specific data MUST include a `brand_id` column
referencing the `brands` table. No exceptions, even if it seems like
over-engineering for a single-brand MVP. This is what makes brand #2 and #3
nearly free later. See /docs/architecture.md once it exists.

## Security rules (enforced, not suggestions)
- Payments: Stripe Checkout redirect only. No custom card forms, ever.
- Secrets: all in .env.local (gitignored) or Vercel env vars. Never hardcoded,
  never pasted into chat, never committed.
- Customer PII (names, addresses, phone, gift messages): Supabase Row Level
  Security enabled on every table from the first migration, not added later.
- Every database migration must be a numbered file in /supabase/migrations —
  never edit the schema by hand in the Supabase dashboard for anything that
  needs to be reproducible.

## Working style
- Explain what you're doing in plain language before doing it — the operator
  is business-literate and technical-adjacent but not a developer.
- After any meaningful change, state in plain English how to verify it worked
  (a URL to visit, a command to run, what success looks like).
- Prefer many small commits with clear messages over large ones.
- If you hit a decision that affects cost, security, or scalability
  meaningfully, stop and ask rather than assuming.

## Do not build yet (deferred, see roadmap)
Customer accounts/loyalty, predictive stem-buying, native mobile apps, route
optimization, anything resembling in-house card storage.
