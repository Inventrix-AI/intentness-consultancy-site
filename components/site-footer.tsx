import Link from "next/link";
import { companyProfile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">Intentness Consultancy</p>
          <p className="mt-2 text-sm text-slate-600">{companyProfile.legalName}</p>
          <p className="mt-1 text-xs text-slate-500">CIN: {companyProfile.cin}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Quick Links</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/privacy-policy" className="hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-accent">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-cancellation-policy" className="hover:text-accent">
                Refund/Cancellation Policy
              </Link>
            </li>
            <li>
              <Link href="/delivery-service-fulfillment-policy" className="hover:text-accent">
                Delivery/Service Fulfillment Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Support</p>
          <p className="mt-2 text-sm text-slate-600">{companyProfile.contactEmail}</p>
          <p className="text-sm text-slate-600">{companyProfile.contactPhone}</p>
          <Link href="/support" className="mt-3 inline-block text-sm font-medium text-accent hover:text-orange-700">
            Contact & Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
