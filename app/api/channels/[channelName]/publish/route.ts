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

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ channelName: string }> },
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const appId = typeof body?.appId === "string" ? body.appId : "";
  const eventName = typeof body?.eventName === "string" ? body.eventName.trim() : "";

  if (!appId || !eventName) {
    return NextResponse.json({ error: "Application and event name are required." }, { status: 400 });
  }

  const app = await db.app.findFirst({
    where: { id: appId, organizationId: context.organization.id },
    select: { key: true },
  });
  if (!app) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const { channelName } = await params;
  const res = await fetch(`${PLATFORM_SERVER_URL}/apps/${app.key}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PLATFORM_SERVER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: decodeURIComponent(channelName),
      event: eventName,
      data: body?.payload ?? {},
    }),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "Unable to publish event.");
    return NextResponse.json({ error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
