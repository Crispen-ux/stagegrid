import { portalScope } from "@/data/portal";
import type { PortalViewer } from "@/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  confirmed: "ok",
  "in-progress": "accent",
  completed: "default",
  cancelled: "warn",
};

export function EventsTab({ viewer }: { viewer: PortalViewer }) {
  const { bookings } = portalScope(viewer);

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-bold">Active Bookings</h2>
      {bookings.length === 0 ? (
        <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
          No bookings on your account yet — send a quote request and STAGEGRID will load it here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[640px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Delivery</th>
                <th className="px-5 py-3 font-medium">Crew</th>
                <th className="px-5 py-3 font-medium">Booking ID</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 font-medium">{b.eventName}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[b.status]}>{b.status.replace("-", " ")}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-text-dim">{b.deliveryWindow}</td>
                  <td className="px-5 py-3.5 text-text-dim">{b.crew.length}</td>
                  <td className="px-5 py-3.5 text-text-faint">{b.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
