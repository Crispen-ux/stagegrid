import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

export type Database = PrismaClient;

function connectionString(): string | null {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "";
  return url.trim() ? url.trim() : null;
}

const globalForPrisma = globalThis as unknown as { __stagegridDb?: PrismaClient };

/**
 * Returns a shared Prisma client, or `null` when no database is configured.
 * Callers treat `null` as "run in mock mode" rather than failing, so the UI keeps
 * working on a fresh clone before any Postgres instance exists.
 */
export function getDb(): Database | null {
  const url = connectionString();
  if (!url) return null;

  if (!globalForPrisma.__stagegridDb) {
    globalForPrisma.__stagegridDb = new PrismaClient({
      adapter: new PrismaPg({ connectionString: url }),
    });
  }
  return globalForPrisma.__stagegridDb;
}

export function hasDatabase(): boolean {
  return connectionString() !== null;
}
