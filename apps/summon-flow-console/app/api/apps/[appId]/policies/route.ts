import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db/client";

export async function POST(
  req: NextRequest,
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
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const { pattern, type } = await req.json();

  if (!pattern || !type) {
    return NextResponse.json({ error: "Pattern and type are required" }, { status: 400 });
  }

  const validTypes = ["PUBLIC", "PRIVATE", "PRESENCE", "ENCRYPTED"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid channel type" }, { status: 400 });
  }

  const policy = await db.channelPolicy.create({
    data: { appId, pattern, type },
  });

  return NextResponse.json(policy, { status: 201 });
}
