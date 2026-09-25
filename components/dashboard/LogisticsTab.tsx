import { logisticsStages, activeDelivery, vehicles } from "@/data/portal";

export function LogisticsTab() {
  const stageIndex = logisticsStages.indexOf(activeDelivery.currentStage);

  return (
    <div>
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Live Logistics</div>
      <h2 className="mb-6 font-display text-lg font-bold">Know where your event infrastructure is.</h2>

      <div className="rounded border border-border bg-surface p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[15px] font-semibold">{activeDelivery.eventName}</div>
            <div className="mt-1 text-[12.5px] text-text-dim">
              {activeDelivery.truck} · Driver {activeDelivery.driver} · Lead Tech {activeDelivery.leadTechnician}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wide text-text-faint">ETA</div>
            <div className="font-display text-xl font-bold text-accent">{activeDelivery.eta}</div>
          </div>
        </div>

        <div className="mb-5 rounded border border-border bg-bg px-4 py-3 text-[13px] text-text-dim">
          📍 {activeDelivery.currentLocation}
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-[720px] items-center">
            {logisticsStages.map((stage, i) => (
              <div key={stage} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold ${
                      i < stageIndex
                        ? "border-ok bg-ok/10 text-ok"
                        : i === stageIndex
                        ? "border-accent bg-accent-dim text-accent"
                        : "border-border text-text-faint"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-[10.5px] ${i === stageIndex ? "font-semibold text-text" : "text-text-faint"}`}>
                    {stage}
                  </span>
                </div>
                {i < logisticsStages.length - 1 && (
                  <div className={`mx-1.5 h-px flex-1 ${i < stageIndex ? "bg-ok" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="mb-3.5 mt-8 font-display text-base font-bold">Fleet Status</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {vehicles.map((v) => (
          <div key={v.id} className="rounded border border-border bg-surface p-4">
            <div className="text-[13.5px] font-semibold">{v.label}</div>
            <div className="mt-1.5 text-[11px] uppercase tracking-wide text-text-faint">{v.status.replace("-", " ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
