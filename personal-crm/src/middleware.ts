import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

async function deriveSessionToken(): Promise<string> {
  const data = `${process.env.AUTH_USER}|${process.env.AUTH_PASSWORD}|${process.env.AUTH_SECRET}`;
  const encoded = new TextEncoder().encode(data);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  // Already logged in → skip login page
  if (isLoginPage) {
    if (session) {
      const expected = await deriveSessionToken();
      if (session === expected) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  // No session → redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Invalid session → clear and redirect
  const expected = await deriveSessionToken();
  if (session !== expected) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
