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
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@intentsupportservices.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+91 9739968800",
  supportEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@intentsupportservices.com",
  invoiceEmail: "billing@intentsupportservices.com",
  registeredAddress: "To be updated from official records"
};

export const heroHighlights = [
  "Collaboration and CX Management",
  "Network and Security",
  "Audio and Video Integrations",
  "Custom Software Applications",
  "Automation",
  "Managed Services"
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
    id: "collaboration-cx",
    name: "Collaboration and CX Management",
    summary: "Design, migration and optimization of enterprise collaboration and customer experience platforms.",
    highlights: [
      "Cisco Call Manager, Unity Connections and IM&P",
      "UCCX, UCCE and Genesys",
      "Webex Calling and CX",
      "Cisco Jabber and Expressway"
    ]
  },
  {
    id: "network-security",
    name: "Network and Security",
    summary: "Enterprise network infrastructure, security posture management and routing and switching operations.",
    highlights: [
      "Network Security and Routing & Switching",
      "Voice Gateways: H323, SIP and MGCP",
      "CER and EGW for 911 services",
      "SolarWinds and CMDB"
    ]
  },
  {
    id: "audio-video",
    name: "Audio and Video Integrations",
    summary: "End-to-end audio and video solution design, deployment and integration across enterprise platforms.",
    highlights: [
      "Expressway Core and Edge",
      "CUAC, Imagicle and ARC Console",
      "Unified communications integration",
      "Multi-vendor AV ecosystem support"
    ]
  },
  {
    id: "custom-software",
    name: "Custom Software Applications",
    summary: "Full-cycle software development from architecture to deployment across cloud and on-premise environments.",
    highlights: [
      "Java, Python and modern frameworks",
      "Cloud integration: AWS, Azure and GCP",
      "Agile development with iterative delivery",
      "Scalable system design"
    ]
  },
  {
    id: "automation",
    name: "Automation",
    summary: "Test automation frameworks, CI/CD pipelines and quality assurance engineering for faster releases.",
    highlights: [
      "Selenium with Page Object Model",
      "Cucumber/BDD and TestNG orchestration",
      "CI/CD automation with Jenkins",
      "Cross-browser and cross-environment validation"
    ]
  },
  {
    id: "managed-services",
    name: "Managed Services",
    summary: "Ongoing operational support, monitoring and optimization for network and collaboration infrastructure.",
    highlights: [
      "Incident and uptime monitoring",
      "Change and compliance governance",
      "Optimization and reporting",
      "End-to-end operational ownership"
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
