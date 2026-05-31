"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await (await import("next/headers")).headers(),
    });
    return !!session?.user;
  } catch {
    return false;
  }
}

export async function signOut() {
  redirect("/login");
}
