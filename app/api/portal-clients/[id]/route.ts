import { getDb } from "@/lib/db";
import { asString, failure, ok, readJson } from "@/lib/server";
import { sessionFromRequest } from "@/lib/portal-auth";

export const runtime = "nodejs";

/** Admin-only account status changes (activate a pending access request, or suspend). */
export async function PATCH(request: Request, { params }: { params: { id: string } }): Promise<Response> {
  const session = sessionFromRequest(request);
  if (!session) return failure(401, "Sign in to the portal first.");
  if (session.role !== "admin") return failure(403, "Only a STAGEGRID admin can change account status.");

  const body = await readJson(request);
  const status = body ? asString(body.status) : "";
  if (!["active", "pending", "suspended"].includes(status)) {
    return failure(400, "Status must be active, pending or suspended.");
  }

  const db = getDb();
  if (!db) return failure(503, "Unavailable — no database is configured.");

  const client = await db.client.update({ where: { id: params.id }, data: { status } }).catch(() => null);
  if (!client) return failure(404, "No portal account with that id.");

  return ok({ ok: true, id: client.id, status: client.status });
}
