import { createClient } from "@supabase/supabase-js";

// Public, read-only client — safe to use in Server Components and API
// routes that only need the access the anon key + RLS policies allow
// (e.g. reading active products). Anything that needs to bypass RLS
// (admin dashboards, webhooks) should use the service role key instead,
// in a server-only file that is never imported into client components.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
