import type { CurrencyConfig } from "@/lib/types";

export const RAZORPAY_SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "Rs", decimals: 2, enabled: true },
  { code: "USD", symbol: "$", decimals: 2, enabled: true },
  { code: "EUR", symbol: "EUR", decimals: 2, enabled: true },
  { code: "GBP", symbol: "GBP", decimals: 2, enabled: true },
  { code: "AED", symbol: "AED", decimals: 2, enabled: true },
  { code: "AUD", symbol: "AUD", decimals: 2, enabled: true },
  { code: "CAD", symbol: "CAD", decimals: 2, enabled: true },
  { code: "CHF", symbol: "CHF", decimals: 2, enabled: true },
  { code: "CNY", symbol: "CNY", decimals: 2, enabled: true },
  { code: "DKK", symbol: "DKK", decimals: 2, enabled: true },
  { code: "HKD", symbol: "HKD", decimals: 2, enabled: true },
  { code: "JPY", symbol: "JPY", decimals: 0, enabled: true },
  { code: "KES", symbol: "KES", decimals: 2, enabled: true },
  { code: "MYR", symbol: "MYR", decimals: 2, enabled: true },
  { code: "NOK", symbol: "NOK", decimals: 2, enabled: true },
  { code: "NZD", symbol: "NZD", decimals: 2, enabled: true },
  { code: "QAR", symbol: "QAR", decimals: 2, enabled: true },
  { code: "SAR", symbol: "SAR", decimals: 2, enabled: true },
  { code: "SEK", symbol: "SEK", decimals: 2, enabled: true },
  { code: "SGD", symbol: "SGD", decimals: 2, enabled: true },
  { code: "THB", symbol: "THB", decimals: 2, enabled: true },
  { code: "ZAR", symbol: "ZAR", decimals: 2, enabled: true }
];

const currencyMap = new Map(RAZORPAY_SUPPORTED_CURRENCIES.map((currency) => [currency.code, currency]));

export function getCurrencyConfig(code: string) {
  return currencyMap.get(code);
}

export function getCurrencyDecimals(code: string) {
  return getCurrencyConfig(code)?.decimals ?? 2;
}
