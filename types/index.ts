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
  clientEmail?: string;
}

export interface Booking {
  id: string;
  quoteId: string;
  eventName: string;
  status: "confirmed" | "in-progress" | "completed" | "cancelled";
  deliveryWindow: string;
  crew: CrewMember[];
  assets: Asset[];
  clientEmail?: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  eventName: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  clientEmail?: string;
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

/** Whoever is signed into the portal â€” a STAGEGRID admin or one client account. */
export interface PortalViewer {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  role: PortalRole;
}

/** Rows shown in the portal Requests tab â€” one shape regardless of which table they came from. */
export interface PortalContactMessage {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message: string;
  handled: boolean;
  created: string;
}

export interface PortalQuoteRequest {
  id: string;
  reference: string;
  eventType: string;
  guestCount: number;
  eventDate?: string | null;
  venue?: string | null;
  name: string;
  email: string;
  notes?: string | null;
  status: string;
  created: string;
}

export interface PortalBuilderQuote {
  id: string;
  reference: string;
  estimateTotal: number;
  status: string;
  created: string;
}

export interface PortalBuilderConfig {
  id: string;
  reference: string;
  label?: string | null;
  created: string;
  updated: string;
}

export interface PortalAccountRequest {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  created: string;
}

export interface PortalRequests {
  contactMessages: PortalContactMessage[];
  quoteRequests: PortalQuoteRequest[];
  builderQuotes: PortalBuilderQuote[];
  builderConfigs: PortalBuilderConfig[];
  accountRequests: PortalAccountRequest[];
}

// ---- Portal rows (admin-managed modules, DB-backed with a mock fallback) -----

export type PortalRole = "admin" | "staff" | "client";

export interface PortalBookingRow {
  id: string;
  reference: string;
  eventName: string;
  status: string;
  deliveryWindow: string;
  crewCount: number;
  clientId?: string | null;
}

export interface PortalQuoteRow {
  id: string;
  reference: string;
  status: string;
  estimateTotal: number;
  createdAt: string;
  clientId?: string | null;
}

export interface PortalInvoiceRow {
  id: string;
  reference: string;
  eventName: string;
  status: string;
  amount: number;
  dueDate: string;
  clientId?: string | null;
}

export interface PortalUpcomingRow {
  name: string;
  status: string;
  assets: number;
  crewCount: number;
  delivery: string;
  clientId?: string | null;
}

export interface PortalCrewRow {
  id: string;
  name: string;
  role: string;
  phone?: string | null;
  active: boolean;
}

export interface PortalVehicleRow {
  id: string;
  label: string;
  status: string;
  driver?: string | null;
}

export interface PortalAssetRow {
  id: string;
  serial: string;
  equipmentId: string;
  productName: string;
  status: string;
  bookingRef?: string | null;
}

export interface PortalDeliveryRow {
  id: string;
  eventName: string;
  truck: string;
  driver: string;
  leadTechnician: string;
  currentLocation: string;
  eta: string;
  currentStage: string;
  active: boolean;
  clientId?: string | null;
}

export interface PortalAssetStat {
  status: string;
  count: number;
}

export interface PortalAssetMetrics {
  utilisationPct: number;
  activeDeployments: number;
  inMaintenance: number;
  missing: number;
  revenuePerAssetAvg: number;
}

/** Everything the dashboard tabs render. Built server-side, mocked without a database. */
export interface PortalData {
  bookings: PortalBookingRow[];
  quotes: PortalQuoteRow[];
  invoices: PortalInvoiceRow[];
  upcomingEvents: PortalUpcomingRow[];
  activeDelivery: PortalDeliveryRow | null;
  deliveries: PortalDeliveryRow[];
  crew: PortalCrewRow[];
  vehicles: PortalVehicleRow[];
  assets: PortalAssetRow[];
  products: PortalProductRow[];
  assetSummary: PortalAssetStat[];
  assetMetrics: PortalAssetMetrics;
  source: "database" | "mock";
}

/** Account rows passed to the admin UI (clients & staff management + client pickers). */
export interface PortalAccountRow {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  role: PortalRole;
  status: "active" | "pending" | "suspended";
  created: string;
}

/** Catalogue row as the portal sees it: sku-in-id plus the database row id for CRUD. */
export interface PortalProductRow extends Equipment {
  rowId: string;
}
