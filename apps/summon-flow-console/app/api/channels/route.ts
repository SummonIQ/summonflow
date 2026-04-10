import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";

const PLATFORM_SERVER_URL = process.env.SUMMON_STREAM_SERVER_URL ?? "https://realtime.summonflow.com";
const PLATFORM_SERVER_TOKEN = process.env.SUMMON_STREAM_SERVER_TOKEN ?? "";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apps = await db.app.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, key: true },
  });

  if (apps.length === 0) {
    return NextResponse.json({ channels: [] });
  }

  try {
    const results = await Promise.all(
      apps.map(async (app) => {
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

    const channels = results.flatMap((r) =>
      r.channels.map((ch: { name: string; subscription_count: number; occupied: boolean }) => ({
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
