import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ channelName: string }> },
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appId = req.nextUrl.searchParams.get("appId");
  if (!appId) {
    return NextResponse.json({ events: [] });
  }

  const app = await db.app.findFirst({
    where: { id: appId, organizationId: context.organization.id },
    select: { id: true },
  });
  if (!app) {
    return NextResponse.json({ events: [] });
  }

  const { channelName } = await params;
  const events = await db.channelEvent.findMany({
    where: { appId, channelName: decodeURIComponent(channelName) },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      eventName: true,
      payload: true,
      userId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    events: events.map((event) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
    })),
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
