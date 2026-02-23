"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

const tabs: Array<{ href: Route; label: string; exact?: boolean }> = [
  { href: "/internal" as Route, label: "Payment Links", exact: true },
  { href: "/internal/invoices/create" as Route, label: "Create Invoice" },
  { href: "/internal/invoices" as Route, label: "Invoices", exact: true },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl gap-0 overflow-x-auto px-5">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-sky-600 text-sky-700"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
