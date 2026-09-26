import { getDb } from "@/lib/db";
import type { PortalRequests, PortalViewer } from "@/types";

function emptyRequests(): PortalRequests {
  return {
    contactMessages: [],
    quoteRequests: [],
    builderQuotes: [],
    builderConfigs: [],
    accountRequests: [],
  };
}

/**
 * Loads everything shown in the Requests tab. Admins see every row across the
 * portal; a client account only ever sees the rows tagged with its own id.
 */
export async function loadPortalRequests(viewer: PortalViewer): Promise<PortalRequests> {
  const empty = emptyRequests();
  const db = getDb();
  if (!db) return empty;

  const clientScope = viewer.role === "admin" ? {} : { clientId: viewer.id };
  const orderBy = { created: "desc" } as const;

  const [contactMessages, quoteRequests, builderQuotes, builderConfigs, accountRequests] = await Promise.all([
    db.contactMessage.findMany({ where: clientScope, orderBy }),
    db.quoteRequest.findMany({ where: clientScope, orderBy }),
    db.builderQuote.findMany({ where: clientScope, orderBy }),
    db.builderConfig.findMany({ where: clientScope, orderBy }),
    viewer.role === "admin"
      ? db.client.findMany({ where: { status: "pending" }, orderBy: { created: "asc" } })
      : Promise.resolve([]),
  ]);

  return {
    contactMessages: contactMessages.map((row) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      email: row.email,
      phone: row.phone,
      message: row.message,
      handled: row.handled,
      created: row.created.toISOString(),
    })),
    quoteRequests: quoteRequests.map((row) => ({
      id: row.id,
      reference: row.reference,
      eventType: row.eventType,
      guestCount: row.guestCount,
      eventDate: row.eventDate ? row.eventDate.toISOString() : null,
      venue: row.venue,
      name: row.name,
      email: row.email,
      notes: row.notes,
      status: row.status,
      created: row.created.toISOString(),
    })),
    builderQuotes: builderQuotes.map((row) => ({
      id: row.id,
      reference: row.reference,
      estimateTotal: row.estimateTotal,
      status: row.status,
      created: row.created.toISOString(),
    })),
    builderConfigs: builderConfigs.map((row) => ({
      id: row.id,
      reference: row.reference,
      label: row.label,
      created: row.created.toISOString(),
      updated: row.updated.toISOString(),
    })),
    accountRequests: accountRequests.map((row) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      email: row.email,
      created: row.created.toISOString(),
    })),
  };
}
