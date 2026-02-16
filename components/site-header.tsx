"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-base">
          Intentness Consultancy
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  active ? "text-accent" : "text-slate-700 hover:text-base"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/pay"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Pay Online
        </Link>
      </div>
    </header>
  );
}
