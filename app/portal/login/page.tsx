import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentSession } from "@/lib/portal-auth";
import { PortalLoginForm } from "@/components/dashboard/PortalLoginForm";

export const metadata: Metadata = {
  title: "Portal Sign In — STAGEGRID",
  description: "Sign in to the STAGEGRID OS portal preview.",
  robots: { index: false, follow: false },
};

export default function PortalLoginPage() {
  if (currentSession()) redirect("/portal");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[460px] flex-col justify-center px-6 py-16">
      <div className="text-xs font-semibold uppercase tracking-[2px] text-accent">STAGEGRID OS</div>
      <h1 className="mt-2 font-display text-2xl font-bold">Portal access</h1>
      <p className="mb-8 mt-2 text-[13.5px] leading-relaxed text-text-dim">
        Every client has their own account — sign in with your email and password to see your bookings,
        quotes, invoices and requests. No access yet? Request it below and STAGEGRID will activate it.
      </p>

      <div className="rounded border border-border bg-surface p-7">
        <PortalLoginForm />
      </div>

      <p className="mt-5 text-[12.5px] text-text-faint">
        Or go back to the{" "}
        <Link href="/" className="text-accent underline underline-offset-4">
          homepage
        </Link>
        .
      </p>
    </main>
  );
}
