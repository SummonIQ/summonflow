import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

function canManageInvitations(role?: string | null) {
  return role === "owner" || role === "admin";
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManageInvitations(context.member.role)) {
    return NextResponse.json({ error: "Only owners and admins can cancel invitations." }, { status: 403 });
  }

  const { invitationId } = await params;
  const invitation = await db.invitation.findFirst({
    where: { id: invitationId, organizationId: context.organization.id },
  });
  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
  }

  await db.invitation.delete({ where: { id: invitation.id } });
  return NextResponse.json({ ok: true });
}
