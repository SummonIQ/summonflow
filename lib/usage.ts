import { db } from "@/lib/db/client";

export type UsageMetric =
  | "connections"
  | "messagesPublished"
  | "messagesDelivered"
  | "channelsActive";

function today(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function incrementUsage(
  appId: string,
  metric: UsageMetric,
  delta = 1,
  opts?: { peakConnections?: number },
) {
  const date = today();
  const existing = await db.usageStat.findUnique({
    where: { appId_date: { appId, date } },
    select: { peakConnections: true },
  });

  const nextPeak =
    metric === "connections" && opts?.peakConnections !== undefined
      ? Math.max(existing?.peakConnections ?? 0, opts.peakConnections)
      : undefined;

  return db.usageStat.upsert({
    where: { appId_date: { appId, date } },
    create: {
      appId,
      date,
      [metric]: delta,
      ...(nextPeak !== undefined ? { peakConnections: nextPeak } : {}),
    },
    update: {
      [metric]: { increment: delta },
      ...(nextPeak !== undefined ? { peakConnections: nextPeak } : {}),
    },
  });
}

export async function getAppUsageSummary(appId: string, days = 30) {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - days + 1);

  const agg = await db.usageStat.aggregate({
    where: { appId, date: { gte: since } },
    _sum: {
      connections: true,
      messagesPublished: true,
      messagesDelivered: true,
    },
    _max: { peakConnections: true },
  });

  return {
    connections: agg._sum.connections ?? 0,
    messagesPublished: agg._sum.messagesPublished ?? 0,
    messagesDelivered: agg._sum.messagesDelivered ?? 0,
    peakConnections: agg._max.peakConnections ?? 0,
  };
}

export async function recordChannelSnapshot(
  appId: string,
  channelName: string,
  opts?: { occupied?: boolean; subscriptionCount?: number },
) {
  const name = channelName.trim();
  if (!name) {
    return null;
  }

  return db.channel.upsert({
    where: { appId_name: { appId, name } },
    create: {
      appId,
      name,
      occupied: opts?.occupied ?? false,
      subscriptionCount: opts?.subscriptionCount ?? 0,
    },
    update: {
      occupied: opts?.occupied ?? false,
      subscriptionCount: opts?.subscriptionCount ?? 0,
    },
  });
}

export async function recordChannelEvent(
  appId: string,
  channelName: string,
  eventName: string,
  payload?: unknown,
  userId?: string,
) {
  const name = channelName.trim();
  const event = eventName.trim();
  if (!name || !event) {
    return null;
  }

  await recordChannelSnapshot(appId, name, { occupied: false, subscriptionCount: 0 });

  return db.channelEvent.create({
    data: {
      appId,
      channelName: name,
      eventName: event,
      payload: payload === undefined ? undefined : JSON.parse(JSON.stringify(payload)),
      userId: userId || undefined,
    },
  });
}
