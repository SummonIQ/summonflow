import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";

function slugifyOrganizationName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "workspace";
}

async function reserveOrganizationSlug(baseName: string) {
  const base = slugifyOrganizationName(baseName);

  for (let i = 0; i < 10; i += 1) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const existing = await db.organization.findUnique({ where: { slug } });
    if (!existing) return slug;
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function getAuthSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function ensureOrganizationContext() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return null;
  }

  const activeOrganizationId =
    (session.session as { activeOrganizationId?: string | null } | undefined)?.activeOrganizationId ?? null;

  if (activeOrganizationId) {
    const activeMember = await db.member.findFirst({
      where: { userId: session.user.id, organizationId: activeOrganizationId },
      include: { organization: true },
    });

    if (activeMember) {
      return {
        session,
        user: session.user,
        member: activeMember,
        organization: activeMember.organization,
      };
    }
  }

  let member = await db.member.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (!member) {
    const displayName =
      `${session.user.name ?? ""}`.trim() ||
      `${(session.user as { firstName?: string }).firstName ?? ""} ${(session.user as { lastName?: string }).lastName ?? ""}`.trim() ||
      session.user.email?.split("@")[0] ||
      "Workspace";

    const organization = await db.organization.create({
      data: {
        name: `${displayName} Workspace`,
        slug: await reserveOrganizationSlug(displayName),
      },
    });

    await db.member.create({
      data: {
        userId: session.user.id,
        organizationId: organization.id,
        role: "owner",
      },
    });

    member = await db.member.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
      orderBy: { createdAt: "asc" },
    });
  }

  if (!member) {
    throw new Error("Failed to initialize organization context");
  }

  const sessionId = (session.session as { id?: string }).id;
  if (sessionId && member.organizationId !== activeOrganizationId) {
    await db.session.update({
      where: { id: sessionId },
      data: { activeOrganizationId: member.organizationId },
    });
  }

  return {
    session,
    user: session.user,
    member,
    organization: member.organization,
  };
}
