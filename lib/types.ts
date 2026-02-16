export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

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

export type PaymentOrder = {
  id: string;
  createdAt: string;
  serviceId: string;
  amount: number;
  currency: string;
  client: {
    name: string;
    email: string;
    country: string;
  };
  razorpayOrderId: string;
  status: "created" | "paid" | "failed";
};

export type PaymentTransaction = {
  id: string;
  createdAt: string;
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  currency: string;
  amount: number;
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
