import type { ComplianceDocStatus, ServicePackage } from "@/lib/types";
import type { Route } from "next";

export const companyProfile = {
  legalName: "INTENTNESS CONSULTANCY PRIVATE LIMITED",
  brandName: "Intentness Consultancy",
  tagline: "Networks, Collabs, CX and Automation",
  incorporationDate: "April 13, 2023",
  foundedLine: "Founded in 2023 in Nawada (India)",
  cin: "U85499BR2023PTC062498",
  pan: "AAHCI0720M",
  tan: "PTNI01703C",
  companyType: "Private company limited by shares",
  jurisdiction: "India",
  incorporationOffice: "Manesar, India",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "vivek.voip2@gmail.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 9739968800",
  supportEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "vivek.voip2@gmail.com",
  invoiceEmail: "billing@intentsupportservices.com",
  registeredAddress: "To be updated from official records"
};

export const heroHighlights = [
  "Collaboration and CX Management",
  "Network and Security",
  "Automation and QA",
  "Custom Software Applications"
];

export const capabilityPillars = [
  "Collabs and CX Management",
  "Network and Security",
  "Audio and Video Integrations",
  "Custom Software Application",
  "Automation",
  "Managed Services"
];

export const networkingStack = [
  "Cisco Call Manager, Unity Connections and IM&P",
  "Voice Gateways: H323, SIP and MGCP",
  "UCCX, UCCE and Genesys",
  "Webex Calling and CX",
  "Network Security and Routing & Switching",
  "Cisco Jabber",
  "Expressway Core and Edge",
  "CER and EGW for 911 services",
  "SolarWinds and CMDB",
  "CUAC, Imagicle and ARC Console"
];

export const softwareExperience = [
  "Diverse technology expertise across Java, Python and modern frameworks",
  "Agile development practices with iterative delivery",
  "Custom software solutions aligned to client-specific workflows",
  "End-to-end delivery from architecture to deployment",
  "Cloud integration across AWS, Azure and Google Cloud",
  "Scalable system design for high-performance operations"
];

export const qaMethodologies = [
  "Functional, regression, integration and UAT testing",
  "Automation-first validation with robust frameworks",
  "Quality-centric release governance",
  "Agile and DevOps integrated QA lifecycle",
  "Actionable reporting and defect intelligence",
  "Client-centric testing strategy by business domain"
];

export const automationStrategies = [
  "Scalable frameworks with Java, Selenium and Page Object Model",
  "BDD implementation with Cucumber",
  "TestNG orchestration with parallel execution",
  "CI/CD automation with Jenkins pipelines",
  "Cross-browser and cross-environment validation",
  "Reusable automation components for faster project velocity"
];

export const teamMembers = [
  {
    name: "Chetan Patel",
    focus: "Testing planning strategies and automation"
  },
  {
    name: "Vivek Kumar",
    focus: "Collabs, CX, networks and security"
  },
  {
    name: "Avinash",
    focus: "Custom software applications"
  }
];

export const projectStatement =
  "Offering a complete portfolio of end-to-end and customizable solutions strengthened with prompt and coherent services.";

export const servicePackages: ServicePackage[] = [
  {
    id: "collaboration-cx-modernization",
    name: "Collaboration & CX Modernization",
    summary: "Design, migration and optimization of enterprise collaboration and customer experience stacks.",
    amount: 3200,
    currency: "USD",
    billingMode: "project",
    turnaround: "4-8 week implementation windows",
    deliverables: [
      "Current-state assessment",
      "Migration blueprint and rollout plan",
      "Operational readiness and handover"
    ]
  },
  {
    id: "network-security-managed",
    name: "Network & Security Managed Program",
    summary: "Continuous operations support for network reliability, voice infrastructure and security posture.",
    amount: 2500,
    currency: "USD",
    billingMode: "retainer",
    turnaround: "Start in 10 business days",
    deliverables: [
      "Incident and uptime monitoring",
      "Change and compliance governance",
      "Monthly optimization report"
    ]
  },
  {
    id: "qa-automation-engine",
    name: "QA & Automation Engineering",
    summary: "Build and scale test strategy, CI quality gates and automation frameworks for faster releases.",
    amount: 2800,
    currency: "USD",
    billingMode: "retainer",
    turnaround: "Start in 15 business days",
    deliverables: [
      "Automation framework baseline",
      "Coverage and reporting dashboard",
      "Release-quality checkpoints"
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
  { href: "/pay", label: "Payments" },
  { href: "/contact", label: "Contact" }
];
