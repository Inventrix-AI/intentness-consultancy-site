import Image from "next/image";
import Link from "next/link";
import { companyProfile, navItems } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-slate-800 bg-slate-950">
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />

      <div className="container-shell grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src="/intentness-logo-full.png"
            alt="Intentness Consultancy"
            width={220}
            height={55}
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
          />
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{companyProfile.tagline}</p>
          <p className="mt-4 text-xs text-slate-500">{companyProfile.legalName}</p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-sm font-semibold text-white">Quick Links</p>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-slate-400 transition-colors hover:text-sky-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <p className="text-sm font-semibold text-white">Policies</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/privacy-policy" className="text-sm text-slate-400 transition-colors hover:text-sky-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-sm text-slate-400 transition-colors hover:text-sky-400">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-cancellation-policy" className="text-sm text-slate-400 transition-colors hover:text-sky-400">
                Refund/Cancellation
              </Link>
            </li>
            <li>
              <Link href="/delivery-service-fulfillment-policy" className="text-sm text-slate-400 transition-colors hover:text-sky-400">
                Service Fulfillment
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-slate-400">{companyProfile.contactEmail}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-slate-400">{companyProfile.contactPhone}</p>
            </div>
            <Link href="/support" className="mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90" style={{ backgroundColor: '#0ea5e9', color: '#ffffff', border: '1px solid #38bdf8' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Support Desk
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60">
        <div className="container-shell flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {companyProfile.legalName}. All rights reserved.
          </p>
          <a href="https://cysmiqai.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 transition-colors hover:text-sky-400">
            Built by Cysmiq AI
          </a>
        </div>
      </div>
    </footer>
  );
}
