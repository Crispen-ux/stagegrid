// STAGEGRID core domain types.
// These model the future STAGEGRID OS data layer. Mock data implements
// these shapes today; a real API can be swapped in without touching
// consuming components, since components only ever read these types.

export type EventType = "corporate" | "activation" | "conference" | "festival";
export type Environment = "indoor" | "outdoor";
export type Tier = "basic" | "standard" | "premium";

export interface Location {
  id: string;
  label: string; // e.g. "Sandton Convention Centre"
  region: string; // e.g. "Gauteng"
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
}

export type EquipmentCategory =
  | "audio"
  | "subwoofers"
  | "microphones"
  | "mixing"
  | "trussing"
  | "stage"
  | "lighting"
  | "av"
  | "accessories";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  specs: Record<string, string>;
  dailyRate: number; // ZAR
  available: boolean;
  quantityAvailable: number;
  compatiblePackages: string[]; // Package ids
}

export interface Package {
  id: string;
  name: string;
  description: string;
  equipmentIds: string[];
  suitableGuestRange: [number, number];
}

export interface TechnicalRequirement {
  label: string;
  status: "ok" | "warning";
  detail: string;
}

export interface EventConfiguration {
  eventType: EventType;
  guestCount: number;
  environment: Environment;
  eventDate?: string;
  stageRequired: boolean;
  soundTier: Tier;
  trussTier: "none" | "standard" | "heavy";
  stageTier: "platform" | "standard" | "main";
  lightingTier: Tier;
  avTier: Tier;
  logistics: "selfcollect" | "full";
}

export interface RecommendedPackage {
  pa: string;
  truss: string;
  stage: string;
  lighting: string;
  av: string;
  crewCount: number;
  setupHours: number;
  powerRequirementKva: number;
  estimatedTotal: number;
  checks: TechnicalRequirement[];
}

export interface PricingRule {
  id: string;
  label: string;
  multiplier?: number;
  flatAdjustment?: number;
  appliesWhen: (config: EventConfiguration) => boolean;
}

export interface CrewMember {
  id: string;
  name: string;
  role: "lead-technician" | "rigger" | "audio-tech" | "lighting-tech" | "driver" | "general";
}

export interface Vehicle {
  id: string;
  label: string; // e.g. "8-Ton Truck 03"
  status: "warehouse" | "loaded" | "en-route" | "arrived" | "returning";
}

export type AssetStatus =
  | "available"
  | "reserved"
  | "picked"
  | "loaded"
  | "deployed"
  | "returned"
  | "inspection"
  | "maintenance";

export interface Asset {
  id: string;
  equipmentId: string;
  serial: string;
  status: AssetStatus;
}

export interface Quote {
  id: string;
  customerId: string;
  configuration: EventConfiguration;
  recommendedPackage: RecommendedPackage;
  status: "draft" | "sent" | "approved" | "expired";
  createdAt: string;
}

export interface Booking {
  id: string;
  quoteId: string;
  eventName: string;
  status: "confirmed" | "in-progress" | "completed" | "cancelled";
  deliveryWindow: string;
  crew: CrewMember[];
  assets: Asset[];
}

export interface Invoice {
  id: string;
  bookingId: string;
  eventName: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
}

export interface StageEvent {
  id: string;
  name: string;
  type: EventType;
  guestCount: number;
  region: string;
  infrastructure: string[];
  outcome: string;
}
