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

  const user = await db.user.findUnique({
    where: { id: session.user.id },
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

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await (await import("next/headers")).headers(),
  });
  if (!session?.user) {
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
    const current = await db.user.findUnique({ where: { id: session.user.id } });
    data.name = `${data.firstName ?? current?.firstName} ${data.lastName ?? current?.lastName}`;
  }

  const user = await db.user.update({
    where: { id: session.user.id },
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
