"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const tags = ["Corporate", "Brand Activations", "Conferences", "Product Launches", "Live Events", "Festivals"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function HeroAnimatedContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="relative mx-auto max-w-[1200px] px-6">
      <motion.div variants={item} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Event Infrastructure & Production · South Africa
      </motion.div>
      <motion.h1 variants={item} className="max-w-[820px] font-display text-[clamp(40px,7vw,76px)] font-bold leading-[1.02] tracking-[-1.5px]">
        We engineer the infrastructure behind exceptional events.
      </motion.h1>
      <motion.p variants={item} className="mt-5 max-w-[520px] text-lg leading-relaxed text-text-dim">
        Sound, trussing, staging, lighting, AV and logistics — configured as one system, deployed by one crew,
        tracked in one platform.
      </motion.p>
      <motion.div variants={item} className="mt-9 flex flex-wrap gap-3.5">
        <Button asChild size="lg">
          <Link href="/event-builder">Build Your Event</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/solutions">Explore Solutions</Link>
        </Button>
      </motion.div>
      <motion.div variants={item} className="mt-14 flex flex-wrap gap-2.5 text-xs text-text-faint">
        {tags.map((t) => (
          <span key={t} className="rounded border border-border px-3 py-1.5">
            {t}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
