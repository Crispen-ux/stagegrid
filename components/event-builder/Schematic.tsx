import type { EventConfiguration } from "@/types";

function speakerCountFor(guestCount: number) {
  if (guestCount < 200) return 2;
  if (guestCount < 600) return 4;
  if (guestCount < 1500) return 6;
  return 8;
}

export function Schematic({ config }: { config: EventConfiguration }) {
  const speakers = speakerCountFor(config.guestCount);
  const spacing = 360 / speakers;

  return (
    <svg viewBox="0 0 400 190" className="h-[190px] w-full rounded border border-border bg-bg">
      <rect x="20" y="110" width="360" height="65" fill="none" stroke="#26282c" strokeDasharray="3,3" />
      <text x="30" y="105" fill="#5c5e62" fontSize="9">
        AUDIENCE ZONE
      </text>

      {config.stageRequired && (
        <>
          <rect x="140" y="28" width="120" height="38" fill="#1a1c1f" stroke="#e8622c" strokeWidth={1.5} />
          <text x="200" y="51" fill="#e8622c" fontSize="9" textAnchor="middle">
            STAGE
          </text>
        </>
      )}

      {config.trussTier !== "none" && (
        <>
          <line x1="120" y1="18" x2="280" y2="18" stroke="#e8622c" strokeWidth={2} />
          <line x1="120" y1="18" x2="120" y2="28" stroke="#e8622c" strokeWidth={2} />
          <line x1="280" y1="18" x2="280" y2="28" stroke="#e8622c" strokeWidth={2} />
        </>
      )}

      {Array.from({ length: speakers }).map((_, i) => {
        const x = 20 + spacing * i + spacing / 2;
        return <rect key={i} x={x - 5} y="80" width="10" height="16" fill="#3fae6b" opacity={0.85} />;
      })}
      <text x="30" y="75" fill="#5c5e62" fontSize="9">
        PA / SUBS
      </text>

      {config.environment === "outdoor" && (
        <text x="370" y="16" fill="#d9a441" fontSize="9" textAnchor="end">
          OUTDOOR
        </text>
      )}
    </svg>
  );
}
