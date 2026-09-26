import { getDb } from "@/lib/db";
import { renderPdf } from "@/lib/pdf";
import { sessionFromRequest } from "@/lib/portal-auth";
import { failure } from "@/lib/server";

export const runtime = "nodejs";

const dateFmt = (value: Date | string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const fileSafe = (value: string) => value.replace(/[^A-Za-z0-9._-]+/g, "-");

/** GET /api/invoices/[id]/pdf — rendered invoice (admins, staff or the owning client). */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const session = sessionFromRequest(request);
  if (!session) return failure(401, "Sign in to the portal first.");

  const db = getDb();
  if (!db) return failure(503, "PDFs are unavailable — no database is configured.");

  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { sortOrder: "asc" } }, client: true },
  });
  if (!invoice) return failure(404, "That invoice no longer exists.");

  const internal = session.role !== "client";
  if (!internal && invoice.clientId !== session.clientId) {
    return failure(404, "That invoice no longer exists.");
  }

  const bytes = await renderPdf({
    kind: "Invoice",
    reference: invoice.reference,
    status: invoice.status,
    issuedLabel: "Issued",
    issued: dateFmt(invoice.created),
    dueLabel: "Due",
    due: dateFmt(invoice.dueDate),
    eventName: invoice.eventName,
    clientName: invoice.client?.name ?? "Unassigned account",
    clientCompany: invoice.client?.company ?? null,
    clientEmail: invoice.client?.email ?? undefined,
    items: invoice.items.map((item) => ({
      description: item.description,
      qty: item.qty,
      unitPrice: item.unitPrice,
      amount: item.amount,
    })),
    total: invoice.amount,
    notes: [
      invoice.bookingRef
        ? `Reference your booking ${invoice.bookingRef} on all payment.`
        : "Please quote this invoice number on all payment.",
      "Late payments attract interest per STAGEGRID's standard trading terms. Banking details are supplied with your contract.",
    ],
  });

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileSafe(invoice.reference)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
