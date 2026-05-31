import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

const VALID_TYPES = ["PUBLIC", "PRIVATE", "PRESENCE", "ENCRYPTED"];

async function authorize(policyId: string) {
  const context = await ensureOrganizationContext();
  if (!context) return { error: "Unauthorized", status: 401 as const };
  const policy = await db.channelPolicy.findFirst({
    where: { id: policyId, organizationId: context.organization.id },
    include: { app: { select: { id: true, name: true } } },
  });
  if (!policy) return { error: "Policy not found", status: 404 as const };
  return { context, policy };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ policyId: string }> },
) {
  const { policyId } = await params;
  const check = await authorize(policyId);
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  return NextResponse.json(check.policy);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ policyId: string }> },
) {
  const { policyId } = await params;
  const check = await authorize(policyId);
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => ({}));
  const { pattern, type, name, appId } = body as {
    pattern?: string;
    type?: string;
    name?: string | null;
    appId?: string | null;
  };

  const data: {
    pattern?: string;
    type?: "PUBLIC" | "PRIVATE" | "PRESENCE" | "ENCRYPTED";
    name?: string | null;
    appId?: string | null;
  } = {};

  if (typeof pattern === "string") {
    const trimmed = pattern.trim();
    if (!trimmed) {
      return NextResponse.json({ error: "Pattern cannot be empty" }, { status: 400 });
    }
    data.pattern = trimmed;
  }
  if (typeof type === "string") {
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid channel type" }, { status: 400 });
    }
    data.type = type as typeof data.type;
  }
  if (name !== undefined) {
    data.name = typeof name === "string" && name.trim() ? name.trim() : null;
  }
  if (appId !== undefined) {
    if (appId === null || appId === "") {
      data.appId = null;
    } else {
      const app = await db.app.findFirst({
        where: { id: appId, organizationId: check.context.organization.id },
      });
      if (!app) {
        return NextResponse.json({ error: "App not found" }, { status: 404 });
      }
      data.appId = appId;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  const updated = await db.channelPolicy.update({
    where: { id: policyId },
    data,
    include: { app: { select: { id: true, name: true } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ policyId: string }> },
) {
  const { policyId } = await params;
  const check = await authorize(policyId);
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  await db.channelPolicy.delete({ where: { id: policyId } });
  return NextResponse.json({ ok: true });
}
