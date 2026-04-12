import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

const PLATFORM_SERVER_URL = process.env.SUMMON_STREAM_SERVER_URL ?? "https://realtime.summonflow.com";
const PLATFORM_SERVER_TOKEN = process.env.SUMMON_STREAM_SERVER_TOKEN ?? "";

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

export async function GET() {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apps = await db.app.findMany({
    where: { organizationId: context.organization.id },
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

    const channels = (results as RemoteChannelResult[]).flatMap((r) =>
      r.channels.map((ch: RemoteChannel) => ({
        name: ch.name,
        appName: r.appName,
        appId: r.appId,
        subscriptionCount: ch.subscription_count ?? 0,
        occupied: ch.occupied ?? false,
      }))
    );

    return NextResponse.json({ channels });
  } catch {
    return NextResponse.json({ channels: [] });
  }
}
