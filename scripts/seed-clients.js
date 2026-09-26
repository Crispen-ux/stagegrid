#!/usr/bin/env node
/**
 * Seeds portal accounts (one email + password per client — never a shared password).
 *
 *   npm run db:seed
 *
 * Existing rows are matched on email and updated in place, so this is safe to re-run.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
require("dotenv").config();

const { randomBytes, scryptSync } = require("node:crypto");
const { Client } = require("pg");

const SCRYPT = { N: 16384, r: 8, p: 1 };

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, SCRYPT);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

const accounts = [
  {
    name: "STAGEGRID Ops",
    company: "STAGEGRID",
    email: "ops@stagegrid.co.za",
    password: process.env.PORTAL_ADMIN_PASSWORD || "SG-62Jzyw",
    role: "admin",
    status: "active",
  },
  {
    name: "Kim Naidoo",
    company: "Acme Corp",
    email: "kim@acme.co.za",
    password: process.env.ACME_PASSWORD || "acme-portal-2026",
    role: "client",
    status: "active",
  },
  {
    name: "Sana Patel",
    company: "Northwind Media",
    email: "sana@northwind.co.za",
    password: process.env.NORTHWIND_PASSWORD || "northwind-portal-2026",
    role: "client",
    status: "active",
  },
];

function newId() {
  return `cl${randomBytes(9).toString("base64url")}`;
}

async function main() {
  const url =
    process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL || "";
  if (!url.trim()) {
    console.error("No DATABASE_URL found — run `npx vercel env pull` first.");
    process.exit(1);
  }

  const db = new Client({ connectionString: url, ssl: url.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined });
  await db.connect();
  try {
    for (const account of accounts) {
      const hash = hashPassword(account.password);
      await db.query(
        `INSERT INTO "Client" (id, email, name, company, "passwordHash", role, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE
           SET name = EXCLUDED.name,
               company = EXCLUDED.company,
               "passwordHash" = EXCLUDED."passwordHash",
               role = EXCLUDED.role,
               status = EXCLUDED.status`,
        [
          newId(),
          account.email.toLowerCase(),
          account.name,
          account.company,
          hash,
          account.role,
          account.status,
        ]
      );
      console.log(`✓ ${account.email} — ${account.role} / ${account.status} (password: ${account.password})`);
    }

    const { rows } = await db.query(
      `SELECT email, name, role, status FROM "Client" ORDER BY role DESC, email`
    );
    console.log(`\n${rows.length} portal account(s):`);
    for (const row of rows) console.log(`  ${row.status.padEnd(8)} ${row.role.padEnd(6)} ${row.email}`);
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
