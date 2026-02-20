import { NextRequest, NextResponse } from "next/server";
import { estimateInr, nowIso } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const base = (search.get("base") ?? "USD").toUpperCase();
  const amount = Number(search.get("amount") ?? "0");

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Amount must be positive." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.exchangerate.host/convert?from=${encodeURIComponent(base)}&to=INR&amount=${encodeURIComponent(String(amount))}`,
      {
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`FX provider status ${response.status}`);
    }

    const body = (await response.json()) as {
      result?: number;
      info?: { rate?: number };
      date?: string;
    };

    if (!body.result || !body.info?.rate) {
      throw new Error("FX response missing result");
    }

    return NextResponse.json({
      base,
      quote: "INR",
      amountMajor: amount,
      converted: Number(body.result.toFixed(2)),
      rate: Number(body.info.rate.toFixed(6)),
      timestamp: body.date ?? nowIso(),
      provider: "exchangerate.host",
      fallback: false
    });
  } catch {
    const fallback = estimateInr(amount, base);
    const rate = amount > 0 ? fallback / amount : 1;

    return NextResponse.json({
      base,
      quote: "INR",
      amountMajor: amount,
      converted: Number(fallback.toFixed(2)),
      rate: Number(rate.toFixed(6)),
      timestamp: nowIso(),
      provider: "fallback_static",
      fallback: true
    });
  }
}
