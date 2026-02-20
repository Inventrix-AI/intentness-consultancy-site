import { getCurrencyDecimals } from "@/lib/currencies";

export function nowIso() {
  return new Date().toISOString();
}

export function toMinorUnits(amountMajor: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return Math.round(amountMajor * 10 ** decimals);
}

export function fromMinorUnits(amountMinor: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  return amountMinor / 10 ** decimals;
}

export function estimateInr(amount: number, currency: string): number {
  const fx: Record<string, number> = {
    USD: 84,
    EUR: 91,
    GBP: 107,
    AED: 22.8,
    INR: 1
  };
  return Number((amount * (fx[currency] ?? 1)).toFixed(2));
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}
