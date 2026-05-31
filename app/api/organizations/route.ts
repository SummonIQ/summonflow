import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

function slugifyOrganizationName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "workspace";
}

async function reserveOrganizationSlug(name: string) {
  const base = slugifyOrganizationName(name);

  for (let i = 0; i < 10; i += 1) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const existing = await db.organization.findUnique({ where: { slug } });
    if (!existing) return slug;
  }

  return `${base}-${Date.now().toString(36)}`;
}

function canManageMembers(role?: string | null) {
  return role === "owner" || role === "admin";
}

export async function GET() {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [members, invitations, organizations] = await Promise.all([
    db.member.findMany({
      where: { organizationId: context.organization.id },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        role: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    db.invitation.findMany({
      where: { organizationId: context.organization.id, status: "pending" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        inviter: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    db.member.findMany({
      where: { userId: context.user.id },
      orderBy: { createdAt: "asc" },
      select: {
        role: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    organization: context.organization,
    currentRole: context.member.role,
    canManageMembers: canManageMembers(context.member.role),
    members: members.map((member) => ({
      ...member,
      createdAt: member.createdAt.toISOString(),
    })),
    invitations: invitations.map((invitation) => ({
      ...invitation,
      createdAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
    })),
    organizations: organizations.map((membership) => ({
      ...membership.organization,
      role: membership.role,
    })),
  });
}

export async function POST(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Organization name is required." }, { status: 400 });
  }

  const organization = await db.organization.create({
    data: {
      name,
      slug: await reserveOrganizationSlug(name),
      members: {
        create: {
          userId: context.user.id,
          role: "owner",
        },
      },
    },
  });

  const sessionId = (context.session.session as { id?: string }).id;
  if (sessionId) {
    await db.session.update({
      where: { id: sessionId },
      data: { activeOrganizationId: organization.id },
    });
  }

  return NextResponse.json({ organization }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManageMembers(context.member.role)) {
    return NextResponse.json({ error: "Only owners and admins can update organization settings." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Organization name is required." }, { status: 400 });
  }

  const organization = await db.organization.update({
    where: { id: context.organization.id },
    data: { name },
  });

  return NextResponse.json({ organization });
}
