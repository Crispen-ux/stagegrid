import type { Booking, Quote, Invoice, CrewMember, Vehicle, Asset, AssetStatus, PortalViewer } from "@/types";
import { defaultConfiguration, calculateRecommendedPackage } from "@/lib/calculations";

export const crew: CrewMember[] = [
  { id: "cr-01", name: "Themba Nkosi", role: "lead-technician" },
  { id: "cr-02", name: "Sarah van der Merwe", role: "audio-tech" },
  { id: "cr-03", name: "Lindiwe Dlamini", role: "lighting-tech" },
  { id: "cr-04", name: "Johan Botha", role: "rigger" },
  { id: "cr-05", name: "Kabelo Molefe", role: "rigger" },
  { id: "cr-06", name: "Pieter Steyn", role: "driver" },
  { id: "cr-07", name: "Ayanda Zulu", role: "general" },
];

export const vehicles: Vehicle[] = [
  { id: "veh-01", label: "8-Ton Truck 03", status: "en-route" },
  { id: "veh-02", label: "4-Ton Truck 01", status: "warehouse" },
  { id: "veh-03", label: "Flatbed 02", status: "returning" },
];

const samplePackage = calculateRecommendedPackage(defaultConfiguration);

export const ACME_EMAIL = "kim@acme.co.za";
export const NORTHWIND_EMAIL = "sana@northwind.co.za";

export const bookings: Booking[] = [
  {
    id: "bk-1001",
    quoteId: "qt-4501",
    eventName: "Corporate Product Launch",
    status: "confirmed",
    deliveryWindow: "Tomorrow · 07:30",
    crew: crew.slice(0, 5),
    assets: [],
    clientEmail: ACME_EMAIL,
  },
  {
    id: "bk-1002",
    quoteId: "qt-4502",
    eventName: "Outdoor Brand Activation",
    status: "in-progress",
    deliveryWindow: "Today · 05:00",
    crew: crew.slice(2, 7),
    assets: [],
    clientEmail: ACME_EMAIL,
  },
  {
    id: "bk-1003",
    quoteId: "qt-4503",
    eventName: "Corporate Conference — Day 2",
    status: "confirmed",
    deliveryWindow: "Fri · 06:00",
    crew: crew.slice(0, 3),
    assets: [],
    clientEmail: NORTHWIND_EMAIL,
  },
];

export const quotes: Quote[] = [
  { id: "qt-4501", customerId: "cus-01", configuration: defaultConfiguration, recommendedPackage: samplePackage, status: "approved", createdAt: "2026-09-18", clientEmail: ACME_EMAIL },
  { id: "qt-4502", customerId: "cus-02", configuration: defaultConfiguration, recommendedPackage: samplePackage, status: "approved", createdAt: "2026-09-15", clientEmail: ACME_EMAIL },
  { id: "qt-4504", customerId: "cus-03", configuration: defaultConfiguration, recommendedPackage: samplePackage, status: "sent", createdAt: "2026-09-22", clientEmail: NORTHWIND_EMAIL },
  { id: "qt-4505", customerId: "cus-04", configuration: defaultConfiguration, recommendedPackage: samplePackage, status: "draft", createdAt: "2026-09-24", clientEmail: NORTHWIND_EMAIL },
];

export const invoices: Invoice[] = [
  { id: "inv-9001", bookingId: "bk-1001", eventName: "Corporate Product Launch", amount: 84500, status: "sent", dueDate: "2026-10-02", clientEmail: ACME_EMAIL },
  { id: "inv-9002", bookingId: "bk-1002", eventName: "Outdoor Brand Activation", amount: 156200, status: "paid", dueDate: "2026-09-20", clientEmail: ACME_EMAIL },
  { id: "inv-8994", bookingId: "bk-1003", eventName: "Corporate Conference — Day 1", amount: 61300, status: "overdue", dueDate: "2026-09-19", clientEmail: NORTHWIND_EMAIL },
];

export const upcomingEvents = [
  { name: "Corporate Product Launch", status: "Confirmed", assets: 32, crewCount: 5, delivery: "Tomorrow 07:30", clientEmail: ACME_EMAIL },
  { name: "Outdoor Brand Activation", status: "In Progress", assets: 58, crewCount: 8, delivery: "Today 05:00", clientEmail: ACME_EMAIL },
  { name: "Corporate Conference — Day 2", status: "Confirmed", assets: 21, crewCount: 3, delivery: "Fri 06:00", clientEmail: NORTHWIND_EMAIL },
];

export const logisticsStages = [
  "Warehouse",
  "Loaded",
  "En Route",
  "Arrived",
  "Setup",
  "Live",
  "Strike",
  "Returning",
] as const;

export const activeDelivery = {
  eventName: "Outdoor Brand Activation",
  truck: "8-Ton Truck 03",
  driver: "Pieter Steyn",
  leadTechnician: "Themba Nkosi",
  currentLocation: "N1 North, approaching Midrand",
  eta: "06:40",
  currentStage: "En Route" as (typeof logisticsStages)[number],
  clientEmail: ACME_EMAIL,
};

export const assetLifecycle = [
  "available",
  "reserved",
  "picked",
  "loaded",
  "deployed",
  "returned",
  "inspection",
  "maintenance",
] as const satisfies readonly AssetStatus[];

export const assetSummary: { status: AssetStatus; count: number }[] = [
  { status: "available", count: 412 },
  { status: "reserved", count: 96 },
  { status: "picked", count: 24 },
  { status: "loaded", count: 40 },
  { status: "deployed", count: 111 },
  { status: "returned", count: 18 },
  { status: "inspection", count: 9 },
  { status: "maintenance", count: 6 },
];

export const assetMetrics = {
  utilisationPct: 68,
  activeDeployments: 3,
  inMaintenance: 6,
  missing: 1,
  revenuePerAssetAvg: 1240,
};

export const sampleAssets: Asset[] = [
  { id: "as-1", equipmentId: "eq-001", serial: "LA-0231", status: "deployed" },
  { id: "as-2", equipmentId: "eq-003", serial: "SUB-0119", status: "deployed" },
  { id: "as-3", equipmentId: "eq-009", serial: "TR-0442", status: "loaded" },
  { id: "as-4", equipmentId: "eq-013", serial: "LW-0087", status: "inspection" },
  { id: "as-5", equipmentId: "eq-011", serial: "SD-0305", status: "maintenance" },
];

/** Mock records are tagged with the demo client they belong to. Admins see everything. */
export interface PortalScope {
  bookings: Booking[];
  quotes: Quote[];
  invoices: Invoice[];
  upcomingEvents: typeof upcomingEvents;
  activeDelivery: typeof activeDelivery | null;
}

export function portalScope(viewer: PortalViewer): PortalScope {
  if (viewer.role === "admin") {
    return { bookings, quotes, invoices, upcomingEvents, activeDelivery };
  }
  const email = viewer.email;
  const mine = <T extends { clientEmail?: string }>(rows: T[]): T[] =>
    rows.filter((row) => row.clientEmail === email);
  return {
    bookings: mine(bookings),
    quotes: mine(quotes),
    invoices: mine(invoices),
    upcomingEvents: mine(upcomingEvents),
    activeDelivery: activeDelivery.clientEmail === email ? activeDelivery : null,
  };
}
