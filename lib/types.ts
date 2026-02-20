export type CurrencyCode = string;

export type CurrencyConfig = {
  code: string;
  symbol: string;
  decimals: number;
  enabled: boolean;
};

export type FxEstimate = {
  base: string;
  quote: "INR";
  amountMajor: number;
  rate: number;
  converted: number;
  timestamp: string;
  provider: string;
  fallback: boolean;
};

export type PaymentLifecycleStatus = "created" | "checkout_initiated" | "verified" | "captured" | "failed";

export type PaymentIntentInput = {
  amountMajor: number;
  currency: string;
  payer: {
    name: string;
    email: string;
    country: string;
  };
  purpose?: string;
  reference?: string;
};

export type ServicePackage = {
  id: string;
  name: string;
  summary: string;
  amount: number;
  currency: CurrencyCode;
  billingMode: "retainer" | "project";
  turnaround: string;
  deliverables: string[];
};

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  workEmail: string;
  company: string;
  country: string;
  serviceInterest: string;
  message: string;
};

export type InvoiceRequestPayload = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  preferredCurrency: string;
  amountTarget: string;
  projectScope: string;
  timeline?: string;
};

export type PaymentOrder = {
  id: string;
  createdAt: string;
  amountMajor: number;
  amountMinor: number;
  currency: string;
  payer: {
    name: string;
    email: string;
    country: string;
  };
  purpose?: string;
  reference?: string;
  fxEstimate?: FxEstimate;
  razorpayOrderId: string;
  status: PaymentLifecycleStatus;
};

export type PaymentTransaction = {
  id: string;
  createdAt: string;
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  currency: string;
  amountMinor: number;
  amountMajor: number;
  status: "verified" | "failed" | "webhook_paid";
  settlementCurrency: "INR";
  notes?: string;
};

export type ComplianceDocStatus = {
  websitePoliciesLive: boolean;
  kycSubmitted: boolean;
  internationalPaymentsEnabled: boolean;
  purposeCodeConfigured: boolean;
  invoiceTemplateReady: boolean;
  msaSowTemplateReady: boolean;
  reconciliationSOPReady: boolean;
};

export type AuditEvent = {
  id: string;
  at: string;
  action: string;
  entity: "lead" | "payment" | "webhook" | "security";
  payload: Record<string, unknown>;
};
