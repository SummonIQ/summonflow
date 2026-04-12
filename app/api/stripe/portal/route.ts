import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await db.subscription.findUnique({
    where: { organizationId: context.organization.id },
  });

  if (!subscription) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${req.nextUrl.origin}/settings`,
  });

  return NextResponse.json({ url: portalSession.url });
}
