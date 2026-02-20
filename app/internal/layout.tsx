import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const isLoginPage =
    typeof children === "object" && children !== null && "key" in children
      ? false
      : false;

  // The login page handles its own auth check — allow it through.
  // For all other pages, redirect to login if not authenticated.
  // We detect the login page by checking the URL in middleware-free fashion:
  // Since we can't read the URL in a layout, we let the login page be a parallel route
  // and handle auth in each page individually.

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
      <main className="mx-auto max-w-4xl px-5 py-8">{children}</main>
    </div>
  );
}
