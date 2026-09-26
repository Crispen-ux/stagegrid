import { assetMetrics as mockAssetMetrics } from "@/data/portal";
import type { PortalData, PortalViewer } from "@/types";
import { StatCard } from "./StatCard";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  Confirmed: "ok",
  "In Progress": "accent",
};

export function OverviewTab({ viewer, data }: { viewer: PortalViewer; data: PortalData }) {
  const { upcomingEvents, invoices, quotes, assetMetrics } = data;
  const activeCount = upcomingEvents.filter((event) => event.status !== "Completed").length;
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue").length;
  const isInternal = viewer.role !== "client";

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Upcoming Events" value={String(upcomingEvents.length)} />
        <StatCard label="Active Bookings" value={String(activeCount)} />
        {isInternal ? (
          <StatCard
            label="Asset Utilisation"
            value={`${assetMetrics?.utilisationPct ?? mockAssetMetrics.utilisationPct}%`}
            sub="across full inventory"
          />
        ) : (
          <StatCard label="Quotes" value={String(quotes.length)} sub="on your account" />
        )}
        <StatCard
          label="Overdue Invoices"
          value={String(overdueInvoices)}
          sub={overdueInvoices > 0 ? "needs attention" : "all clear"}
        />
      </div>

      <h2 className="mb-4 font-display text-lg font-bold">Upcoming Events</h2>
      <div className="flex flex-col gap-3">
        {upcomingEvents.length === 0 && (
          <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
            No upcoming events on your account yet.
          </p>
        )}
        {upcomingEvents.map((event) => (
          <div
            key={event.name}
            className="flex flex-col gap-3 rounded border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold">{event.name}</div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-text-dim">
                <span>{event.assets} assets</span>
                <span>{event.crewCount} crew</span>
                <span>Delivery: {event.delivery}</span>
              </div>
            </div>
            <Badge variant={statusVariant[event.status] ?? "default"} className="w-fit">
              {event.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
