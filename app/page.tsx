import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCurrentBrand } from "@/lib/brand";

// This page is a Server Component: it runs on the server, fetches this
// brand's active products straight from Supabase, and sends plain HTML to
// the browser. Mobile-first: a single column by default, widening into a
// grid as the screen grows (sm:/md: breakpoints).
export default async function Home() {
  const brand = await getCurrentBrand();

  if (!brand) {
    return (
      <main className="p-6 sm:p-16">
        <p className="text-red-600">
          No brand is configured yet — the brands table is empty.
        </p>
      </main>
    );
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, description, price_cents, image_url")
    .eq("brand_id", brand.id)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="p-6 sm:p-16">
        <h1 className="text-2xl font-semibold mb-4">{brand.name}</h1>
        <p className="text-red-600">
          Could not load products from Supabase: {error.message}
        </p>
        <p className="text-zinc-500 mt-2">
          This usually means NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
          in .env.local are still placeholders. Fill them in with your real
          Supabase project values and restart the dev server.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 sm:p-16">
      <h1 className="text-2xl font-semibold mb-8">{brand.name}</h1>
      {products?.length === 0 ? (
        <p className="text-zinc-500">No active products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg p-4 hover:border-zinc-400 transition-colors"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full aspect-square rounded mb-3 bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
                  No photo yet
                </div>
              )}
              <h2 className="font-medium">{product.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">{product.description}</p>
              <p className="mt-2 font-semibold">
                ${(product.price_cents / 100).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
