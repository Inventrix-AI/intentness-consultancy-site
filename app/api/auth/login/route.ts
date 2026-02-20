import { NextRequest, NextResponse } from "next/server";
import { sessionCookieOptions, signToken, validateCredentials } from "@/lib/auth";
import { assertRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rate = assertRateLimit(`auth_login:${ip}`, 5, 60_000);

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please retry shortly." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  let valid = false;
  try {
    valid = validateCredentials(username, password);
  } catch {
    return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signToken({ username });
  const cookie = sessionCookieOptions(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie);
  return response;
}
