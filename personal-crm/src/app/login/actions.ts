"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deriveSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const user = (formData.get("username") as string) ?? "";
  const pass = (formData.get("password") as string) ?? "";

  if (
    user !== process.env.AUTH_USER ||
    pass !== process.env.AUTH_PASSWORD
  ) {
    return { error: "Usuário ou senha incorretos." };
  }

  const token = await deriveSessionToken();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  redirect("/");
}
