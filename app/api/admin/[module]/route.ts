import { getDb } from "@/lib/db";
import { jsonSafe, parseModuleInput } from "@/lib/admin-schema";
import { createRow, listRows, ModuleError, moduleOr404 } from "@/lib/admin-db";
import { sessionFromRequest } from "@/lib/portal-auth";
import { created, failure, ok, readJson } from "@/lib/server";

export const runtime = "nodejs";

function guard(request: Request): Response | null {
  const session = sessionFromRequest(request);
  if (!session) return failure(401, "Sign in to the portal first.");
  if (session.role !== "admin") return failure(403, "Only a STAGEGRID admin can manage portal data.");
  return null;
}

function errorResponse(error: unknown): Response {
  if (error instanceof ModuleError) {
    return Response.json(
      { ok: false, error: error.message, errors: error.errors ?? {} },
      { status: error.status }
    );
  }
  console.error("[admin] failed:", error);
  return failure(500, "We could not complete that just now.");
}

/** GET /api/admin/[module] — list rows (admins only). */
export async function GET(request: Request, { params }: { params: { module: string } }): Promise<Response> {
  const denied = guard(request);
  if (denied) return denied;

  let moduleDef;
  try {
    moduleDef = moduleOr404(params.module);
  } catch (error) {
    return errorResponse(error);
  }

  const db = getDb();
  if (!db) return failure(503, "Management is unavailable — no database is configured.");

  try {
    const rows = await listRows(db, moduleDef);
    return ok({ ok: true, rows: rows.map(jsonSafe) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** POST /api/admin/[module] — create a row (admins only). */
export async function POST(request: Request, { params }: { params: { module: string } }): Promise<Response> {
  const denied = guard(request);
  if (denied) return denied;

  let moduleDef;
  try {
    moduleDef = moduleOr404(params.module);
  } catch (error) {
    return errorResponse(error);
  }
  if (moduleDef.creatable === false) return failure(405, `${moduleDef.label} rows only arrive from public forms.`);

  const db = getDb();
  if (!db) return failure(503, "Management is unavailable — no database is configured.");

  const body = await readJson(request);
  if (!body) return failure(400, "Invalid JSON body.");

  const parsed = parseModuleInput(moduleDef, body, false);
  if (parsed.errors) {
    return Response.json(
      { ok: false, error: Object.values(parsed.errors)[0] ?? "Validation failed.", errors: parsed.errors },
      { status: 400 }
    );
  }

  const session = sessionFromRequest(request);
  try {
    const row = await createRow(db, moduleDef, parsed.data ?? {}, session!);
    return created({ ok: true, row: jsonSafe(row) });
  } catch (error) {
    return errorResponse(error);
  }
}
