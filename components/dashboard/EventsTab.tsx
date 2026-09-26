import type { PortalAccountRow, PortalData, PortalViewer } from "@/types";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { AdminCrud } from "./AdminCrud";

const statusVariant: Record<string, BadgeProps["variant"]> = {
  confirmed: "ok",
  "in-progress": "accent",
  completed: "default",
  cancelled: "warn",
};

interface EventsTabProps {
  viewer: PortalViewer;
  data: PortalData;
  canManage: boolean;
  accounts: PortalAccountRow[];
}

export function EventsTab({ viewer, data, canManage, accounts }: EventsTabProps) {
  const bookings = data.bookings;

  if (canManage) {
    return (
      <AdminCrud
        moduleKey="bookings"
        rows={bookings as unknown as Record<string, unknown>[]}
        accounts={accounts}
        heading="Active bookings"
        allowCreate
        allowDelete
      />
    );
  }

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
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3.5 font-medium">{booking.eventName}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[booking.status]}>{booking.status.replace("-", " ")}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-text-dim">{booking.deliveryWindow}</td>
                  <td className="px-5 py-3.5 text-text-dim">{booking.crewCount}</td>
                  <td className="px-5 py-3.5 text-text-faint">{booking.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {viewer.role === "client" && (
        <p className="mt-4 text-[12.5px] text-text-faint">Bookings shown are the ones on your account.</p>
      )}
    </div>
  );
}
