import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return secret;
}

function getAdminCreds() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) throw new Error("Admin credentials are not configured");
  return { username, password };
}

export function validateCredentials(username: string, password: string): boolean {
  const creds = getAdminCreds();
  const usernameMatch = crypto.timingSafeEqual(
    Buffer.from(username),
    Buffer.from(creds.username)
  );
  const passwordMatch = crypto.timingSafeEqual(
    Buffer.from(password),
    Buffer.from(creds.password)
  );
  return usernameMatch && passwordMatch;
}

export function signToken(payload: Record<string, unknown>): string {
  const secret = getSecret();
  const data = JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) });
  const encoded = Buffer.from(data).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  const secret = getSecret();
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expectedSig = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as Record<string, unknown>;
    const iat = payload.iat as number;
    if (Date.now() / 1000 - iat > TOKEN_MAX_AGE) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || typeof payload.username !== "string") return null;

  return { username: payload.username };
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TOKEN_MAX_AGE
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0
  };
}
