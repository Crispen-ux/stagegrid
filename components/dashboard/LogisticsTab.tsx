import { logisticsStages } from "@/data/portal";
import type { PortalAccountRow, PortalData, PortalViewer } from "@/types";
import { AdminCrud } from "./AdminCrud";

interface LogisticsTabProps {
  viewer: PortalViewer;
  data: PortalData;
  canManage: boolean;
  accounts: PortalAccountRow[];
}

export function LogisticsTab({ viewer, data, canManage, accounts }: LogisticsTabProps) {
  const delivery = data.activeDelivery;
  const isInternal = viewer.role !== "client";

  const livePanel = delivery ? (
    <div className="rounded border border-border bg-surface p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[15px] font-semibold">{delivery.eventName}</div>
          <div className="mt-1 text-[12.5px] text-text-dim">
            {delivery.truck} · Driver {delivery.driver} · Lead Tech {delivery.leadTechnician}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wide text-text-faint">ETA</div>
          <div className="font-display text-xl font-bold text-accent">{delivery.eta}</div>
        </div>
      </div>

      <div className="mb-5 rounded border border-border bg-bg px-4 py-3 text-[13px] text-text-dim">
        ● {delivery.currentLocation}
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[720px] items-center">
          {logisticsStages.map((stage, index) => {
            const stageIndex = logisticsStages.indexOf(delivery.currentStage as (typeof logisticsStages)[number]);
            return (
              <div key={stage} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold ${
                      index < stageIndex
                        ? "border-ok bg-ok/10 text-ok"
                        : index === stageIndex
                        ? "border-accent bg-accent-dim text-accent"
                        : "border-border text-text-faint"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-[10.5px] ${index === stageIndex ? "font-semibold text-text" : "text-text-faint"}`}
                  >
                    {stage}
                  </span>
                </div>
                {index < logisticsStages.length - 1 && (
                  <div className={`mx-1.5 h-px flex-1 ${index < stageIndex ? "bg-ok" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
      Nothing is on the road for your events right now. STAGEGRID tracks every truck, driver and lead technician
      from load-out to strike.
    </p>
  );

  if (canManage) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Live Logistics</div>
          <h2 className="mb-6 font-display text-lg font-bold">Know where your event infrastructure is.</h2>
          {livePanel}
        </div>
        <AdminCrud
          moduleKey="deliveries"
          rows={data.deliveries as unknown as Record<string, unknown>[]}
          accounts={accounts}
          heading="Deliveries"
          allowCreate
          allowDelete
        />
        <AdminCrud
          moduleKey="vehicles"
          rows={data.vehicles as unknown as Record<string, unknown>[]}
          heading="Fleet"
          allowCreate
          allowDelete
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Live Logistics</div>
      <h2 className="mb-6 font-display text-lg font-bold">Know where your event infrastructure is.</h2>
      {livePanel}

      {isInternal && (
        <>
          <h3 className="mb-3.5 mt-8 font-display text-base font-bold">Fleet Status</h3>
          {data.vehicles.length === 0 ? (
            <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
              No vehicles on the fleet list.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {data.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="rounded border border-border bg-surface p-4">
                  <div className="text-[13.5px] font-semibold">{vehicle.label}</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-wide text-text-faint">
                    {vehicle.status.replace("-", " ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
