import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";
import { getAppUsageSummary } from "@/lib/usage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId } = await params;

  const app = await db.app.findFirst({
    where: { id: appId, organizationId: context.organization.id },
    include: { channelPolicies: true },
  });

  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const usage = await getAppUsageSummary(app.id);

  return NextResponse.json({ ...app, usage });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId } = await params;

  const app = await db.app.findFirst({
    where: { id: appId, organizationId: context.organization.id },
  });

  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.app.delete({ where: { id: appId } });

  return NextResponse.json({ deleted: true });
}
