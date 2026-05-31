import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

function canManageMembers(role?: string | null) {
  return role === "owner" || role === "admin";
}

function normalizeRole(role: unknown) {
  return role === "admin" || role === "member" ? role : null;
}

async function countOwners(organizationId: string) {
  return db.member.count({
    where: {
      organizationId,
      role: "owner",
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManageMembers(context.member.role)) {
    return NextResponse.json({ error: "Only owners and admins can manage members." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const role = normalizeRole(body?.role);
  if (!role) {
    return NextResponse.json({ error: "Role must be admin or member." }, { status: 400 });
  }

  const { memberId } = await params;
  const member = await db.member.findFirst({
    where: { id: memberId, organizationId: context.organization.id },
  });
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  if (member.role === "owner" && (await countOwners(context.organization.id)) <= 1) {
    return NextResponse.json({ error: "The last owner cannot be changed." }, { status: 400 });
  }

  const updated = await db.member.update({
    where: { id: member.id },
    data: { role },
  });

  return NextResponse.json({ member: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManageMembers(context.member.role)) {
    return NextResponse.json({ error: "Only owners and admins can remove members." }, { status: 403 });
  }

  const { memberId } = await params;
  const member = await db.member.findFirst({
    where: { id: memberId, organizationId: context.organization.id },
  });
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  if (member.userId === context.user.id) {
    return NextResponse.json({ error: "You cannot remove yourself." }, { status: 400 });
  }

  if (member.role === "owner" && (await countOwners(context.organization.id)) <= 1) {
    return NextResponse.json({ error: "The last owner cannot be removed." }, { status: 400 });
  }

  await db.member.delete({ where: { id: member.id } });
  return NextResponse.json({ ok: true });
}
