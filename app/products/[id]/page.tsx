import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentBrand } from "@/lib/brand";

type Props = {
  params: Promise<{ id: string }>;
};

// Looks up one product, always scoped to the current brand's id — not just
// the product's own id. This is the brand_id defense-in-depth check from
// /docs/architecture.md: a product id belonging to a different brand (or an
// inactive/nonexistent product) should 404, never leak through.
async function getProduct(id: string) {
  const brand = await getCurrentBrand();
  if (!brand) return null;

  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, price_cents, image_url")
    .eq("id", id)
    .eq("brand_id", brand.id)
    .eq("active", true)
    .maybeSingle();

  return product;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product ? product.name : "Product not found" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="p-6 sm:p-16">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
        ← Back to all flowers
      </Link>

      <div className="flex flex-col sm:flex-row gap-8 mt-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full sm:w-1/2 aspect-square object-cover rounded-lg"
          />
        ) : (
          <div className="w-full sm:w-1/2 aspect-square rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
            No photo yet
          </div>
        )}

        <div className="sm:w-1/2">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-zinc-600 mt-3">{product.description}</p>
          <p className="mt-4 text-xl font-semibold">
            ${(product.price_cents / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </main>
  );
}
