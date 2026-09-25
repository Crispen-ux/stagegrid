import Image from "next/image";
import { photoUrl } from "@/lib/photos";
import { HeroAnimatedContent } from "./HeroAnimatedContent";

export function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-border py-24">
      <Image
        src={photoUrl("stagegrid-hero-rig", 1600, 900)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/80 to-bg" />
      <div className="grid-bg absolute inset-0" />
      <HeroAnimatedContent />
    </header>
  );
}
