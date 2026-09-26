import { getDb } from "@/lib/db";
import { jsonSafe, parseModuleInput } from "@/lib/admin-schema";
import { deleteRow, ModuleError, moduleOr404, updateRow } from "@/lib/admin-db";
import { sessionFromRequest, type PortalSession } from "@/lib/portal-auth";
import { failure, ok, readJson } from "@/lib/server";

export const runtime = "nodejs";

type Auth = { ok: true; session: PortalSession } | { ok: false; response: Response };

function guard(request: Request): Auth {
  const session = sessionFromRequest(request);
  if (!session) return { ok: false, response: failure(401, "Sign in to the portal first.") };
  if (session.role !== "admin") {
    return { ok: false, response: failure(403, "Only a STAGEGRID admin can manage portal data.") };
  }
  return { ok: true, session };
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

function validationResponse(errors: Record<string, string>): Response {
  return Response.json(
    { ok: false, error: Object.values(errors)[0] ?? "Validation failed.", errors },
    { status: 400 }
  );
}

/** PATCH /api/admin/[module]/[id] — update a row (admins only). */
export async function PATCH(
  request: Request,
  { params }: { params: { module: string; id: string } }
): Promise<Response> {
  const auth = guard(request);
  if (!auth.ok) return auth.response;

  let moduleDef;
  try {
    moduleDef = moduleOr404(params.module);
  } catch (error) {
    return errorResponse(error);
  }

  const db = getDb();
  if (!db) return failure(503, "Management is unavailable — no database is configured.");

  const body = await readJson(request);
  if (!body) return failure(400, "Invalid JSON body.");

  const parsed = parseModuleInput(moduleDef, body, true);
  if (parsed.errors) return validationResponse(parsed.errors);

  try {
    const row = await updateRow(db, moduleDef, params.id, parsed.data ?? {}, auth.session);
    return ok({ ok: true, row: jsonSafe(row) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** DELETE /api/admin/[module]/[id] — remove a row (admins only). */
export async function DELETE(
  request: Request,
  { params }: { params: { module: string; id: string } }
): Promise<Response> {
  const auth = guard(request);
  if (!auth.ok) return auth.response;

  let moduleDef;
  try {
    moduleDef = moduleOr404(params.module);
  } catch (error) {
    return errorResponse(error);
  }

  const db = getDb();
  if (!db) return failure(503, "Management is unavailable — no database is configured.");

  try {
    await deleteRow(db, moduleDef, params.id, auth.session);
    return ok({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
