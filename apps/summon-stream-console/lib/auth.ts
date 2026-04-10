"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "summonstream_console_session";
const DEMO_EMAIL = "ops@summonstream.dev";
const DEMO_PASSWORD = "summonstream-demo";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    redirect("/login?error=invalid");
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  redirect("/apps");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function getSession() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "authenticated";
}
