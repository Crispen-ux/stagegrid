import { upcomingEvents, bookings, invoices, assetMetrics } from "@/data/portal";
import { StatCard } from "./StatCard";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  Confirmed: "ok",
  "In Progress": "accent",
};

export function OverviewTab() {
  const activeBookings = bookings.filter((b) => b.status === "in-progress" || b.status === "confirmed").length;
  const overdueInvoices = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Upcoming Events" value={String(upcomingEvents.length)} />
        <StatCard label="Active Bookings" value={String(activeBookings)} />
        <StatCard label="Asset Utilisation" value={`${assetMetrics.utilisationPct}%`} sub="across full inventory" />
        <StatCard label="Overdue Invoices" value={String(overdueInvoices)} sub={overdueInvoices > 0 ? "needs attention" : "all clear"} />
      </div>

      <h2 className="mb-4 font-display text-lg font-bold">Upcoming Events</h2>
      <div className="flex flex-col gap-3">
        {upcomingEvents.map((e) => (
          <div
            key={e.name}
            className="flex flex-col gap-3 rounded border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-[15px] font-semibold">{e.name}</div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-text-dim">
                <span>{e.assets} assets</span>
                <span>{e.crewCount} crew</span>
                <span>Delivery: {e.delivery}</span>
              </div>
            </div>
            <Badge variant={statusVariant[e.status] ?? "default"} className="w-fit">
              {e.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
