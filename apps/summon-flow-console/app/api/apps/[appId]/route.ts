import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId } = await params;

  const app = await db.app.findFirst({
    where: { id: appId, userId: session.user.id },
    include: { channelPolicies: true },
  });

  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(app);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appId } = await params;

  const app = await db.app.findFirst({
    where: { id: appId, userId: session.user.id },
  });

  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.app.delete({ where: { id: appId } });

  return NextResponse.json({ deleted: true });
}
