import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { ensureOrganizationContext } from "@/lib/organization";

export async function GET() {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apps = await db.app.findMany({
    where: { organizationId: context.organization.id },
    include: { channelPolicies: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(apps);
}

export async function POST(req: NextRequest) {
  const context = await ensureOrganizationContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const app = await db.app.create({
    data: {
      name: name.trim(),
      userId: context.user.id,
      organizationId: context.organization.id,
    },
  });

  return NextResponse.json(app, { status: 201 });
}
