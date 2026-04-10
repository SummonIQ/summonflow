import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apps = await db.app.findMany({
    where: { userId: session.user.id },
    include: { channelPolicies: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(apps);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const app = await db.app.create({
    data: {
      name: name.trim(),
      userId: session.user.id,
    },
  });

  return NextResponse.json(app, { status: 201 });
}
