import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";
import { getAppUsageSummary } from "@/lib/usage";

const BASIC_APPLICATION_LIMIT = 1;
const PAID_APPLICATION_LIMIT_PLANS = new Set(["pro", "enterprise"]);

export async function GET() {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apps = await db.app.findMany({
    where: { organizationId: context.organization.id },
    include: {
      channelPolicies: true,
      _count: { select: { channelPolicies: true, webhooks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const withUsage = await Promise.all(
    apps.map(async (app) => {
      let usage = { connections: 0, peakConnections: 0, messagesPublished: 0, messagesDelivered: 0 };
      try {
        usage = await getAppUsageSummary(app.id);
      } catch (err) {
        console.error("usage summary failed for app", app.id, err);
      }
      return { ...app, usage };
    }),
  );

  return NextResponse.json(withUsage);
}

export async function POST(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const [appCount, subscription] = await Promise.all([
    db.app.count({ where: { organizationId: context.organization.id } }),
    db.subscription.findUnique({ where: { organizationId: context.organization.id } }),
  ]);
  const hasPaidLimit = subscription
    && ["active", "trialing"].includes(subscription.status)
    && PAID_APPLICATION_LIMIT_PLANS.has(subscription.plan);

  if (!hasPaidLimit && appCount >= BASIC_APPLICATION_LIMIT) {
    return NextResponse.json({
      error: "Basic plan is limited to 1 application. Upgrade to Pro to create more applications.",
      code: "APPLICATION_LIMIT_REACHED",
      limit: BASIC_APPLICATION_LIMIT,
    }, { status: 403 });
  }

  const app = await db.app.create({
    data: {
      name: name.trim(),
      userId: context.user.id,
      organizationId: context.organization.id,
    },
  });

  return NextResponse.json(app, { status: 201 });
}
