import type { GstTreatment, TaxBreakdown } from "@/lib/types";

/** Valid GST rate percentages for Indian services. */
export const GST_RATES = [0, 5, 12, 18, 28] as const;

/** Default GST rate for IT/consulting services. */
export const DEFAULT_GST_RATE = 18;

/**
 * Determine tax type based on GST treatment and state comparison.
 *
 * - export / sez → zero-rated (no GST)
 * - same state   → CGST + SGST (split)
 * - diff state   → IGST (full)
 */
export function determineTaxType(
  gstTreatment: GstTreatment,
  sellerStateCode: string,
  buyerStateCode?: string
): TaxBreakdown["taxType"] {
  if (gstTreatment === "export" || gstTreatment === "sez") return "zero_rated";
  if (buyerStateCode && buyerStateCode === sellerStateCode) return "cgst_sgst";
  return "igst";
}

/** Calculate tax breakdown for a given taxable amount. */
export function calculateTax(
  taxableAmount: number,
  gstRatePercent: number,
  taxType: TaxBreakdown["taxType"]
): TaxBreakdown {
  if (taxType === "zero_rated") {
    return { taxType: "zero_rated", gstRatePercent: 0, totalTax: 0 };
  }

  if (taxType === "cgst_sgst") {
    const halfRate = gstRatePercent / 2;
    const cgstAmount = round2(taxableAmount * halfRate / 100);
    const sgstAmount = round2(taxableAmount * halfRate / 100);
    return {
      taxType: "cgst_sgst",
      gstRatePercent,
      cgstPercent: halfRate,
      cgstAmount,
      sgstPercent: halfRate,
      sgstAmount,
      totalTax: round2(cgstAmount + sgstAmount),
    };
  }

  // IGST
  const igstAmount = round2(taxableAmount * gstRatePercent / 100);
  return {
    taxType: "igst",
    gstRatePercent,
    igstPercent: gstRatePercent,
    igstAmount,
    totalTax: igstAmount,
  };
}

/**
 * Validate GSTIN format.
 * Format: 2-digit state code + PAN (10 chars) + 1 entity digit + Z + checksum
 * Example: 10AAHCI0720M1ZY
 */
export function isValidGstin(gstin: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
}

/** Extract 2-digit state code from a GSTIN. */
export function stateCodeFromGstin(gstin: string): string {
  return gstin.substring(0, 2);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
