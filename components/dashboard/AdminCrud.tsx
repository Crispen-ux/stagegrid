"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_MODULES, type AdminField, type AdminModule } from "@/lib/admin-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { PortalAccountRow, PortalProductRow } from "@/types";

type Row = Record<string, unknown>;

export interface AdminCrudProps {
  moduleKey: string;
  rows: Row[];
  accounts?: PortalAccountRow[];
  products?: PortalProductRow[];
  /** Heading rendered above the table; defaults to the module label. */
  heading?: string;
  /** Clients and staff never see management controls. */
  allowCreate?: boolean;
  allowDelete?: boolean;
}

const badgeVariant = (value: string): BadgeProps["variant"] => {
  if (["paid", "approved", "confirmed", "active", "available", "completed", "handled"].includes(value)) return "ok";
  if (["overdue", "pending", "suspended", "cancelled", "expired", "maintenance", "inspection"].includes(value)) {
    return "warn";
  }
  if (["sent", "in-progress", "new", "loaded", "en-route", "deployed", "staff", "admin", "live"].includes(value)) {
    return "accent";
  }
  return "default";
};

const str = (value: unknown): string => (value === null || value === undefined ? "" : String(value));

const dateFmt = (value: unknown): string => {
  if (!value) return "—";
  const date = new Date(str(value));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
};

function initialValues(moduleDef: AdminModule): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = {};
  for (const field of moduleDef.fields) {
    values[field.name] = field.type === "toggle" ? false : "";
    if (field.type === "select" && field.options?.[0] && field.required) {
      values[field.name] = field.options[0].value;
    }
  }
  return values;
}

function valuesFromRow(moduleDef: AdminModule, row: Row): Record<string, string | boolean> {
  const values = initialValues(moduleDef);
  for (const field of moduleDef.fields) {
    const raw = row[field.name];
    if (field.type === "toggle") {
      values[field.name] = raw === true;
    } else if (field.type === "date") {
      values[field.name] = typeof raw === "string" ? raw.slice(0, 10) : "";
    } else if (raw === null || raw === undefined) {
      values[field.name] = "";
    } else {
      values[field.name] = str(raw);
    }
  }
  return values;
}

function payload(moduleDef: AdminModule, values: Record<string, string | boolean>): Row {
  const out: Row = {};
  for (const field of moduleDef.fields) {
    const value = values[field.name];
    if (field.type === "toggle") out[field.name] = value === true;
    else if (field.type === "number") out[field.name] = value === "" ? "" : Number(value);
    else out[field.name] = str(value);
  }
  return out;
}

function cellValue(row: Row, name: string): unknown {
  return row[name];
}

export function AdminCrud({
  moduleKey,
  rows,
  accounts = [],
  products = [],
  heading,
  allowCreate = true,
  allowDelete = true,
}: AdminCrudProps) {
  const moduleDef = ADMIN_MODULES[moduleKey];
  const router = useRouter();
  const [mode, setMode] = useState<"closed" | "create" | "edit">("closed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (!moduleDef) return null;

  const startCreate = () => {
    setValues(initialValues(moduleDef));
    setErrors({});
    setNotice(null);
    setEditingId(null);
    setMode("create");
  };

  const startEdit = (row: Row) => {
    setValues(valuesFromRow(moduleDef, row));
    setErrors({});
    setNotice(null);
    setEditingId(str(row.id));
    setMode("edit");
  };

  const cancel = () => {
    setMode("closed");
    setErrors({});
    setNotice(null);
    setEditingId(null);
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setNotice(null);
    const body = JSON.stringify(payload(moduleDef, values));
    const url = mode === "create" ? `/api/admin/${moduleKey}` : `/api/admin/${moduleKey}/${editingId}`;
    try {
      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrors(data.errors ?? {});
        setNotice(data.error ?? "We could not save that just now.");
        return;
      }
      cancel();
      router.refresh();
    } catch {
      setNotice("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Row) {
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/${moduleKey}/${str(row.id)}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setNotice(data.error ?? "We could not delete that just now.");
        return;
      }
      setConfirmingId(null);
      router.refresh();
    } catch {
      setNotice("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  function optionsFor(field: AdminField): { value: string; label: string }[] {
    if (field.optionsSource === "accounts") {
      return accounts.map((account) => ({ value: account.id, label: `${account.name} — ${account.email}` }));
    }
    if (field.optionsSource === "products") {
      return products.map((product) => ({ value: product.id, label: `${product.id} — ${product.name}` }));
    }
    return field.options ?? [];
  }

  const renderCell = (row: Row, column: (typeof moduleDef.columns)[number]) => {
    const raw = cellValue(row, column.name);
    switch (column.render) {
      case "money":
        return `R${Number(raw ?? 0).toLocaleString("en-ZA")}`;
      case "date":
        return dateFmt(raw);
      case "bool":
        return raw === true ? "Yes" : "No";
      case "truncate":
        return <span className="block max-w-[340px] truncate">{str(raw)}</span>;
      case "client": {
        const account = accounts.find((candidate) => candidate.id === str(raw));
        if (account) return account.name;
        return <span className="text-text-faint">{str(raw) || "—"}</span>;
      }
      case "badge":
        return <Badge variant={badgeVariant(str(raw))}>{str(raw) || "—"}</Badge>;
      default:
        return raw === null || raw === undefined || raw === "" ? <span className="text-text-faint">—</span> : str(raw);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">{heading ?? moduleDef.label}</h2>
          <p className="mt-0.5 text-[12.5px] text-text-faint">{moduleDef.description}</p>
        </div>
        {allowCreate && moduleDef.creatable !== false && (
          <Button size="sm" onClick={mode === "closed" ? startCreate : cancel} disabled={busy}>
            {mode === "closed" ? `Add ${moduleDef.singular.toLowerCase()}` : "Close form"}
          </Button>
        )}
      </div>

      {notice && <p className="mb-3 text-[12.5px] text-warn">{notice}</p>}

      {mode !== "closed" && (
        <form onSubmit={submit} className="mb-6 rounded border border-accent/40 bg-surface p-5">
          <div className="mb-4 font-display text-[15px] font-bold">
            {mode === "create" ? `New ${moduleDef.singular.toLowerCase()}` : `Edit ${moduleDef.singular.toLowerCase()}`}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {moduleDef.fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-text-faint">
                  {field.label}
                  {field.required && <span className="text-accent"> *</span>}
                </label>

                {field.type === "select" || field.type === "ref" ? (
                  <select
                    value={str(values[field.name])}
                    onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                    className={`w-full rounded border bg-bg px-3 py-2.5 text-sm text-text outline-none transition-colors ${
                      errors[field.name] ? "border-warn" : "border-border focus:border-accent"
                    }`}
                  >
                    {field.type === "ref" && !field.required && <option value="">Unassigned</option>}
                    {field.placeholder && <option value="">{field.placeholder}</option>}
                    {optionsFor(field).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={str(values[field.name])}
                    onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                    className={`w-full rounded border bg-bg px-3 py-2.5 text-sm text-text outline-none transition-colors ${
                      errors[field.name] ? "border-warn" : "border-border focus:border-accent"
                    }`}
                  />
                ) : field.type === "toggle" ? (
                  <label className="flex items-center gap-2 py-1.5 text-[13.5px] text-text-dim">
                    <input
                      type="checkbox"
                      checked={values[field.name] === true}
                      onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.checked }))}
                      className="h-4 w-4 accent-accent"
                    />
                    Yes
                  </label>
                ) : (
                  <Input
                    type={field.type === "email" ? "email" : field.type === "password" ? "password" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={str(values[field.name])}
                    min={field.type === "number" ? field.min : undefined}
                    placeholder={field.placeholder}
                    invalid={!!errors[field.name]}
                    autoComplete={field.type === "password" ? "new-password" : undefined}
                    onChange={(e) => setValues((current) => ({ ...current, [field.name]: e.target.value }))}
                  />
                )}

                {errors[field.name] && <p className="mt-1.5 text-[12px] text-warn">{errors[field.name]}</p>}
                {field.help && !errors[field.name] && (
                  <p className="mt-1.5 text-[11.5px] text-text-faint">{field.help}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={cancel} disabled={busy}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {rows.length === 0 ? (
        <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
          Nothing here yet{allowCreate && moduleDef.creatable !== false ? " — use the button above to add the first one." : "."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                {moduleDef.columns.map((column) => (
                  <th key={column.name} className="px-5 py-3 font-medium">
                    {column.label}
                  </th>
                ))}
                {(allowCreate || allowDelete) && <th className="px-5 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={str(row.id)} className="border-b border-border last:border-b-0">
                  {moduleDef.columns.map((column) => (
                    <td key={column.name} className="px-5 py-3.5">
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {(allowCreate || allowDelete) && (
                    <td className="px-5 py-3.5">
                      {confirmingId === str(row.id) ? (
                        <span className="flex items-center gap-2 text-[12.5px]">
                          <span className="text-text-dim">Delete?</span>
                          <Button size="sm" variant="outline" disabled={busy} onClick={() => remove(row)}>
                            {busy ? "…" : "Yes"}
                          </Button>
                          <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirmingId(null)}>
                            No
                          </Button>
                        </span>
                      ) : (
                        <span className="flex gap-3 text-[12.5px]">
                          {allowCreate && moduleDef.creatable !== false && (
                            <button
                              type="button"
                              className="text-accent underline-offset-4 hover:underline"
                              onClick={() => startEdit(row)}
                              disabled={busy}
                            >
                              Edit
                            </button>
                          )}
                          {allowDelete && (
                            <button
                              type="button"
                              className="text-text-faint underline-offset-4 hover:text-warn hover:underline"
                              onClick={() => setConfirmingId(str(row.id))}
                              disabled={busy}
                            >
                              Delete
                            </button>
                          )}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
