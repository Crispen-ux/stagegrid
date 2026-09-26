"use client";

import { useState } from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortalRequests, PortalViewer } from "@/types";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  new: "accent",
  pending: "warn",
  approved: "ok",
  active: "ok",
  handled: "ok",
  sent: "accent",
  draft: "default",
  escalated: "warn",
  quoted: "ok",
};

const money = (value: number) => `R${value.toLocaleString("en-ZA")}`;

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });

const timeFmt = (iso: string) =>
  new Date(iso).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function Section({
  title,
  hint,
  count,
  children,
}: {
  title: string;
  hint?: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          {hint && <p className="mt-0.5 text-[12.5px] text-text-faint">{hint}</p>}
        </div>
        <Badge variant={count > 0 ? "accent" : "default"}>{count}</Badge>
      </div>
      {count === 0 ? (
        <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
          Nothing here yet.
        </p>
      ) : (
        children
      )}
    </section>
  );
}

export function RequestsTab({
  viewer,
  requests,
  canManage,
}: {
  viewer: PortalViewer;
  requests: PortalRequests;
  canManage: boolean;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = viewer.role === "admin";

  async function messageAction(messageId: string, method: "PATCH" | "DELETE", body?: unknown) {
    setBusyId(messageId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "We could not update that message.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function approve(accountId: string) {
    setBusyId(accountId);
    setError(null);
    try {
      const res = await fetch(`/api/portal-clients/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not activate that account.");
        setBusyId(null);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error — please try again.");
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-[2px] text-accent">Requests</div>
        <h1 className="font-display text-xl font-bold">
          {isAdmin ? "Everything submitted to STAGEGRID" : "Your requests"}
        </h1>
        <p className="mt-1 max-w-[62ch] text-[13.5px] text-text-dim">
          {isAdmin
            ? "Live rows from the database — access requests, website quote forms, builder quotes and contact messages."
            : "Live rows from the database attached to your account."}
        </p>
      </div>

      {canManage && (
        <Section
          title="Portal access requests"
          hint="Activate an account to let that person sign in with their own email and password."
          count={requests.accountRequests.length}
        >
          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full min-w-[600px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Requested</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {requests.accountRequests.map((account) => (
                  <tr key={account.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3.5 font-medium">
                      {account.name}
                      {account.company && <div className="text-[12px] text-text-faint">{account.company}</div>}
                    </td>
                    <td className="px-5 py-3.5 text-text-dim">{account.email}</td>
                    <td className="px-5 py-3.5 text-text-faint">{dateFmt(account.created)}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="warn">pending</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        size="sm"
                        disabled={busyId === account.id}
                        onClick={() => approve(account.id)}
                      >
                        {busyId === account.id ? "Activating…" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <p className="mt-2 text-[12.5px] text-warn">{error}</p>}
        </Section>
      )}

      <Section title="Quote requests" count={requests.quoteRequests.length}>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Guests</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {requests.quoteRequests.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 font-medium">{row.reference}</td>
                  <td className="px-5 py-3.5">
                    {row.eventType}
                    {row.venue && <div className="text-[12px] text-text-faint">{row.venue}</div>}
                  </td>
                  <td className="px-5 py-3.5 text-text-dim">{row.guestCount}</td>
                  <td className="px-5 py-3.5 text-text-dim">
                    {row.name}
                    <div className="text-[12px] text-text-faint">{row.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[row.status] ?? "default"}>{row.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-text-faint">{dateFmt(row.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Builder quotes" count={requests.builderQuotes.length}>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Estimate</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {requests.builderQuotes.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 font-medium">{row.reference}</td>
                  <td className="px-5 py-3.5 text-text-dim">{money(row.estimateTotal)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[row.status] ?? "default"}>{row.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-text-faint">{dateFmt(row.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Saved builder configurations" count={requests.builderConfigs.length}>
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Label</th>
                <th className="px-5 py-3 font-medium">Saved</th>
                <th className="px-5 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {requests.builderConfigs.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 font-medium">{row.reference}</td>
                  <td className="px-5 py-3.5 text-text-dim">{row.label || "—"}</td>
                  <td className="px-5 py-3.5 text-text-faint">{dateFmt(row.created)}</td>
                  <td className="px-5 py-3.5 text-text-faint">{timeFmt(row.updated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Contact messages" count={requests.contactMessages.length}>
        <div className="flex flex-col gap-3">
          {requests.contactMessages.map((row) => (
            <div key={row.id} className="rounded border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[15px] font-semibold">
                    {row.name}
                    {row.company && <span className="font-normal text-text-dim"> · {row.company}</span>}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-text-faint">
                    {row.email}
                    {row.phone && <> · {row.phone}</>} · {timeFmt(row.created)}
                  </div>
                </div>
                <Badge variant={row.handled ? "ok" : "warn"}>{row.handled ? "handled" : "new"}</Badge>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-text-dim">{row.message}</p>
              {canManage && (
                <div className="mt-3 flex flex-wrap gap-4 border-t border-border pt-3 text-[12.5px]">
                  <button
                    type="button"
                    className="text-accent underline-offset-4 hover:underline disabled:opacity-40"
                    disabled={busyId === row.id}
                    onClick={() => messageAction(row.id, "PATCH", { handled: !row.handled })}
                  >
                    {row.handled ? "Reopen" : "Mark handled"}
                  </button>
                  <button
                    type="button"
                    className="text-text-faint underline-offset-4 hover:text-warn hover:underline disabled:opacity-40"
                    disabled={busyId === row.id}
                    onClick={() => messageAction(row.id, "DELETE")}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
          {error && <p className="text-[12.5px] text-warn">{error}</p>}
        </div>
      </Section>
    </div>
  );
}
