import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

function canInvite(role?: string | null) {
  return role === "owner" || role === "admin";
}

function normalizeRole(role: unknown) {
  return role === "admin" || role === "member" ? role : "member";
}

export async function POST(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canInvite(context.member.role)) {
    return NextResponse.json({ error: "Only owners and admins can invite members." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = normalizeRole(body?.role);
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existingUser) {
    const existingMember = await db.member.findUnique({
      where: {
        userId_organizationId: {
          userId: existingUser.id,
          organizationId: context.organization.id,
        },
      },
    });
    if (existingMember) {
      return NextResponse.json({ error: "This user is already a member." }, { status: 409 });
    }
  }

  const existingInvitation = await db.invitation.findFirst({
    where: { organizationId: context.organization.id, email, status: "pending" },
  });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invitation = existingInvitation
    ? await db.invitation.update({
        where: { id: existingInvitation.id },
        data: { role, inviterId: context.user.id, expiresAt },
      })
    : await db.invitation.create({
        data: {
          email,
          role,
          status: "pending",
          inviterId: context.user.id,
          organizationId: context.organization.id,
          expiresAt,
        },
      });

  return NextResponse.json({
    invitation: {
      ...invitation,
      createdAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
    },
  }, { status: existingInvitation ? 200 : 201 });
}
