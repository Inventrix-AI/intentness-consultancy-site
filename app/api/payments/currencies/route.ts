import { NextResponse } from "next/server";
import { RAZORPAY_SUPPORTED_CURRENCIES } from "@/lib/currencies";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    currencies: RAZORPAY_SUPPORTED_CURRENCIES.filter((currency) => currency.enabled)
  });
}
