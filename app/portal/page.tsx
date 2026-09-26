import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { currentSession } from "@/lib/portal-auth";
import { loadPortalRequests } from "@/lib/portal-requests";
import { loadPortalData } from "@/lib/portal-data";
import { PortalShell } from "@/components/dashboard/PortalShell";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import type { PortalAccountRow, PortalViewer } from "@/types";

export const metadata: Metadata = {
  title: "Portal — STAGEGRID",
  description: "STAGEGRID OS — events, equipment, quotes, invoices, crew, logistics and assets in one dashboard.",
  robots: { index: false, follow: false },
};

async function loadAccounts(viewer: PortalViewer): Promise<PortalAccountRow[]> {
  if (viewer.role !== "admin") return [];
  const db = getDb();
  if (!db) return [];
  const rows = await db.client.findMany({ orderBy: { created: "desc" } });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role === "admin" || row.role === "staff" ? row.role : "client",
    status: row.status === "active" || row.status === "suspended" ? row.status : "pending",
    created: row.created.toISOString(),
  }));
}

export default async function PortalPage() {
  const session = currentSession();
  if (!session) redirect("/portal/login");

  const db = getDb();
  const account = db ? await db.client.findUnique({ where: { id: session.clientId } }) : null;
  if (!account || account.status !== "active") redirect("/portal/login");

  const viewer: PortalViewer = {
    id: account.id,
    name: account.name,
    email: account.email,
    company: account.company,
    role: account.role === "staff" ? "staff" : account.role === "admin" ? "admin" : "client",
  };

  const [requests, data, accounts] = await Promise.all([
    loadPortalRequests(viewer),
    loadPortalData(viewer),
    loadAccounts(viewer),
  ]);

  const firstName = viewer.name.split(" ")[0] || viewer.name;
  const subtitle =
    viewer.role === "admin"
      ? "Every request, booking and account — manage it all from the tabs below."
      : viewer.role === "staff"
      ? "STAGEGRID operations view — events, equipment, crew and logistics."
      : "Your bookings, quotes, invoices and requests — nothing from anyone else.";

  return (
    <main>
      <div className="border-b border-border px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[2px] text-accent">Portal</div>
            <h1 className="mt-2 font-display text-2xl font-bold">Welcome back, {firstName}.</h1>
            <p className="mt-1 text-[13.5px] text-text-dim">{subtitle}</p>
          </div>
          <SignOutButton />
        </div>
      </div>
      <PortalShell viewer={viewer} requests={requests} data={data} accounts={accounts} />
    </main>
  );
}
