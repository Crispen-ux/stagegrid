import type { Database } from "@/lib/db";
import { ADMIN_MODULES, type AdminModule, type LineItemInput } from "@/lib/admin-schema";
import { hashPassword, type PortalSession } from "@/lib/portal-auth";
import { makeReference } from "@/lib/server";

/**
 * Server-side wiring for `/api/admin/[module]`: model delegates, password hashing
 * and unique-reference generation live here so both route files stay thin.
 */

interface Delegate {
  findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  createMany?: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
  deleteMany?: (args: Record<string, unknown>) => Promise<unknown>;
}

const DELEGATES: Record<string, string> = {
  products: "product",
  bookings: "booking",
  quotes: "quote",
  invoices: "invoice",
  crew: "crewMember",
  vehicles: "vehicle",
  assets: "asset",
  deliveries: "delivery",
  clients: "client",
  messages: "contactMessage",
};

/** Modules whose rows carry an itemised breakdown. */
const LINE_MODULES: Record<string, { model: string; foreignKey: string }> = {
  quotes: { model: "quoteItem", foreignKey: "quoteId" },
  invoices: { model: "invoiceItem", foreignKey: "invoiceId" },
};

export class ModuleError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
  }
}

export function delegateFor(db: Database, module: AdminModule): Delegate {
  const name = DELEGATES[module.key];
  const target = (db as unknown as Record<string, Delegate>)[name];
  if (!target) throw new ModuleError(500, `Model for "${module.key}" is missing.`);
  return target;
}

/** Quotes and invoices list with their line items attached, in order. */
export async function listRows(db: Database, module: AdminModule): Promise<unknown[]> {
  const delegate = delegateFor(db, module);
  if (LINE_MODULES[module.key]) {
    return delegate.findMany({ include: { items: { orderBy: { sortOrder: "asc" } } } });
  }
  return delegate.findMany();
}

function lineDelegate(db: Database, module: AdminModule): Delegate {
  const config = LINE_MODULES[module.key];
  const target = config ? (db as unknown as Record<string, Delegate>)[config.model] : undefined;
  if (!target) throw new ModuleError(500, `Line item model for "${module.key}" is missing.`);
  return target;
}

/** Replaces the whole breakdown of one row (items come as a complete list). */
async function writeLines(db: Database, module: AdminModule, id: string, items: LineItemInput[]): Promise<void> {
  const config = LINE_MODULES[module.key];
  if (!config) return;
  const delegate = lineDelegate(db, module);
  if (delegate.deleteMany) await delegate.deleteMany({ where: { [config.foreignKey]: id } });
  if (items.length === 0 || !delegate.createMany) return;
  await delegate.createMany({
    data: items.map((item, index) => ({ ...item, sortOrder: index, [config.foreignKey]: id })),
  });
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2002";
}

function isRecordNotFound(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2025";
}

function isForeignKeyViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2003";
}

function violatedField(error: unknown): string | null {
  const target = (error as { meta?: { target?: unknown } }).meta?.target;
  if (Array.isArray(target) && typeof target[0] === "string") return target[0];
  if (typeof target === "string") return target;
  return null;
}

/** Turns validated input into Prisma `data`: passwords hash, references auto-generate. */
export function toWriteData(
  module: AdminModule,
  input: Record<string, unknown>,
  session: PortalSession,
  includeReference: boolean
): Record<string, unknown> {
  const data: Record<string, unknown> = { ...input };

  if (module.key === "clients" && typeof data.password === "string" && data.password) {
    data.passwordHash = hashPassword(data.password);
  }
  delete data.password;
  delete data.items; // breakdown rows are written separately by writeLines()

  if (module.reference && includeReference && !data[module.reference.field]) {
    data[module.reference.field] = makeReference(module.reference.prefix);
  }
  if (module.key === "bookings" && data.eventDate === undefined && !includeReference) {
    delete data.eventDate;
  }
  void session;
  return data;
}

async function uniqueCreate(
  db: Database,
  module: AdminModule,
  data: Record<string, unknown>
): Promise<unknown> {
  const delegate = delegateFor(db, module);
  const generated = module.reference ? String(data[module.reference.field]) : null;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await delegate.create({ data });
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        const field = violatedField(error);
        const label = module.fields.find((candidate) => candidate.name === field)?.label ?? field ?? "reference";
        throw new ModuleError(400, "Validation failed.", {
          [field ?? "form"]: `${label} does not point at an existing row.`,
        });
      }
      if (!isUniqueViolation(error)) throw error;
      const field = violatedField(error);
      const wasAutoGenerated =
        module.reference !== undefined &&
        field === module.reference.field &&
        generated !== null &&
        data[module.reference.field] === generated;

      if (!wasAutoGenerated) {
        const label = module.fields.find((candidate) => candidate.name === field)?.label ?? field ?? "value";
        throw new ModuleError(409, `That ${label.toLowerCase()} is already in use.`, {
          [field ?? "form"]: `${label} is already in use.`,
        });
      }
      data = { ...data, [module.reference!.field]: makeReference(module.reference!.prefix) };
    }
  }
  throw new ModuleError(500, "Could not generate a free reference. Please try again.");
}

export async function createRow(
  db: Database,
  module: AdminModule,
  input: Record<string, unknown>,
  session: PortalSession
): Promise<unknown> {
  const data = toWriteData(module, input, session, true);
  if (module.key === "clients" && !input.password) {
    throw new ModuleError(400, "Validation failed.", { password: "A password is required." });
  }
  const row = (await uniqueCreate(db, module, data)) as { id?: string } | null;
  if (row && typeof row.id === "string" && LINE_MODULES[module.key]) {
    await writeLines(db, module, row.id, Array.isArray(input.items) ? (input.items as LineItemInput[]) : []);
    return withLines(db, module, row.id, row);
  }
  return row;
}

/** Re-reads a row with its breakdown attached (create/update responses). */
async function withLines(
  db: Database,
  module: AdminModule,
  id: string,
  fallback: unknown
): Promise<unknown> {
  if (!LINE_MODULES[module.key]) return fallback;
  const row = await delegateFor(db, module).findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  return row ?? fallback;
}

export async function updateRow(
  db: Database,
  module: AdminModule,
  id: string,
  input: Record<string, unknown>,
  session: PortalSession
): Promise<unknown> {
  const delegate = delegateFor(db, module);
  const items = Array.isArray(input.items) ? (input.items as LineItemInput[]) : null;
  const data = toWriteData(module, input, session, false);

  if (module.key === "clients" && session.clientId === id) {
    const nextRole = typeof input.role === "string" ? input.role : undefined;
    const nextStatus = typeof input.status === "string" ? input.status : undefined;
    if (nextRole && nextRole !== "admin") {
      throw new ModuleError(400, "You cannot change your own role.", { role: "You cannot change your own role." });
    }
    if (nextStatus && nextStatus !== "active") {
      throw new ModuleError(400, "You cannot suspend your own account.", {
        status: "You cannot suspend your own account.",
      });
    }
  }

  try {
    const row = await delegate.update({ where: { id }, data });
    if (items && LINE_MODULES[module.key]) {
      await writeLines(db, module, id, items);
      return withLines(db, module, id, row);
    }
    return row;
  } catch (error) {
    if (isRecordNotFound(error)) throw new ModuleError(404, "That row no longer exists.");
    if (isForeignKeyViolation(error)) {
      const field = violatedField(error);
      const label = module.fields.find((candidate) => candidate.name === field)?.label ?? field ?? "reference";
      throw new ModuleError(400, "Validation failed.", {
        [field ?? "form"]: `${label} does not point at an existing row.`,
      });
    }
    if (isUniqueViolation(error)) {
      const field = violatedField(error);
      const label = module.fields.find((candidate) => candidate.name === field)?.label ?? field ?? "value";
      throw new ModuleError(409, `That ${label.toLowerCase()} is already in use.`, {
        [field ?? "form"]: `${label} is already in use.`,
      });
    }
    throw error;
  }
}

export async function deleteRow(db: Database, module: AdminModule, id: string, session: PortalSession): Promise<void> {
  const delegate = delegateFor(db, module);

  if (module.key === "clients" && session.clientId === id) {
    throw new ModuleError(400, "You cannot delete your own account.");
  }
  if (module.key === "clients") {
    const target = (await delegate.findUnique({ where: { id } })) as { role?: string } | null;
    if (target?.role === "admin") {
      const admins = (await delegate.findMany({ where: { role: "admin", status: "active" } })) as { id: string }[];
      if (admins.length <= 1) {
        throw new ModuleError(400, "That is the last active admin — create another admin first.");
      }
    }
  }

  try {
    await delegate.delete({ where: { id } });
  } catch (error) {
    if (isRecordNotFound(error)) throw new ModuleError(404, "That row no longer exists.");
    if (isUniqueViolation(error)) throw new ModuleError(409, "That row is still in use.");
    throw error;
  }
}

export function moduleOr404(key: string): AdminModule {
  const moduleDef = ADMIN_MODULES[key];
  if (!moduleDef) throw new ModuleError(404, "Unknown module.");
  return moduleDef;
}
