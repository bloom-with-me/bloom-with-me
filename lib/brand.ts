import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

export type Brand = {
  id: string;
  domain: string;
  name: string;
  theme_tokens: Record<string, unknown>;
  stripe_account_id: string | null;
  sms_sender_name: string | null;
  created_at: string;
};

// Resolves which brand this request belongs to, based on the domain the
// visitor is on — see /docs/architecture.md for why every storefront page
// needs to know this. Falls back to the oldest brand row when the host
// doesn't match anything, which is what makes localhost work in local dev
// before any real domain is bound to a brand.
export async function getCurrentBrand(): Promise<Brand | null> {
  const headersList = await headers();
  const host = headersList.get("host")?.split(":")[0] ?? "";

  const { data: matched } = await supabase
    .from("brands")
    .select("*")
    .eq("domain", host)
    .maybeSingle();

  if (matched) return matched;

  const { data: fallback } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return fallback ?? null;
}
