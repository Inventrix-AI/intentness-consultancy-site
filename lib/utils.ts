export function nowIso() {
  return new Date().toISOString();
}

export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function estimateInr(amount: number, currency: string): number {
  const fx: Record<string, number> = {
    USD: 84,
    EUR: 91,
    GBP: 107,
    AED: 22.8,
    INR: 1
  };
  return Math.round(amount * (fx[currency] ?? 1));
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}
