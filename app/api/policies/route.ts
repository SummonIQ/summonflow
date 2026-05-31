import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";
import type { Prisma } from "@/generated/prisma/client";

const VALID_TYPES = ["PUBLIC", "PRIVATE", "PRESENCE", "ENCRYPTED"];

export async function GET(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const appId = searchParams.get("appId");
  const scope = searchParams.get("scope"); // "global" | "app" | undefined (all)

  const where: Prisma.ChannelPolicyWhereInput = { organizationId: context.organization.id };

  if (appId && scope === "effective") {
    where.OR = [{ appId: null }, { appId }];
  } else if (appId) {
    where.appId = appId;
  } else if (scope === "global") {
    where.appId = null;
  }

  const policies = await db.channelPolicy.findMany({
    where,
    include: { app: { select: { id: true, name: true } } },
    orderBy: [{ appId: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(policies);
}

export async function POST(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { pattern, type, name, appId } = body as {
    pattern?: string;
    type?: string;
    name?: string;
    appId?: string | null;
  };

  if (!pattern || !pattern.trim()) {
    return NextResponse.json({ error: "Pattern is required" }, { status: 400 });
  }
  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid channel type" }, { status: 400 });
  }

  if (appId) {
    const app = await db.app.findFirst({
      where: { id: appId, organizationId: context.organization.id },
    });
    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }
  }

  const policy = await db.channelPolicy.create({
    data: {
      organizationId: context.organization.id,
      appId: appId ?? null,
      pattern: pattern.trim(),
      type: type as "PUBLIC" | "PRIVATE" | "PRESENCE" | "ENCRYPTED",
      name: name?.trim() || null,
    },
    include: { app: { select: { id: true, name: true } } },
  });

  return NextResponse.json(policy, { status: 201 });
}
