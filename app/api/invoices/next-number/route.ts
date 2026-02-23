import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getNextInvoiceNumber } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const nextNumber = await getNextInvoiceNumber();
  return NextResponse.json({ nextNumber });
}
