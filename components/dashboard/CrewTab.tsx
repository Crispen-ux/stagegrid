import type { PortalData } from "@/types";
import { AdminCrud } from "./AdminCrud";

const roleLabels: Record<string, string> = {
  "lead-technician": "Lead Technician",
  rigger: "Rigger",
  "audio-tech": "Audio Technician",
  "lighting-tech": "Lighting Technician",
  driver: "Driver",
  general: "General Crew",
};

export function CrewTab({ data, canManage }: { data: PortalData; canManage: boolean }) {
  if (canManage) {
    return <AdminCrud moduleKey="crew" rows={data.crew as unknown as Record<string, unknown>[]} allowCreate allowDelete />;
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-bold">Crew</h2>
      {data.crew.length === 0 ? (
        <p className="rounded border border-dashed border-border bg-surface px-5 py-4 text-[13px] text-text-faint">
          No crew on the roster yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.crew.map((member) => (
            <div key={member.id} className="flex items-center gap-3.5 rounded border border-border bg-surface p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-dim font-display text-sm font-bold text-accent">
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div>
                <div className="text-[13.5px] font-semibold">{member.name}</div>
                <div className="text-[11.5px] text-text-faint">{roleLabels[member.role] ?? member.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
