import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2).max(80),
  workEmail: z.string().email(),
  company: z.string().min(2).max(120),
  country: z.string().min(2).max(60),
  serviceInterest: z.string().min(2).max(80),
  message: z.string().min(10).max(2000)
});

export const createOrderSchema = z.object({
  serviceId: z.string().min(2),
  amount: z.number().int().positive(),
  currency: z.enum(["INR", "USD", "EUR", "GBP", "AED"]),
  client: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    country: z.string().min(2)
  })
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(5),
  razorpay_payment_id: z.string().min(5),
  razorpay_signature: z.string().min(10)
});

export const invoiceRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  amountRange: z.string().min(2),
  preferredCurrency: z.enum(["USD", "EUR", "GBP", "AED", "INR"]),
  requirement: z.string().min(10).max(2000)
});
