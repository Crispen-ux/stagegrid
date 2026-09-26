/**
 * Single source of truth for the portal's admin CRUD: the API validates with
 * `parseModuleInput` and the management UI renders its tables and forms from the
 * same `columns` / `fields` definitions. Keep this file free of server-only imports
 * (crypto, prisma, next/headers) — it is imported by client components too.
 */

export type AdminFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "select"
  | "date"
  | "textarea"
  | "toggle"
  | "ref"
  | "lines";

/** One editable row of a quote/invoice breakdown. */
export interface LineItemInput {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  optionsSource?: "accounts" | "products";
  placeholder?: string;
  min?: number;
  max?: number;
  /** Shown only in the form (never in tables). */
  help?: string;
  /** Create requires it, edits may leave it blank. */
  writeOnly?: boolean;
}

export type AdminColumnRender = "money" | "date" | "bool" | "badge" | "client" | "truncate" | "count";

export interface AdminColumn {
  name: string;
  label: string;
  render?: AdminColumnRender;
}

export interface AdminModule {
  key: string;
  label: string;
  singular: string;
  description: string;
  columns: AdminColumn[];
  fields: AdminField[];
  /** Server generates a unique value when the field is left empty on create. */
  reference?: { field: string; prefix: string };
  uniqueField?: string;
  /** POST is not allowed (rows only arrive from public forms). */
  creatable?: boolean;
  /** Row action that opens the generated PDF for this id. */
  pdfPath?: string;
}

const CLIENT_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "client", label: "Client" },
];

const ACCOUNT_STATUSES = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
];

const BOOKING_STATUSES = [
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const QUOTE_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "approved", label: "Approved" },
  { value: "expired", label: "Expired" },
];

const INVOICE_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

const CREW_ROLES = [
  { value: "lead-technician", label: "Lead Technician" },
  { value: "rigger", label: "Rigger" },
  { value: "audio-tech", label: "Audio Technician" },
  { value: "lighting-tech", label: "Lighting Technician" },
  { value: "driver", label: "Driver" },
  { value: "general", label: "General Crew" },
];

const VEHICLE_STATUSES = [
  { value: "warehouse", label: "Warehouse" },
  { value: "loaded", label: "Loaded" },
  { value: "en-route", label: "En route" },
  { value: "arrived", label: "Arrived" },
  { value: "returning", label: "Returning" },
];

const ASSET_STATUSES = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "picked", label: "Picked" },
  { value: "loaded", label: "Loaded" },
  { value: "deployed", label: "Deployed" },
  { value: "returned", label: "Returned" },
  { value: "inspection", label: "Inspection" },
  { value: "maintenance", label: "Maintenance" },
];

const DELIVERY_STAGES = [
  { value: "Warehouse", label: "Warehouse" },
  { value: "Loaded", label: "Loaded" },
  { value: "En Route", label: "En Route" },
  { value: "Arrived", label: "Arrived" },
  { value: "Setup", label: "Setup" },
  { value: "Live", label: "Live" },
  { value: "Strike", label: "Strike" },
  { value: "Returning", label: "Returning" },
];

export const EQUIPMENT_CATEGORIES = [
  { value: "audio", label: "Audio" },
  { value: "subwoofers", label: "Subwoofers" },
  { value: "microphones", label: "Microphones" },
  { value: "mixing", label: "Mixing" },
  { value: "trussing", label: "Trussing" },
  { value: "stage", label: "Stage" },
  { value: "lighting", label: "Lighting" },
  { value: "av", label: "AV" },
  { value: "accessories", label: "Accessories" },
];

const ACCOUNT_REF: AdminField = {
  name: "clientId",
  label: "Client account",
  type: "ref",
  optionsSource: "accounts",
  placeholder: "Unassigned (admin only)",
};

export const ADMIN_MODULES: Record<string, AdminModule> = {
  products: {
    key: "products",
    label: "Products & Equipment",
    singular: "Product",
    description: "Catalogue rows behind the portal equipment overview and asset register.",
    uniqueField: "sku",
    columns: [
      { name: "sku", label: "SKU" },
      { name: "name", label: "Name" },
      { name: "category", label: "Category" },
      { name: "dailyRate", label: "Day rate", render: "money" },
      { name: "quantityAvailable", label: "In stock" },
      { name: "available", label: "Available", render: "bool" },
    ],
    fields: [
      { name: "sku", label: "SKU", type: "text", required: true, placeholder: "eq-030" },
      { name: "name", label: "Name", type: "text", required: true, placeholder: "L-Series Line Array Element" },
      { name: "category", label: "Category", type: "select", required: true, options: EQUIPMENT_CATEGORIES },
      { name: "dailyRate", label: "Day rate (ZAR)", type: "number", required: true, min: 0 },
      { name: "quantityAvailable", label: "Quantity available", type: "number", required: true, min: 0 },
      {
        name: "available",
        label: "Bookable now",
        type: "toggle",
        help: "Off hides the item from availability counts.",
      },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  bookings: {
    key: "bookings",
    label: "Events & Bookings",
    singular: "Booking",
    description: "Every event STAGEGRID is delivering, with status and crew count.",
    reference: { field: "reference", prefix: "bk" },
    uniqueField: "reference",
    columns: [
      { name: "reference", label: "Reference" },
      { name: "eventName", label: "Event" },
      { name: "status", label: "Status", render: "badge" },
      { name: "deliveryWindow", label: "Delivery" },
      { name: "eventDate", label: "Date", render: "date" },
      { name: "clientId", label: "Client", render: "client" },
    ],
    fields: [
      { name: "reference", label: "Reference", type: "text", placeholder: "Auto-generated when empty" },
      { name: "eventName", label: "Event name", type: "text", required: true, placeholder: "Corporate Product Launch" },
      { name: "status", label: "Status", type: "select", required: true, options: BOOKING_STATUSES },
      { name: "deliveryWindow", label: "Delivery window", type: "text", placeholder: "Tomorrow · 07:30" },
      { name: "eventDate", label: "Event date", type: "date" },
      ACCOUNT_REF,
    ],
  },
  quotes: {
    key: "quotes",
    label: "Quotes",
    singular: "Quote",
    description: "Quoted packages with their status and estimate.",
    reference: { field: "reference", prefix: "SG-QT" },
    uniqueField: "reference",
    pdfPath: "/api/quotes/[id]/pdf",
    columns: [
      { name: "reference", label: "Reference" },
      { name: "status", label: "Status", render: "badge" },
      { name: "estimateTotal", label: "Estimate", render: "money" },
      { name: "items", label: "Lines", render: "count" },
      { name: "createdAt", label: "Created", render: "date" },
      { name: "clientId", label: "Client", render: "client" },
    ],
    fields: [
      { name: "reference", label: "Reference", type: "text", placeholder: "Auto-generated when empty" },
      { name: "status", label: "Status", type: "select", required: true, options: QUOTE_STATUSES },
      { name: "estimateTotal", label: "Estimate (ZAR)", type: "number", required: true, min: 0 },
      {
        name: "items",
        label: "Line items",
        type: "lines",
        help: "The breakdown shown in the portal and printed on the PDF. Leave empty to show a single total.",
      },
      ACCOUNT_REF,
    ],
  },
  invoices: {
    key: "invoices",
    label: "Invoices",
    singular: "Invoice",
    description: "Billing per event, tracked against due dates.",
    reference: { field: "reference", prefix: "inv" },
    uniqueField: "reference",
    pdfPath: "/api/invoices/[id]/pdf",
    columns: [
      { name: "reference", label: "Reference" },
      { name: "eventName", label: "Event" },
      { name: "amount", label: "Amount", render: "money" },
      { name: "items", label: "Lines", render: "count" },
      { name: "status", label: "Status", render: "badge" },
      { name: "dueDate", label: "Due", render: "date" },
      { name: "clientId", label: "Client", render: "client" },
    ],
    fields: [
      { name: "reference", label: "Reference", type: "text", placeholder: "Auto-generated when empty" },
      { name: "eventName", label: "Event name", type: "text", required: true },
      { name: "amount", label: "Amount (ZAR)", type: "number", required: true, min: 0 },
      { name: "status", label: "Status", type: "select", required: true, options: INVOICE_STATUSES },
      { name: "dueDate", label: "Due date", type: "date" },
      { name: "bookingRef", label: "Booking reference", type: "text", placeholder: "bk-1001" },
      {
        name: "items",
        label: "Line items",
        type: "lines",
        help: "The breakdown shown in the portal and printed on the PDF. Leave empty to show a single total.",
      },
      ACCOUNT_REF,
    ],
  },
  crew: {
    key: "crew",
    label: "Crew",
    singular: "Crew member",
    description: "The people rostered onto events.",
    uniqueField: "name",
    columns: [
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "phone", label: "Phone" },
      { name: "active", label: "Active", render: "bool" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "role", label: "Role", type: "select", required: true, options: CREW_ROLES },
      { name: "phone", label: "Phone", type: "text", placeholder: "082 000 0000" },
      { name: "active", label: "Available for rostering", type: "toggle" },
    ],
  },
  vehicles: {
    key: "vehicles",
    label: "Fleet",
    singular: "Vehicle",
    description: "Trucks and their road status.",
    uniqueField: "label",
    columns: [
      { name: "label", label: "Vehicle" },
      { name: "driver", label: "Driver" },
      { name: "status", label: "Status", render: "badge" },
    ],
    fields: [
      { name: "label", label: "Label", type: "text", required: true, placeholder: "8-Ton Truck 04" },
      { name: "driver", label: "Driver", type: "text" },
      { name: "status", label: "Status", type: "select", required: true, options: VEHICLE_STATUSES },
    ],
  },
  assets: {
    key: "assets",
    label: "Assets",
    singular: "Asset",
    description: "Serialised stock and where it is in its lifecycle.",
    uniqueField: "serial",
    columns: [
      { name: "serial", label: "Serial" },
      { name: "equipmentId", label: "Product" },
      { name: "status", label: "Status", render: "badge" },
      { name: "bookingRef", label: "Booking" },
    ],
    fields: [
      { name: "serial", label: "Serial number", type: "text", required: true, placeholder: "LA-0999" },
      {
        name: "equipmentId",
        label: "Product",
        type: "ref",
        optionsSource: "products",
        required: true,
        placeholder: "eq-001",
      },
      { name: "status", label: "Lifecycle status", type: "select", required: true, options: ASSET_STATUSES },
      { name: "bookingRef", label: "Booking reference", type: "text", placeholder: "bk-1001" },
    ],
  },
  deliveries: {
    key: "deliveries",
    label: "Deliveries",
    singular: "Delivery",
    description: "Live logistics: trucks on the road right now.",
    columns: [
      { name: "eventName", label: "Event" },
      { name: "truck", label: "Truck" },
      { name: "currentStage", label: "Stage", render: "badge" },
      { name: "eta", label: "ETA" },
      { name: "active", label: "Live", render: "bool" },
      { name: "clientId", label: "Client", render: "client" },
    ],
    fields: [
      { name: "eventName", label: "Event name", type: "text", required: true },
      { name: "truck", label: "Truck", type: "text", required: true },
      { name: "driver", label: "Driver", type: "text", required: true },
      { name: "leadTechnician", label: "Lead technician", type: "text", required: true },
      { name: "currentLocation", label: "Current location", type: "text", required: true },
      { name: "eta", label: "ETA", type: "text", required: true, placeholder: "06:40" },
      { name: "currentStage", label: "Stage", type: "select", required: true, options: DELIVERY_STAGES },
      { name: "active", label: "Show as the live delivery", type: "toggle" },
      ACCOUNT_REF,
    ],
  },
  clients: {
    key: "clients",
    label: "Clients & Staff",
    singular: "Account",
    description: "Portal logins — one email and password per person, never shared.",
    uniqueField: "email",
    columns: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "company", label: "Company" },
      { name: "role", label: "Role", render: "badge" },
      { name: "status", label: "Status", render: "badge" },
      { name: "created", label: "Requested", render: "date" },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "company", label: "Company", type: "text" },
      { name: "role", label: "Role", type: "select", required: true, options: CLIENT_ROLES },
      { name: "status", label: "Status", type: "select", required: true, options: ACCOUNT_STATUSES },
      {
        name: "password",
        label: "Password",
        type: "password",
        writeOnly: true,
        help: "Required to create an account. Leave blank when editing to keep the current password.",
      },
    ],
  },
  messages: {
    key: "messages",
    label: "Contact messages",
    singular: "Message",
    description: "Messages from the public contact form.",
    creatable: false,
    columns: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "message", label: "Message", render: "truncate" },
      { name: "handled", label: "Handled", render: "bool" },
      { name: "created", label: "Received", render: "date" },
    ],
    fields: [{ name: "handled", label: "Marked as handled", type: "toggle" }],
  },
};

export const ADMIN_MODULE_KEYS = Object.keys(ADMIN_MODULES);

const MAX_TEXT = 500;

export interface ParsedInput {
  data?: Record<string, unknown>;
  errors?: Record<string, string>;
}

function toIsoOrNull(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

/**
 * Validates a create (`partial: false`) or edit (`partial: true`) payload against
 * the module definition. Unknown keys are ignored; `partial` skips missing fields.
 */
export function parseModuleInput(
  module: AdminModule,
  input: Record<string, unknown>,
  partial: boolean
): ParsedInput {
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of module.fields) {
    const provided = Object.prototype.hasOwnProperty.call(input, field.name);
    if (!provided) {
      if (partial) continue;
      if (field.type === "password" || field.type === "date" || field.type === "textarea" || field.type === "ref" || field.type === "lines") {
        // optional on create
      } else if (field.type === "toggle") {
        data[field.name] = false;
      } else if (field.required) {
        errors[field.name] = `${field.label} is required.`;
      }
      continue;
    }

    const raw = input[field.name];

    switch (field.type) {
      case "number": {
        const value = typeof raw === "number" ? raw : Number(String(raw ?? "").trim());
        if (!Number.isFinite(value)) {
          errors[field.name] = `${field.label} must be a number.`;
          break;
        }
        if (field.min !== undefined && value < field.min) {
          errors[field.name] = `${field.label} must be at least ${field.min}.`;
          break;
        }
        if (field.max !== undefined && value > field.max) {
          errors[field.name] = `${field.label} must be at most ${field.max}.`;
          break;
        }
        data[field.name] = Math.round(value);
        break;
      }
      case "toggle":
        data[field.name] = raw === true || raw === "true";
        break;
      case "select": {
        const value = String(raw ?? "").trim();
        const allowed = (field.options ?? []).map((option) => option.value);
        if (field.required && !value) {
          errors[field.name] = `${field.label} is required.`;
          break;
        }
        if (value && !allowed.includes(value)) {
          errors[field.name] = `${field.label} is not a valid option.`;
          break;
        }
        data[field.name] = value;
        break;
      }
      case "date":
        data[field.name] = toIsoOrNull(raw);
        break;
      case "lines": {
        if (raw === null || raw === undefined) {
          data[field.name] = [];
          break;
        }
        if (!Array.isArray(raw)) {
          errors[field.name] = `${field.label} must be a list of rows.`;
          break;
        }
        const items: LineItemInput[] = [];
        let message: string | null = null;
        for (const [index, entry] of raw.entries()) {
          const row = entry && typeof entry === "object" && !Array.isArray(entry)
            ? (entry as Record<string, unknown>)
            : {};
          const description = String(row.description ?? "").trim().slice(0, MAX_TEXT);
          if (!description) {
            message = `Line ${index + 1} needs a description.`;
            break;
          }
          const qty = Number(String(row.qty ?? "1").trim());
          const unitPrice = Number(String(row.unitPrice ?? "0").trim());
          if (!Number.isFinite(qty) || Math.round(qty) !== qty || qty < 1) {
            message = `Line ${index + 1}: quantity must be a whole number of 1 or more.`;
            break;
          }
          if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            message = `Line ${index + 1}: unit price must be 0 or more.`;
            break;
          }
          items.push({
            description,
            qty,
            unitPrice: Math.round(unitPrice),
            amount: Math.round(qty * Math.round(unitPrice)),
          });
        }
        if (message) {
          errors[field.name] = message;
          break;
        }
        data[field.name] = items;
        break;
      }
      case "ref": {
        const value = String(raw ?? "").trim();
        if (field.required && !value) {
          errors[field.name] = `${field.label} is required.`;
          break;
        }
        data[field.name] = value || null;
        break;
      }
      case "password": {
        const value = String(raw ?? "");
        if (!value) {
          if (!partial && field.required) errors[field.name] = `${field.label} is required.`;
          break;
        }
        if (value.length < 8) {
          errors[field.name] = "Use at least 8 characters.";
          break;
        }
        data[field.name] = value;
        break;
      }
      case "email": {
        const value = String(raw ?? "").trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          errors[field.name] = "Enter a valid email address.";
          break;
        }
        data[field.name] = value;
        break;
      }
      default: {
        const value = String(raw ?? "").trim().slice(0, MAX_TEXT);
        if (field.required && !value) {
          errors[field.name] = `${field.label} is required.`;
          break;
        }
        data[field.name] = value;
      }
    }
  }

  if (partial && Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
    return { errors: { form: "Nothing to update." } };
  }
  return Object.keys(errors).length > 0 ? { errors } : { data };
}

/** Rows arrive as class instances from Prisma — flatten Dates for the client. */
export function jsonSafe(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) out[key] = jsonSafe(entry);
    return out;
  }
  return value;
}
