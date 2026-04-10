import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
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
