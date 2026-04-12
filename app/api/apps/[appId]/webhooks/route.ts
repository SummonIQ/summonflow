import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId } = await params;
  const app = await db.app.findFirst({ where: { id: appId, organizationId: context.organization.id } });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const webhooks = await db.webhook.findMany({
    where: { appId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(webhooks);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId } = await params;
  const app = await db.app.findFirst({ where: { id: appId, organizationId: context.organization.id } });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { url, events } = await req.json();
  if (!url || !Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: "URL and at least one event are required" }, { status: 400 });
  }

  const webhook = await db.webhook.create({
    data: { appId, url, events },
  });

  return NextResponse.json(webhook, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId } = await params;
  const app = await db.app.findFirst({ where: { id: appId, organizationId: context.organization.id } });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await req.json();
  const webhook = await db.webhook.findFirst({ where: { id, appId } });
  if (!webhook) return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  await db.webhook.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
