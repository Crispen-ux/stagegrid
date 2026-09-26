import type { Environment, EventConfiguration, EventType, Tier } from "@/types";

const EVENT_TYPES: EventType[] = ["corporate", "activation", "conference", "festival"];
const ENVIRONMENTS: Environment[] = ["indoor", "outdoor"];
const TIERS: Tier[] = ["basic", "standard", "premium"];
const TRUSS_TIERS: EventConfiguration["trussTier"][] = ["none", "standard", "heavy"];
const STAGE_TIERS: EventConfiguration["stageTier"][] = ["platform", "standard", "main"];
const LOGISTICS: EventConfiguration["logistics"][] = ["selfcollect", "full"];

function pick<T extends string>(value: unknown, allowed: T[]): T | null {
  return typeof value === "string" && (allowed as string[]).includes(value) ? (value as T) : null;
}

function dateOrNull(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return value.slice(0, 10);
}

/**
 * Coerces an untrusted payload into a fully valid `EventConfiguration`, so the
 * recommendation shown to the user is recomputed server-side from the same rules.
 */
export function parseConfiguration(value: unknown): {
  config?: EventConfiguration;
  errors?: Record<string, string>;
} {
  const body = (value ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const eventType = pick<EventType>(body.eventType, EVENT_TYPES);
  const environment = pick<Environment>(body.environment, ENVIRONMENTS);
  const soundTier = pick<Tier>(body.soundTier, TIERS);
  const lightingTier = pick<Tier>(body.lightingTier, TIERS);
  const avTier = pick<Tier>(body.avTier, TIERS);
  const trussTier = pick<EventConfiguration["trussTier"]>(body.trussTier, TRUSS_TIERS);
  const stageTier = pick<EventConfiguration["stageTier"]>(body.stageTier, STAGE_TIERS);
  const logistics = pick<EventConfiguration["logistics"]>(body.logistics, LOGISTICS);
  const eventDate = dateOrNull(body.eventDate);

  const guestCount = typeof body.guestCount === "number" ? body.guestCount : Number.NaN;
  if (!eventType) errors.eventType = "Unknown event type.";
  if (!environment) errors.environment = "Unknown environment.";
  if (!soundTier) errors.soundTier = "Unknown sound tier.";
  if (!lightingTier) errors.lightingTier = "Unknown lighting tier.";
  if (!avTier) errors.avTier = "Unknown AV tier.";
  if (!trussTier) errors.trussTier = "Unknown trussing tier.";
  if (!stageTier) errors.stageTier = "Unknown staging tier.";
  if (!logistics) errors.logistics = "Unknown logistics option.";
  if (eventDate === undefined) errors.eventDate = "Event date must be an ISO date.";
  if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > 1_000_000) {
    errors.guestCount = "Guest count must be between 1 and 1,000,000.";
  }
  if (typeof body.stageRequired !== "boolean") errors.stageRequired = "Stage requirement must be true or false.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    config: {
      eventType: eventType as EventType,
      guestCount: Math.round(guestCount),
      environment: environment as Environment,
      eventDate: eventDate ?? undefined,
      stageRequired: body.stageRequired as boolean,
      soundTier: soundTier as Tier,
      trussTier: trussTier as EventConfiguration["trussTier"],
      stageTier: stageTier as EventConfiguration["stageTier"],
      lightingTier: lightingTier as Tier,
      avTier: avTier as Tier,
      logistics: logistics as EventConfiguration["logistics"],
    },
  };
}
