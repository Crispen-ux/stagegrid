import { getDb } from "@/lib/db";
import {
  EMAIL_PATTERN,
  asOptionalString,
  asString,
  badRequest,
  created,
  failure,
  makeReference,
  readJson,
  write,
} from "@/lib/server";
import { hashPassword, passwordError } from "@/lib/portal-auth";

export const runtime = "nodejs";

/**
 * A visitor asks for portal access with their own email + password. The account lands as
 * `pending` until a STAGEGRID admin activates it — there is no email service to rely on,
 * so approval happens from the portal's Requests tab.
 */
export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return badRequest({ message: "Invalid JSON body." });

  const name = asString(body.name);
  const email = asString(body.email).toLowerCase();
  const password = asString(body.password);
  const company = asOptionalString(body.company, 120);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";
  const passwordProblem = passwordError(password);
  if (passwordProblem) errors.password = passwordProblem;
  if (Object.keys(errors).length > 0) return badRequest(errors);

  const db = getDb();
  if (!db) return failure(503, "Access requests are unavailable — no database is configured.");

  const existing = await db.client.findUnique({ where: { email } });
  if (existing) {
    return failure(409, "An account already exists for that email. Use it to sign in instead.");
  }

  const result = await write("api/access-requests", (client) =>
    client.client.create({
      data: { name, email, company, passwordHash: hashPassword(password), role: "client", status: "pending" },
    })
  );

  if (result.status === "failed") return failure(500, result.error);

  return created({ ok: true, reference: makeReference("SG-A"), status: "pending" });
}
