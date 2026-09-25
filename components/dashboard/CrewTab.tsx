import { crew } from "@/data/portal";

const roleLabels: Record<string, string> = {
  "lead-technician": "Lead Technician",
  rigger: "Rigger",
  "audio-tech": "Audio Technician",
  "lighting-tech": "Lighting Technician",
  driver: "Driver",
  general: "General Crew",
};

export function CrewTab() {
  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-bold">Crew</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {crew.map((c) => (
          <div key={c.id} className="flex items-center gap-3.5 rounded border border-border bg-surface p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-dim font-display text-sm font-bold text-accent">
              {c.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="text-[13.5px] font-semibold">{c.name}</div>
              <div className="text-[11.5px] text-text-faint">{roleLabels[c.role]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
