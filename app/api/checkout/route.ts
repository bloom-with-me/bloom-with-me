import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// STUB — not wired to a live Stripe key yet. This route will eventually
// take a product ID + quantity and redirect the browser to a hosted
// Stripe Checkout session. Per CLAUDE.md: Checkout redirect ONLY — this
// codebase must never collect or touch raw card numbers itself.

export async function POST(request: NextRequest) {
  const { productId, quantity } = await request.json();

  if (!productId || !quantity) {
    return NextResponse.json(
      { error: "productId and quantity are required" },
      { status: 400 }
    );
  }

  // TODO: once STRIPE_SECRET_KEY is set in .env.local, uncomment and finish:
  //
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  //
  // 1. Look up the product in Supabase by productId to get its real
  //    price_cents and name (never trust a price sent from the browser).
  // 2. Create the session:
  //    const session = await stripe.checkout.sessions.create({
  //      mode: "payment",
  //      line_items: [{
  //        price_data: {
  //          currency: "usd",
  //          product_data: { name: product.name },
  //          unit_amount: product.price_cents,
  //        },
  //        quantity,
  //      }],
  //      success_url: `${request.nextUrl.origin}/checkout/success`,
  //      cancel_url: `${request.nextUrl.origin}/checkout/cancelled`,
  //    });
  // 3. Redirect the browser to session.url.

  return NextResponse.json(
    { error: "Checkout is not wired up yet — STRIPE_SECRET_KEY is missing." },
    { status: 501 }
  );
}
