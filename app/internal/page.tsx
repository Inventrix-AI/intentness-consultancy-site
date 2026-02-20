import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PaymentLinkForm } from "@/components/payment-link-form";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/internal/login");

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900">Send Payment Link</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a Razorpay payment link and share it with your client via email or SMS.
        </p>
      </div>
      <PaymentLinkForm />
    </div>
  );
}
