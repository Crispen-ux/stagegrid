import type { PortalAccountRow, PortalData, PortalLineItem, PortalInvoiceRow, PortalQuoteRow, PortalViewer } from "@/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { breakdown, rand } from "@/lib/breakdown";
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

function PdfButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded border border-border bg-bg px-3 py-1.5 text-[11.5px] font-semibold text-text-dim transition hover:border-accent hover:text-accent"
      title="Opens the generated PDF in a new tab"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
      </svg>
      PDF
    </a>
  );
}

function ItemsTable({ items }: { items: PortalLineItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-[13px]">
        <thead>
          <tr className="text-left text-[10.5px] uppercase tracking-wide text-text-faint">
            <th className="py-2 pr-4 font-medium">Description</th>
            <th className="py-2 pr-4 text-right font-medium">Qty</th>
            <th className="py-2 pr-4 text-right font-medium">Unit price</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.description}-${index}`} className="border-t border-border">
              <td className="py-2 pr-4 text-text-dim">{item.description}</td>
              <td className="py-2 pr-4 text-right text-text-dim">{item.qty}</td>
              <td className="py-2 pr-4 text-right text-text-dim">{rand(item.unitPrice)}</td>
              <td className="py-2 text-right font-medium">{rand(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TotalsStrip({ total, items }: { total: number; items: PortalLineItem[] }) {
  if (items.length === 0) return null;
  const sums = breakdown(total, items);
  return (
    <div className="mt-4 flex justify-end">
      <dl className="w-full max-w-[300px] text-[13px]">
        <div className="flex justify-between py-0.5">
          <dt className="text-text-faint">Subtotal (excl. VAT)</dt>
          <dd className="text-text-dim">{rand(sums.subtotal)}</dd>
        </div>
        <div className="flex justify-between py-0.5">
          <dt className="text-text-faint">VAT @ 15%</dt>
          <dd className="text-text-dim">{rand(sums.vat)}</dd>
        </div>
        <div className="mt-1 flex justify-between border-t border-accent pt-1.5 font-semibold">
          <dt>Total (incl. VAT)</dt>
          <dd className="text-accent">{rand(sums.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

function QuoteCard({ quote, pdf }: { quote: PortalQuoteRow; pdf: boolean }) {
  return (
    <div className="rounded border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">{quote.reference}</span>
          <Badge variant={quoteVariant[quote.status] ?? "default"}>{quote.status}</Badge>
          <span className="text-[12.5px] text-text-faint">Created {dateFmt(quote.createdAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-[15px] font-bold">{rand(quote.estimateTotal)}</span>
          {pdf && <PdfButton href={`/api/quotes/${quote.id}/pdf`} />}
        </div>
      </div>
      {quote.items.length > 0 ? (
        <div className="px-5 py-4">
          <ItemsTable items={quote.items} />
          <TotalsStrip total={quote.estimateTotal} items={quote.items} />
        </div>
      ) : (
        <p className="px-5 py-3 text-[12.5px] text-text-faint">
          Single total — no line items recorded yet. Ask STAGEGRID for the full breakdown.
        </p>
      )}
    </div>
  );
}

function InvoiceCard({ invoice, pdf }: { invoice: PortalInvoiceRow; pdf: boolean }) {
  return (
    <div className="rounded border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">{invoice.reference}</span>
          <Badge variant={invoiceVariant[invoice.status] ?? "default"}>{invoice.status}</Badge>
          <span className="text-[12.5px] text-text-dim">{invoice.eventName}</span>
          <span className="text-[12.5px] text-text-faint">Due {dateFmt(invoice.dueDate)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-[15px] font-bold">{rand(invoice.amount)}</span>
          {pdf && <PdfButton href={`/api/invoices/${invoice.id}/pdf`} />}
        </div>
      </div>
      {invoice.items.length > 0 ? (
        <div className="px-5 py-4">
          <ItemsTable items={invoice.items} />
          <TotalsStrip total={invoice.amount} items={invoice.items} />
        </div>
      ) : (
        <p className="px-5 py-3 text-[12.5px] text-text-faint">
          Single amount — no line items recorded yet. Ask STAGEGRID for the full breakdown.
        </p>
      )}
    </div>
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
  const pdf = data.source === "database";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Quotes</h2>
          {viewer.role === "client" && (
            <span className="text-[12.5px] text-text-faint">On your account — itemised with VAT and a PDF copy</span>
          )}
        </div>
        {quotes.length === 0 ? (
          <Empty>No quotes on your account yet.</Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} pdf={pdf} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Invoices</h2>
          {viewer.role === "client" && (
            <span className="text-[12.5px] text-text-faint">Amounts include VAT at 15%</span>
          )}
        </div>
        {invoices.length === 0 ? (
          <Empty>No invoices on your account yet.</Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} pdf={pdf} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
