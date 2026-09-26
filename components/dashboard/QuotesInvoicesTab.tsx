import { portalScope } from "@/data/portal";
import type { PortalViewer } from "@/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const quoteVariant: Record<string, BadgeProps["variant"]> = {
  draft: "default",
  sent: "accent",
  approved: "ok",
  expired: "warn",
};

const invoiceVariant: Record<string, BadgeProps["variant"]> = {
  draft: "default",
  sent: "accent",
  paid: "ok",
  overdue: "warn",
};

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
      {children}
    </p>
  );
}

export function QuotesInvoicesTab({ viewer }: { viewer: PortalViewer }) {
  const { quotes, invoices } = portalScope(viewer);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="mb-4 font-display text-lg font-bold">Quotes</h2>
        {quotes.length === 0 ? (
          <Empty>No quotes on your account yet.</Empty>
        ) : (
          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full min-w-[520px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                  <th className="px-5 py-3 font-medium">Quote ID</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Estimated Total</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3.5 font-medium">{q.id}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={quoteVariant[q.status]}>{q.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-text-dim">
                      R{q.recommendedPackage.estimatedTotal.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-text-faint">{q.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-bold">Invoices</h2>
        {invoices.length === 0 ? (
          <Empty>No invoices on your account yet.</Empty>
        ) : (
          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full min-w-[520px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                  <th className="px-5 py-3 font-medium">Invoice ID</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3.5 font-medium">{inv.id}</td>
                    <td className="px-5 py-3.5 text-text-dim">{inv.eventName}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={invoiceVariant[inv.status]}>{inv.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-text-dim">R{inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-text-faint">{inv.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
