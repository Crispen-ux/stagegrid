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

/** GET /api/quotes/[id]/pdf — rendered quotation (admins, staff or the owning client). */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const session = sessionFromRequest(request);
  if (!session) return failure(401, "Sign in to the portal first.");

  const db = getDb();
  if (!db) return failure(503, "PDFs are unavailable — no database is configured.");

  const quote = await db.quote.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { sortOrder: "asc" } }, client: true },
  });
  if (!quote) return failure(404, "That quotation no longer exists.");

  const internal = session.role !== "client";
  if (!internal && quote.clientId !== session.clientId) {
    return failure(404, "That quotation no longer exists.");
  }

  const bytes = await renderPdf({
    kind: "Quotation",
    reference: quote.reference,
    status: quote.status,
    issuedLabel: "Issued",
    issued: dateFmt(quote.created),
    clientName: quote.client?.name ?? "Unassigned account",
    clientCompany: quote.client?.company ?? null,
    clientEmail: quote.client?.email ?? undefined,
    items: quote.items.map((item) => ({
      description: item.description,
      qty: item.qty,
      unitPrice: item.unitPrice,
      amount: item.amount,
    })),
    total: quote.estimateTotal,
    notes: [
      "This quotation is valid for 30 days from the issue date. Equipment is subject to availability at the time of confirmation.",
      "Acceptance is subject to STAGEGRID's standard terms — technical drawings and rigging plans are supplied on approval.",
    ],
  });

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileSafe(quote.reference)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
