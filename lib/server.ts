import { randomBytes, randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeReference(prefix: string): string {
  const bytes = randomBytes(8);
  let body = "";
  for (let i = 0; i < 8; i += 1) body += ALPHABET[bytes[i] % ALPHABET.length];
  return `${prefix}-${body}`;
}

export function mockId(): string {
  return randomUUID();
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2002";
}

/**
 * Runs a create that must produce a unique reference, regenerating the reference on
 * the (vanishingly rare) chance of a collision.
 */
export async function createUniqueReference<T>(
  prefix: string,
  create: (reference: string) => Promise<T>
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await create(makeReference(prefix));
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      lastError = error;
    }
  }
  throw lastError;
}

export type WriteResult<T> =
  | { status: "saved"; value: T }
  | { status: "mocked" }
  | { status: "failed"; error: string };

/**
 * Persists through Prisma when a database is configured. Without `DATABASE_URL` the
 * payload is logged instead of stored and the caller can answer with a synthetic id —
 * this is what keeps every form usable on a fresh clone.
 */
export async function write<T>(label: string, run: (db: NonNullable<ReturnType<typeof getDb>>) => Promise<T>): Promise<WriteResult<T>> {
  const db = getDb();
  if (!db) {
    console.log(`[${label}] no DATABASE_URL configured — payload logged, not stored.`);
    return { status: "mocked" };
  }
  try {
    return { status: "saved", value: await run(db) };
  } catch (error) {
    console.error(`[${label}] write failed:`, error);
    return { status: "failed", error: "We could not save that just now. Please try again." };
  }
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function created(body: Record<string, unknown>): Response {
  return Response.json(body, { status: 201 });
}

export function ok(body: Record<string, unknown>): Response {
  return Response.json(body, { status: 200 });
}

export function badRequest(errors: Record<string, string>): Response {
  return Response.json({ ok: false, errors }, { status: 400 });
}

export function failure(status: number, error: string): Response {
  return Response.json({ ok: false, error }, { status });
}

export function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function asOptionalString(value: unknown, maxLength = 500): string | null {
  const text = asString(value);
  if (!text) return null;
  return text.slice(0, maxLength);
}

export function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return Number.NaN;
}

export function asObject(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  return null;
}

export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
