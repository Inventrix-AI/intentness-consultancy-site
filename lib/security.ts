export async function verifyTurnstile(token?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, skipped: false, reason: "missing-token" };
  }

  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  if (!response.ok) {
    return { ok: false, skipped: false, reason: "verification-request-failed" };
  }

  const body = (await response.json()) as { success?: boolean };
  return { ok: !!body.success, skipped: false };
}
