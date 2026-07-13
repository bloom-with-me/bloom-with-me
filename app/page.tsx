import { supabase } from "@/lib/supabase";

// This page is a Server Component: it runs on the server, fetches products
// straight from Supabase, and sends plain HTML to the browser. There's no
// design here yet — the goal of this page is just to prove the chain works:
// Supabase -> Next.js -> browser.
export default async function Home() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, description, price_cents")
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="p-16">
        <h1 className="text-2xl font-semibold mb-4">Bloom With Me</h1>
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
    <main className="p-16">
      <h1 className="text-2xl font-semibold mb-8">Bloom With Me</h1>
      {products?.length === 0 ? (
        <p className="text-zinc-500">No active products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <h2 className="font-medium">{product.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">{product.description}</p>
              <p className="mt-2 font-semibold">
                ${(product.price_cents / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
