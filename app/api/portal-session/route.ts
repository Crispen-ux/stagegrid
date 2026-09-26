import { getDb } from "@/lib/db";
import { asString, readJson, failure } from "@/lib/server";
import { clearedCookie, createSessionToken, sessionCookie, verifyPassword } from "@/lib/portal-auth";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

/** Sign in with an email + password. Accounts are issued per client, never shared. */
export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return failure(400, "Invalid JSON body.");

  const email = asString(body.email).toLowerCase();
  const password = asString(body.password);

  if (!EMAIL_PATTERN.test(email)) return failure(400, "Enter the email address on your portal account.");
  if (!password) return failure(400, "Enter your password.");

  const db = getDb();
  if (!db) return failure(503, "Portal sign-in is unavailable — no database is configured.");

  const client = await db.client.findUnique({ where: { email } });
  const generic = "That email and password combination is not correct.";

  if (!client || !verifyPassword(password, client.passwordHash)) {
    console.warn(`[portal] rejected sign-in for ${email}`);
    return failure(401, generic);
  }
  if (client.status !== "active") {
    return failure(
      403,
      client.status === "pending"
        ? "Your access request is still awaiting approval."
        : "This portal account is suspended. Contact STAGEGRID."
    );
  }

  const role = client.role === "admin" ? "admin" : "client";
  return new Response(JSON.stringify({ ok: true, name: client.name, role }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": sessionCookie(createSessionToken({ clientId: client.id, role })),
    },
  });
}

export async function DELETE(): Promise<Response> {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": clearedCookie() },
  });
}
