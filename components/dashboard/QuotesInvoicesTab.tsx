import type { PortalAccountRow, PortalData, PortalViewer } from "@/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { AdminCrud } from "./AdminCrud";

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

const dateFmt = (value: string) =>
  value ? new Date(value).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
      {children}
    </p>
  );
}

interface QuotesInvoicesTabProps {
  viewer: PortalViewer;
  data: PortalData;
  canManage: boolean;
  accounts: PortalAccountRow[];
}

export function QuotesInvoicesTab({ viewer, data, canManage, accounts }: QuotesInvoicesTabProps) {
  if (canManage) {
    return (
      <div className="flex flex-col gap-10">
        <AdminCrud
          moduleKey="quotes"
          rows={data.quotes as unknown as Record<string, unknown>[]}
          accounts={accounts}
          heading="Quotes"
          allowCreate
          allowDelete
        />
        <AdminCrud
          moduleKey="invoices"
          rows={data.invoices as unknown as Record<string, unknown>[]}
          accounts={accounts}
          heading="Invoices"
          allowCreate
          allowDelete
        />
      </div>
    );
  }

  const { quotes, invoices } = data;

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
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3.5 font-medium">{quote.reference}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={quoteVariant[quote.status] ?? "default"}>{quote.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-text-dim">R{quote.estimateTotal.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-text-faint">{dateFmt(quote.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {viewer.role === "client" && (
          <p className="mt-3 text-[12.5px] text-text-faint">Quotes shown are the ones on your account.</p>
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
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3.5 font-medium">{invoice.reference}</td>
                    <td className="px-5 py-3.5 text-text-dim">{invoice.eventName}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={invoiceVariant[invoice.status] ?? "default"}>{invoice.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-text-dim">R{invoice.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-text-faint">{dateFmt(invoice.dueDate)}</td>
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
