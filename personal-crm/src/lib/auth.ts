// Derives a session token from the auth credentials.
// Token = SHA-256(AUTH_USER | AUTH_PASSWORD | AUTH_SECRET)
// Works on both Node.js and Edge runtimes (uses Web Crypto API).
export async function deriveSessionToken(): Promise<string> {
  const data = `${process.env.AUTH_USER}|${process.env.AUTH_PASSWORD}|${process.env.AUTH_SECRET}`;
  const encoded = new TextEncoder().encode(data);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const SESSION_COOKIE = "crm_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
