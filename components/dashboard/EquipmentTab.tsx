import Link from "next/link";
import { categories, categoryLabels } from "@/data/equipment";
import type { PortalAccountRow, PortalData } from "@/types";
import { AdminCrud } from "./AdminCrud";

interface EquipmentTabProps {
  data: PortalData;
  canManage: boolean;
  accounts: PortalAccountRow[];
}

export function EquipmentTab({ data, canManage, accounts }: EquipmentTabProps) {
  const products = data.products;
  const counts = categories.map((category) => ({
    category,
    count: products.filter((item) => item.category === category).length,
    available: products.filter((item) => item.category === category && item.available).length,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Equipment Overview</h2>
          <Link href="/equipment" className="text-xs font-semibold text-accent hover:underline">
            Open full catalog →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {counts.map((entry) => (
            <div key={entry.category} className="rounded border border-border bg-surface p-5">
              <div className="text-[11px] uppercase tracking-wide text-text-faint">
                {categoryLabels[entry.category]}
              </div>
              <div className="mt-2 font-display text-xl font-bold">{entry.count} SKUs</div>
              <div className="mt-1 text-[11.5px] text-text-faint">{entry.available} currently available</div>
            </div>
          ))}
        </div>
      </div>

      {canManage ? (
        <AdminCrud
          moduleKey="products"
          rows={products.map((product) => ({ ...product, id: product.rowId }))}
          accounts={accounts}
          heading="Manage products"
          allowCreate
          allowDelete
        />
      ) : (
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Day rate</th>
                <th className="px-5 py-3 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map((product) => (
                <tr key={product.rowId} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 font-medium">{product.id}</td>
                  <td className="px-5 py-3.5 text-text-dim">{product.name}</td>
                  <td className="px-5 py-3.5 text-text-faint">{categoryLabels[product.category]}</td>
                  <td className="px-5 py-3.5 text-text-dim">R{product.dailyRate.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-text-faint">{product.quantityAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-5 py-3 text-[12.5px] text-text-faint">Showing 8 of {products.length} items.</p>
        </div>
      )}
    </div>
  );
}
