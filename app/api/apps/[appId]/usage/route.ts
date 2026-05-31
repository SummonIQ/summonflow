import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import {
  incrementUsage,
  getAppUsageSummary,
  recordChannelEvent,
  recordChannelSnapshot,
  type UsageMetric,
} from "@/lib/usage";

const METRICS: UsageMetric[] = [
  "connections",
  "messagesPublished",
  "messagesDelivered",
  "channelsActive",
];

async function resolveApp(appId: string, providedSecret?: string) {
  const app = await db.app.findUnique({ where: { id: appId } });
  if (!app) return null;
  if (!providedSecret || providedSecret !== app.secret) return null;
  return app;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ appId: string }> },
) {
  const { appId } = await params;
  const auth = req.headers.get("authorization") ?? "";
  const secret = auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
  const app = await resolveApp(appId, secret);
  if (!app) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { metric, delta, peakConnections, channelName, subscriptionCount, occupied, eventName, eventData, userId } = body as {
    metric?: string;
    delta?: number;
    peakConnections?: number;
    channelName?: string;
    subscriptionCount?: number;
    occupied?: boolean;
    eventName?: string;
    eventData?: unknown;
    userId?: string;
  };

  if (!metric || !METRICS.includes(metric as UsageMetric)) {
    return NextResponse.json(
      { error: `metric must be one of ${METRICS.join(", ")}` },
      { status: 400 },
    );
  }

  const d = typeof delta === "number" && Number.isFinite(delta) ? delta : 1;
  await incrementUsage(appId, metric as UsageMetric, d, {
    peakConnections:
      typeof peakConnections === "number" ? peakConnections : undefined,
  });
  if (channelName) {
    await recordChannelSnapshot(appId, channelName, {
      occupied: occupied ?? metric === "channelsActive",
      subscriptionCount: typeof subscriptionCount === "number" ? subscriptionCount : undefined,
    });
  }
  if (metric === "messagesPublished" && channelName && eventName) {
    await recordChannelEvent(appId, channelName, eventName, eventData, userId);
  }

  return NextResponse.json({ ok: true });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ appId: string }> },
) {
  const { appId } = await params;
  const summary = await getAppUsageSummary(appId);
  return NextResponse.json(summary);
}
