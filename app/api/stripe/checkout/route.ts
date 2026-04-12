import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS } from "@/lib/stripe";
import { ensureOrganizationContext } from "@/lib/organization";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await req.json();

  if (priceId !== PLANS.PRO.priceId) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: context.user.email,
    metadata: { userId: context.user.id, organizationId: context.organization.id },
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.nextUrl.origin}/settings?success=true`,
    cancel_url: `${req.nextUrl.origin}/settings?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
