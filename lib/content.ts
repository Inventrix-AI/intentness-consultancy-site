import type { ComplianceDocStatus, ServicePackage } from "@/lib/types";
import type { Route } from "next";

export const companyProfile = {
  legalName: "INTENTNESS CONSULTANCY PRIVATE LIMITED",
  brandName: "Intentness Consultancy",
  incorporationDate: "April 13, 2023",
  cin: "U85499BR2023PTC062498",
  pan: "AAHCI0720M",
  tan: "PTNI01703C",
  companyType: "Private company limited by shares",
  jurisdiction: "India",
  incorporationOffice: "Manesar, India",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@intentness.in",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91-99999-99999",
  supportEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@intentness.in",
  invoiceEmail: "billing@intentness.in",
  registeredAddress: "To be updated from official records"
};

export const valuePoints = [
  "India-based support staffing partner for US-focused teams",
  "SLA-driven onboarding and handoff",
  "Flexible retainers with project surge capacity",
  "Clear reporting, accountability, and compliance-ready documentation"
];

export const servicePackages: ServicePackage[] = [
  {
    id: "shared-support-pod",
    name: "Shared Support Pod",
    summary: "Dedicated support professionals managed under a single operating rhythm.",
    amount: 1200,
    currency: "USD",
    billingMode: "retainer",
    turnaround: "Start in 10 business days",
    deliverables: [
      "Weekly staffing report",
      "Operational handbook",
      "Coverage planning"
    ]
  },
  {
    id: "growth-support-cell",
    name: "Growth Support Cell",
    summary: "Cross-functional support staffing for fast-growing client accounts.",
    amount: 2500,
    currency: "USD",
    billingMode: "retainer",
    turnaround: "Start in 15 business days",
    deliverables: [
      "Resource planning",
      "Escalation matrix",
      "KPI dashboard"
    ]
  },
  {
    id: "custom-enterprise-engagement",
    name: "Custom Enterprise Engagement",
    summary: "Tailored staffing and transition plan for complex support operations.",
    amount: 5000,
    currency: "USD",
    billingMode: "project",
    turnaround: "As per scope",
    deliverables: [
      "SOW and milestones",
      "Hiring timeline",
      "Compliance reporting"
    ]
  }
];

export const complianceChecklist: ComplianceDocStatus = {
  websitePoliciesLive: true,
  kycSubmitted: false,
  internationalPaymentsEnabled: false,
  purposeCodeConfigured: false,
  invoiceTemplateReady: false,
  msaSowTemplateReady: false,
  reconciliationSOPReady: false
};

export const navItems: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pay", label: "Pay" },
  { href: "/contact", label: "Contact" }
];
