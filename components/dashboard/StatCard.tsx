export function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded border border-border bg-surface p-5">
      <div className="text-[11px] uppercase tracking-wide text-text-faint">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
      {sub && <div className="mt-1 text-[11.5px] text-text-faint">{sub}</div>}
    </div>
  );
}
