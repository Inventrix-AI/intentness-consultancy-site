import { z } from "zod";
import { RAZORPAY_SUPPORTED_CURRENCIES } from "@/lib/currencies";
import { getCurrencyDecimals } from "@/lib/currencies";

const supportedCurrencyCodes = RAZORPAY_SUPPORTED_CURRENCIES.map((currency) => currency.code);

export const leadSchema = z.object({
  name: z.string().min(2).max(80),
  workEmail: z.string().email(),
  company: z.string().min(2).max(120),
  country: z.string().min(2).max(60),
  serviceInterest: z.string().min(2).max(80),
  message: z.string().min(10).max(2000)
});

export const createOrderSchema = z
  .object({
    amountMajor: z.number().positive().max(500_000),
    currency: z.string(),
    payer: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      country: z.string().min(2)
    }),
    purpose: z.string().max(120).optional(),
    reference: z.string().max(120).optional(),
    fxEstimate: z
      .object({
        rate: z.number().positive(),
        converted: z.number().positive(),
        timestamp: z.string()
      })
      .optional()
  })
  .superRefine((input, ctx) => {
    if (!supportedCurrencyCodes.includes(input.currency)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currency"],
        message: "Unsupported currency."
      });
    }

    // Minimum amount: INR 1 or equivalent (~0.50 for USD/EUR/GBP)
    const minAmounts: Record<string, number> = { INR: 1, JPY: 1 };
    const minAmount = minAmounts[input.currency] ?? 0.5;
    if (input.amountMajor < minAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMajor"],
        message: `Minimum amount for ${input.currency} is ${minAmount}.`
      });
    }

    const decimals = getCurrencyDecimals(input.currency);
    const scaled = input.amountMajor * 10 ** decimals;
    if (!Number.isInteger(Number(scaled.toFixed(6)))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMajor"],
        message: `Amount precision exceeds supported decimals for ${input.currency}.`
      });
    }
  });

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(5),
  razorpay_payment_id: z.string().min(5),
  razorpay_signature: z.string().min(10)
});

export const createPaymentLinkSchema = z
  .object({
    clientName: z.string().min(2).max(80),
    clientEmail: z.string().email(),
    clientPhone: z.string().max(20).optional(),
    amountMajor: z.number().positive().max(500_000),
    currency: z.string(),
    description: z.string().min(3).max(200),
    reference: z.string().max(120).optional(),
    expiryHours: z.number().int().min(1).max(8760).optional(),
    notifyEmail: z.boolean().default(true),
    notifySms: z.boolean().default(false)
  })
  .superRefine((input, ctx) => {
    if (!supportedCurrencyCodes.includes(input.currency)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currency"],
        message: "Unsupported currency."
      });
    }

    const minAmounts: Record<string, number> = { INR: 1, JPY: 1 };
    const minAmount = minAmounts[input.currency] ?? 0.5;
    if (input.amountMajor < minAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMajor"],
        message: `Minimum amount for ${input.currency} is ${minAmount}.`
      });
    }

    const decimals = getCurrencyDecimals(input.currency);
    const scaled = input.amountMajor * 10 ** decimals;
    if (!Number.isInteger(Number(scaled.toFixed(6)))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountMajor"],
        message: `Amount precision exceeds supported decimals for ${input.currency}.`
      });
    }
  });

export const invoiceRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  amountTarget: z.string().min(1),
  preferredCurrency: z.string(),
  projectScope: z.string().min(10).max(2000),
  timeline: z.string().max(120).optional()
});
