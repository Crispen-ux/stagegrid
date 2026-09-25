// Deterministic, rules-based recommendation engine.
// This is intentionally a pure-function frontend layer using mock rules —
// every function here is designed to be swapped for a real API call later
// without changing any calling component.

import type { EventConfiguration, RecommendedPackage, TechnicalRequirement } from "@/types";

export function calculatePASystem(config: EventConfiguration): string {
  const { guestCount, soundTier } = config;
  if (soundTier === "basic") return "Speech PA (2x point-source)";
  if (soundTier === "premium") return "12x+ Line Array + 12 Subs (multi-zone)";
  if (guestCount < 600) return "4x Line Array + 4 Subs";
  if (guestCount < 1500) return "8x Line Array + 8 Subs";
  return "10x Line Array + 10 Subs";
}

export function calculateTruss(config: EventConfiguration): string {
  if (config.trussTier === "none") return "Not required";
  if (config.trussTier === "heavy") return "Full Roof Structure System";
  return config.guestCount < 600 ? "9m Ground-Supported Rig" : "12m Dual-Tower Rig";
}

export function calculateStage(config: EventConfiguration): string {
  if (!config.stageRequired) return "Not required";
  const map = {
    platform: "4m x 3m Platform",
    standard: "8m x 6m Modular Stage",
    main: "16m x 10m Main Stage + Wings",
  } as const;
  return map[config.stageTier];
}

export function calculateLighting(config: EventConfiguration): string {
  const map = {
    basic: "Basic Wash Package",
    standard: "Stage + Architectural Rig",
    premium: "Full Activation Lighting Design",
  } as const;
  return map[config.lightingTier];
}

export function calculateAV(config: EventConfiguration): string {
  const map = {
    basic: "Single Screen + Switcher",
    standard: "Multi-Screen + Vision Switching",
    premium: "Broadcast-Grade AV Package",
  } as const;
  return map[config.avTier];
}

export function calculateCrewRequirement(config: EventConfiguration): number {
  const { guestCount, trussTier } = config;
  let base = guestCount < 200 ? 4 : guestCount < 600 ? 8 : guestCount < 1500 ? 14 : 20;
  if (trussTier === "heavy") base += 4;
  if (config.logistics === "full") base += 2;
  return base;
}

export function calculateSetupTime(config: EventConfiguration): number {
  const { guestCount } = config;
  return guestCount < 200 ? 3 : guestCount < 600 ? 5 : guestCount < 1500 ? 8 : 12;
}

export function calculatePowerRequirement(config: EventConfiguration): number {
  // Rough indicative kVA estimate — NOT an electrical engineering calculation.
  let kva = 10 + config.guestCount * 0.03;
  if (config.soundTier === "premium") kva += 20;
  if (config.lightingTier === "premium") kva += 25;
  if (config.trussTier === "heavy") kva += 10;
  return Math.round(kva);
}

export function calculateEstimatedPrice(config: EventConfiguration): number {
  const soundMultiplier = { basic: 0.5, standard: 1, premium: 1.8 }[config.soundTier];
  let base = (8000 + config.guestCount * 22) * soundMultiplier;
  if (config.stageRequired) base += 15000 + config.guestCount * 8;
  if (config.trussTier === "heavy") base += 25000;
  if (config.lightingTier === "premium") base += 20000;
  if (config.avTier === "premium") base += 30000;
  if (config.environment === "outdoor") base *= 1.25;
  if (config.logistics === "full") base += 6000;
  return Math.round(base / 500) * 500;
}

export function validateConfiguration(config: EventConfiguration): TechnicalRequirement[] {
  const checks: TechnicalRequirement[] = [
    { label: "Audience coverage", status: "ok", detail: "Estimated coverage within range for guest count." },
    { label: "System capacity", status: "ok", detail: "Estimated PA output sufficient for venue type." },
  ];

  if (config.environment === "outdoor") {
    checks.push({
      label: "Outdoor event",
      status: "warning",
      detail: "Additional weather protection recommended for outdoor deployment.",
    });
  }

  const power = calculatePowerRequirement(config);
  if (power > 60) {
    checks.push({
      label: "Power requirement",
      status: "warning",
      detail: `Estimated ${power} kVA may exceed standard venue supply capacity.`,
    });
  }

  if (config.trussTier === "heavy") {
    checks.push({
      label: "Rigging crew",
      status: "warning",
      detail: "Additional certified rigging crew recommended for this truss tier.",
    });
  }

  return checks;
}

export function calculateRecommendedPackage(config: EventConfiguration): RecommendedPackage {
  return {
    pa: calculatePASystem(config),
    truss: calculateTruss(config),
    stage: calculateStage(config),
    lighting: calculateLighting(config),
    av: calculateAV(config),
    crewCount: calculateCrewRequirement(config),
    setupHours: calculateSetupTime(config),
    powerRequirementKva: calculatePowerRequirement(config),
    estimatedTotal: calculateEstimatedPrice(config),
    checks: validateConfiguration(config),
  };
}

export const defaultConfiguration: EventConfiguration = {
  eventType: "corporate",
  guestCount: 300,
  environment: "indoor",
  stageRequired: true,
  soundTier: "standard",
  trussTier: "standard",
  stageTier: "standard",
  lightingTier: "standard",
  avTier: "basic",
  logistics: "full",
};
