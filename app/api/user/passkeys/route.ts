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

  const passkeys = await db.passkey.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      deviceType: true,
      backedUp: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(passkeys);
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Passkey ID required" }, { status: 400 });
  }

  const passkey = await db.passkey.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!passkey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.passkey.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
