export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export function LegalLayout({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-20">
      <div className="mb-3.5 text-xs font-semibold uppercase tracking-[2px] text-accent">Legal</div>
      <h1 className="font-display text-[clamp(28px,4.5vw,44px)] font-bold leading-[1.1] tracking-tight">
        {title}
      </h1>
      <p className="mt-3 text-[12.5px] text-text-faint">Last updated: {updated}</p>
      <p className="mt-6 text-base leading-relaxed text-text-dim">{intro}</p>

      <div className="mt-12 flex flex-col gap-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-3 text-lg font-semibold">{s.heading}</h2>
            <div className="flex flex-col gap-3">
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-text-dim">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
