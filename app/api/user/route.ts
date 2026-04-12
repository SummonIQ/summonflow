import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

export async function GET() {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: context.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      name: true,
      image: true,
      createdAt: true,
    },
  });

  const organizations = await db.member.findMany({
    where: { userId: context.user.id },
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
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    ...user,
    activeOrganization: context.organization,
    organizations: organizations.map((membership: { role: string; organization: { id: string; name: string; slug: string; logo: string | null } }) => ({
      ...membership.organization,
      role: membership.role,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName } = body;

  const data: Record<string, string> = {};
  if (typeof firstName === "string" && firstName.trim()) data.firstName = firstName.trim();
  if (typeof lastName === "string" && lastName.trim()) data.lastName = lastName.trim();

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  if (data.firstName || data.lastName) {
    const current = await db.user.findUnique({ where: { id: context.user.id } });
    data.name = `${data.firstName ?? current?.firstName} ${data.lastName ?? current?.lastName}`;
  }

  const user = await db.user.update({
    where: { id: context.user.id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      name: true,
      image: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}
