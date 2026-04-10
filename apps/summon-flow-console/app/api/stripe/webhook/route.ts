import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db/client";
import Stripe from "stripe";

function getPeriodFromSub(sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  return {
    start: item ? new Date(item.current_period_start * 1000) : new Date(),
    end: item ? new Date(item.current_period_end * 1000) : new Date(),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!userId || !customerId || !subscriptionId) break;

      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const period = getPeriodFromSub(sub);

      await db.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan: "pro",
          status: sub.status,
          priceId: sub.items.data[0]?.price.id ?? null,
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
        },
        update: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan: "pro",
          status: sub.status,
          priceId: sub.items.data[0]?.price.id ?? null,
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
        },
      });
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const existing = await db.subscription.findUnique({
        where: { stripeSubscriptionId: sub.id },
      });
      if (!existing) break;

      const period = getPeriodFromSub(sub);

      await db.subscription.update({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const existing = await db.subscription.findUnique({
        where: { stripeSubscriptionId: sub.id },
      });
      if (!existing) break;

      await db.subscription.update({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "canceled", plan: "hobby" },
      });
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const existing = await db.subscription.findUnique({
        where: { stripeCustomerId: customerId },
      });
      if (!existing) break;

      await db.subscription.update({
        where: { stripeCustomerId: customerId },
        data: { status: "past_due" },
      });
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
