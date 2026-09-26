import { assetLifecycle } from "@/data/portal";
import type { PortalAccountRow, PortalData } from "@/types";
import { StatCard } from "./StatCard";
import { AdminCrud } from "./AdminCrud";

const stageLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  picked: "Picked",
  loaded: "Loaded",
  deployed: "Deployed",
  returned: "Returned",
  inspection: "Inspection",
  maintenance: "Maintenance",
};

interface AssetsTabProps {
  data: PortalData;
  canManage: boolean;
  accounts: PortalAccountRow[];
}

export function AssetsTab({ data, canManage, accounts }: AssetsTabProps) {
  const metrics = data.assetMetrics;
  const summary = data.assetSummary;

  return (
    <div>
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Asset Intelligence</div>
      <h2 className="mb-6 font-display text-lg font-bold">Every asset has a lifecycle.</h2>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Utilisation" value={`${metrics.utilisationPct}%`} />
        <StatCard label="Active Deployments" value={String(metrics.activeDeployments)} />
        <StatCard label="In Maintenance" value={String(metrics.inMaintenance)} />
        <StatCard label="Missing" value={String(metrics.missing)} />
        <StatCard
          label="Avg Revenue / Asset"
          value={`R${metrics.revenuePerAssetAvg.toLocaleString()}`}
          sub="per month"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[900px] items-stretch gap-px rounded border border-border bg-border">
          {assetLifecycle.map((stage) => {
            const count = summary.find((entry) => entry.status === stage)?.count ?? 0;
            return (
              <div key={stage} className="flex-1 bg-bg p-4">
                <div className="text-[11px] uppercase tracking-wide text-text-faint">
                  {stageLabels[stage] ?? stage}
                </div>
                <div className="mt-2 font-display text-xl font-bold">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {canManage ? (
          <AdminCrud
            moduleKey="assets"
            rows={data.assets as unknown as Record<string, unknown>[]}
            accounts={accounts}
            products={data.products}
            heading="Asset register"
            allowCreate
            allowDelete
          />
        ) : (
          <>
            <h3 className="mb-3.5 font-display text-base font-bold">Recent Asset Activity</h3>
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                    <th className="px-5 py-3 font-medium">Serial</th>
                    <th className="px-5 py-3 font-medium">Equipment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-border last:border-b-0">
                      <td className="px-5 py-3.5 font-medium">{asset.serial}</td>
                      <td className="px-5 py-3.5 text-text-dim">{asset.productName}</td>
                      <td className="px-5 py-3.5 text-text-faint">{stageLabels[asset.status] ?? asset.status}</td>
                    </tr>
                  ))}
                  {data.assets.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-4 text-[13px] text-text-faint">
                        No assets recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
