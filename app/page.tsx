import { Hero } from "@/components/marketing/Hero";
import { TrustStrip, SolutionsGrid } from "@/components/marketing/TrustAndSolutions";
import { BuilderPreview } from "@/components/event-builder/BuilderPreview";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <BuilderPreview />
      <SolutionsGrid />
    </main>
  );
}
