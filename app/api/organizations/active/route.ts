import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

export async function POST(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organizationId } = await req.json();
  if (!organizationId || typeof organizationId !== "string") {
    return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
  }

  const membership = await db.member.findFirst({
    where: { userId: context.user.id, organizationId },
  });
  if (!membership) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const sessionId = (context.session.session as { id?: string }).id;
  if (!sessionId) {
    return NextResponse.json({ error: "Session not found" }, { status: 400 });
  }

  await db.session.update({
    where: { id: sessionId },
    data: { activeOrganizationId: organizationId },
  });

  return NextResponse.json({ ok: true });
}
