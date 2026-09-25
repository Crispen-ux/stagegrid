import { assetLifecycle, assetSummary, assetMetrics, sampleAssets } from "@/data/portal";
import { equipment } from "@/data/equipment";
import { StatCard } from "./StatCard";

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

export function AssetsTab() {
  return (
    <div>
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Asset Intelligence</div>
      <h2 className="mb-6 font-display text-lg font-bold">Every asset has a lifecycle.</h2>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Utilisation" value={`${assetMetrics.utilisationPct}%`} />
        <StatCard label="Active Deployments" value={String(assetMetrics.activeDeployments)} />
        <StatCard label="In Maintenance" value={String(assetMetrics.inMaintenance)} />
        <StatCard label="Missing" value={String(assetMetrics.missing)} />
        <StatCard label="Avg Revenue / Asset" value={`R${assetMetrics.revenuePerAssetAvg.toLocaleString()}`} sub="per month" />
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[900px] items-stretch gap-px rounded border border-border bg-border">
          {assetLifecycle.map((stage) => {
            const count = assetSummary.find((s) => s.status === stage)?.count ?? 0;
            return (
              <div key={stage} className="flex-1 bg-bg p-4">
                <div className="text-[11px] uppercase tracking-wide text-text-faint">{stageLabels[stage]}</div>
                <div className="mt-2 font-display text-xl font-bold">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="mb-3.5 mt-8 font-display text-base font-bold">Recent Asset Activity</h3>
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
            {sampleAssets.map((a) => {
              const item = equipment.find((e) => e.id === a.equipmentId);
              return (
                <tr key={a.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 font-medium">{a.serial}</td>
                  <td className="px-5 py-3.5 text-text-dim">{item?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-text-faint">{stageLabels[a.status]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
