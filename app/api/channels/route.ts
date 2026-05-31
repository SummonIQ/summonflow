import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

const PLATFORM_SERVER_URL =
  process.env.SUMMONFLOW_SERVER_URL ??
  process.env.SUMMON_STREAM_SERVER_URL ??
  "https://realtime.summonflow.com";
const PLATFORM_SERVER_TOKEN =
  process.env.SUMMONFLOW_SERVER_TOKEN ??
  process.env.SUMMON_STREAM_SERVER_TOKEN ??
  "";

type AppSummary = {
  id: string;
  name: string;
  key: string;
};

type RemoteChannel = {
  name: string;
  subscription_count: number;
  occupied: boolean;
};

type RemoteChannelResult = {
  appId: string;
  appName: string;
  channels: RemoteChannel[];
};

type ChannelResponse = {
  name: string;
  appName: string;
  appId: string;
  subscriptionCount: number;
  occupied: boolean;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
};

export async function GET(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const selectedAppId = req.nextUrl.searchParams.get("appId");
  if (!selectedAppId) {
    return NextResponse.json({ channels: [] });
  }

  const apps = await db.app.findMany({
    where: { organizationId: context.organization.id, id: selectedAppId },
    select: { id: true, name: true, key: true },
  });

  if (apps.length === 0) {
    return NextResponse.json({ channels: [] });
  }

  try {
    const results = await Promise.all(
      apps.map(async (app: AppSummary) => {
        try {
          const res = await fetch(`${PLATFORM_SERVER_URL}/apps/${app.key}/channels`, {
            headers: { Authorization: `Bearer ${PLATFORM_SERVER_TOKEN}` },
            signal: AbortSignal.timeout(5000),
          });
          if (!res.ok) return { appId: app.id, appName: app.name, channels: [] };
          const data = await res.json();
          return {
            appId: app.id,
            appName: app.name,
            channels: data.channels ?? [],
          };
        } catch {
          return { appId: app.id, appName: app.name, channels: [] };
        }
      })
    );

    const persisted = await db.channel.findMany({
      where: { appId: selectedAppId },
      orderBy: { lastSeenAt: "desc" },
      select: { name: true, appId: true, firstSeenAt: true, lastSeenAt: true },
    });

    const appById = new Map(apps.map((app) => [app.id, app]));
    const channelByKey = new Map<string, ChannelResponse>(
      persisted.map((channel) => [
        `${channel.appId}:${channel.name}`,
        {
          name: channel.name,
          appName: appById.get(channel.appId)?.name ?? "Unknown app",
          appId: channel.appId,
          subscriptionCount: 0,
          occupied: false,
          firstSeenAt: channel.firstSeenAt.toISOString(),
          lastSeenAt: channel.lastSeenAt.toISOString(),
        },
      ]),
    );

    for (const result of results as RemoteChannelResult[]) {
      for (const ch of result.channels) {
        channelByKey.set(`${result.appId}:${ch.name}`, {
          name: ch.name,
          appName: result.appName,
          appId: result.appId,
          subscriptionCount: ch.subscription_count ?? 0,
          occupied: ch.occupied ?? false,
          firstSeenAt: channelByKey.get(`${result.appId}:${ch.name}`)?.firstSeenAt ?? null,
          lastSeenAt: new Date().toISOString(),
        });
      }
    }

    const channels = [...channelByKey.values()];

    return NextResponse.json({ channels });
  } catch {
    return NextResponse.json({ channels: [] });
  }
}
