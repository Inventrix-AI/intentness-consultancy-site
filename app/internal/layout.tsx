import Image from "next/image";
import { getSession } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminNav } from "@/components/admin-nav";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Image
              src="/intentness-logo-icon.png"
              alt="Intentness"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold text-slate-700">Admin Portal</span>
          </div>
          {session && <AdminLogoutButton />}
        </div>
      </header>
      {session && <AdminNav />}
      <main className="mx-auto max-w-4xl px-5 py-8">{children}</main>
    </div>
  );
}
