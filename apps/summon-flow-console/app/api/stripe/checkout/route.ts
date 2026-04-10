import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { auth } from "@/lib/auth/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await req.json();

  if (priceId !== PLANS.PRO.priceId) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    metadata: { userId: session.user.id },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.nextUrl.origin}/settings?success=true`,
    cancel_url: `${req.nextUrl.origin}/settings?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
