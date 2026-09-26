import { getDb } from "@/lib/db";
import { failure, ok } from "@/lib/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { ref: string } }
): Promise<Response> {
  const reference = decodeURIComponent(params.ref || "").trim().toUpperCase();
  if (!reference) return failure(400, "A configuration reference is required.");

  const db = getDb();
  if (!db) {
    return failure(
      503,
      "Saved configurations are not available in this environment — no database is configured."
    );
  }

  const config = await db.builderConfig.findUnique({ where: { reference } });
  if (!config) return failure(404, `No configuration found for ${reference}.`);

  return ok({
    ok: true,
    reference: config.reference,
    label: config.label,
    configuration: config.configuration,
    updated: config.updated,
  });
}
