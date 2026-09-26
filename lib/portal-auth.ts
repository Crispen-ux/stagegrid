import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const PORTAL_COOKIE = "stagegrid_portal";
export const SESSION_SECONDS = 60 * 60 * 12;

const SCRYPT = { N: 16384, r: 8, p: 1 };
const MIN_PASSWORD_LENGTH = 8;

export interface PortalSession {
  clientId: string;
  role: "admin" | "client";
}

function sessionSecret(): string {
  return (
    process.env.PORTAL_SESSION_SECRET?.trim() ||
    `stagegrid-portal:${process.env.PORTAL_PASSWORD?.trim() || "stagegrid"}`
  );
}

function hmac(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

function constantTimeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function passwordError(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > 200) return "That password is too long.";
  return null;
}

/** `scrypt$<salt base64>$<hash base64>` — no auth dependency needed. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, SCRYPT);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  try {
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const actual = scryptSync(password, salt, expected.length, SCRYPT);
    return constantTimeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Token: `<clientId>.<role>.<expiryMs>.<hmac>` — verifiable without server state. */
export function createSessionToken(session: PortalSession, now: number = Date.now()): string {
  const expires = now + SESSION_SECONDS * 1000;
  const body = `${session.clientId}.${session.role}.${expires}`;
  return `${body}.${hmac(body)}`;
}

export function readSessionToken(token: string | undefined | null): PortalSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [clientId, role, expiryRaw, signature] = parts;
  const expires = Number(expiryRaw);
  if (!clientId || !expiryRaw || !Number.isFinite(expires)) return null;
  if (Date.now() > expires) return null;
  if (role !== "admin" && role !== "client") return null;
  const body = `${clientId}.${role}.${expiryRaw}`;
  if (!constantTimeEqual(Buffer.from(signature, "utf8"), Buffer.from(hmac(body), "utf8"))) return null;
  return { clientId, role };
}

export function tokenFromCookieHeader(header: string | null): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === PORTAL_COOKIE) return rest.join("=");
  }
  return null;
}

/** Session from the incoming request (API routes). */
export function sessionFromRequest(request: Request): PortalSession | null {
  return readSessionToken(tokenFromCookieHeader(request.headers.get("cookie")));
}

/** Session from the current route/page (server components). */
export function currentSession(): PortalSession | null {
  return readSessionToken(cookies().get(PORTAL_COOKIE)?.value);
}

export function sessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${PORTAL_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_SECONDS}${secure}`;
}

export function clearedCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${PORTAL_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}
