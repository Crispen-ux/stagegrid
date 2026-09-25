import Link from "next/link";

const columns = [
  { title: "Company", links: [["Solutions", "/solutions"], ["Projects", "/projects"], ["About", "/about"], ["Contact", "/contact"]] },
  { title: "Platform", links: [["Event Builder", "/event-builder"], ["Equipment", "/equipment"], ["Portal", "/portal"], ["Dynamic Pricing", "/pricing"]] },
  { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Rental Terms", "/rental-terms"], ["Safety", "/safety"]] },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-wrap justify-between gap-10">
          <div>
            <div className="font-display text-lg font-bold">
              STAGE<span className="text-accent">GRID</span>
            </div>
            <p className="mt-2.5 max-w-[220px] text-[13px] text-text-dim">
              Event Infrastructure & Production
              <br />
              South Africa
            </p>
          </div>
          <div className="flex flex-wrap gap-14">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3.5 text-[12px] uppercase tracking-wide text-text-faint">{col.title}</h4>
                {col.links.map(([label, href]) => (
                  <Link key={href} href={href} className="mb-2.5 block text-[13px] text-text-dim hover:text-text">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-2.5 border-t border-border pt-5 text-[12px] text-text-faint">
          <span>© {new Date().getFullYear()} STAGEGRID. All rights reserved.</span>
          <span>Engineering the infrastructure behind exceptional events.</span>
        </div>
      </div>
    </footer>
  );
}
