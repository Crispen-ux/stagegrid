import { getDb } from "@/lib/db";
import {
  assetMetrics as mockAssetMetrics,
  assetSummary as mockAssetSummary,
  crew as crewRows,
  portalScope,
  sampleAssets,
  vehicles as vehicleRows,
} from "@/data/portal";
import { equipment as staticEquipment } from "@/data/equipment";
import type {
  Equipment,
  PortalAssetRow,
  PortalData,
  PortalProductRow,
  PortalViewer,
} from "@/types";

const BOOKING_STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const ACTIVE_BOOKING_STATUSES = ["confirmed", "in-progress"];

function dateKey(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (typeof val === "string") out[key] = val;
  }
  return out;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function toEquipment(row: {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  specs: unknown;
  dailyRate: number;
  available: boolean;
  quantityAvailable: number;
  compatiblePackages: unknown;
}): PortalProductRow {
  return {
    rowId: row.id,
    id: row.sku,
    name: row.name,
    category: row.category as Equipment["category"],
    description: row.description,
    specs: record(row.specs),
    dailyRate: row.dailyRate,
    available: row.available,
    quantityAvailable: row.quantityAvailable,
    compatiblePackages: stringList(row.compatiblePackages),
  };
}

function assetStats(rows: PortalAssetRow[]): PortalData["assetSummary"] {
  const counts = new Map<string, number>();
  for (const asset of rows) counts.set(asset.status, (counts.get(asset.status) ?? 0) + 1);
  return [...counts.entries()].map(([status, count]) => ({ status, count }));
}

function assetMetrics(rows: PortalAssetRow[], deployments: number): PortalData["assetMetrics"] {
  const total = rows.length;
  const deployed = rows.filter((row) => row.status === "deployed").length;
  const maintenance = rows.filter((row) => row.status === "maintenance").length;
  return {
    utilisationPct: total === 0 ? 0 : Math.round((deployed / total) * 100),
    activeDeployments: deployments,
    inMaintenance: maintenance,
    missing: 0,
    revenuePerAssetAvg: 1240,
  };
}

/** No `DATABASE_URL`: mirror what the tabs would show from the mock arrays. */
export function mockPortalData(viewer: PortalViewer): PortalData {
  const scope = portalScope(viewer);
  const isInternal = viewer.role !== "client";
  const delivery = scope.activeDelivery;

  return {
    bookings: scope.bookings.map((booking) => ({
      id: booking.id,
      reference: booking.id,
      eventName: booking.eventName,
      status: booking.status,
      deliveryWindow: booking.deliveryWindow,
      crewCount: booking.crew.length,
      clientId: null,
    })),
    quotes: scope.quotes.map((quote) => ({
      id: quote.id,
      reference: quote.id,
      status: quote.status,
      estimateTotal: quote.recommendedPackage.estimatedTotal,
      createdAt: quote.createdAt,
      clientId: null,
    })),
    invoices: scope.invoices.map((invoice) => ({
      id: invoice.id,
      reference: invoice.id,
      eventName: invoice.eventName,
      status: invoice.status,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      clientId: null,
    })),
    upcomingEvents: scope.upcomingEvents.map((event) => ({
      name: event.name,
      status: event.status,
      assets: event.assets,
      crewCount: event.crewCount,
      delivery: event.delivery,
      clientId: null,
    })),
    activeDelivery: delivery
      ? {
          id: "dlv-live",
          eventName: delivery.eventName,
          truck: delivery.truck,
          driver: delivery.driver,
          leadTechnician: delivery.leadTechnician,
          currentLocation: delivery.currentLocation,
          eta: delivery.eta,
          currentStage: delivery.currentStage,
          active: true,
          clientId: null,
        }
      : null,
    deliveries: delivery
      ? [
          {
            id: "dlv-live",
            eventName: delivery.eventName,
            truck: delivery.truck,
            driver: delivery.driver,
            leadTechnician: delivery.leadTechnician,
            currentLocation: delivery.currentLocation,
            eta: delivery.eta,
            currentStage: delivery.currentStage,
            active: true,
            clientId: null,
          },
        ]
      : [],
    crew: isInternal
      ? crewRows.map((member) => ({ id: member.id, name: member.name, role: member.role, active: true }))
      : [],
    vehicles: isInternal
      ? vehicleRows.map((vehicle) => ({ id: vehicle.id, label: vehicle.label, status: vehicle.status }))
      : [],
    assets: isInternal
      ? sampleAssets.map((asset) => ({
          id: asset.id,
          serial: asset.serial,
          equipmentId: asset.equipmentId,
          productName: staticEquipment.find((item) => item.id === asset.equipmentId)?.name ?? asset.equipmentId,
          status: asset.status,
          bookingRef: null,
        }))
      : [],
    products: staticEquipment.map((item) => ({ ...item, rowId: item.id })),
    assetSummary: isInternal ? mockAssetSummary.map((entry) => ({ ...entry })) : [],
    assetMetrics: isInternal ? { ...mockAssetMetrics } : assetMetrics([], 0),
    source: "mock",
  };
}

/**
 * Builds everything the dashboard tabs render. Admins and staff see the whole
 * operation, a client account sees rows carrying their own `clientId`.
 */
export async function loadPortalData(viewer: PortalViewer): Promise<PortalData> {
  const db = getDb();
  if (!db) return mockPortalData(viewer);

  const isInternal = viewer.role !== "client";
  const clientScope = isInternal ? {} : { clientId: viewer.id };

  const [bookings, quotes, invoices, deliveries, crew, vehicles, products] = await Promise.all([
    db.booking.findMany({ where: clientScope, orderBy: { updated: "desc" } }),
    db.quote.findMany({ where: clientScope, orderBy: { created: "desc" } }),
    db.invoice.findMany({ where: clientScope, orderBy: { created: "desc" } }),
    db.delivery.findMany({ where: clientScope, orderBy: { updated: "desc" } }),
    isInternal ? db.crewMember.findMany({ orderBy: { name: "asc" } }) : Promise.resolve([]),
    isInternal ? db.vehicle.findMany({ orderBy: { label: "asc" } }) : Promise.resolve([]),
    db.product.findMany({ orderBy: { name: "asc" } }),
  ]);

  const bookingRefs = bookings.map((booking) => booking.reference);
  const assets = await db.asset.findMany({
    where: isInternal ? {} : bookingRefs.length > 0 ? { bookingRef: { in: bookingRefs } } : { id: "none" },
    orderBy: { serial: "asc" },
  });

  const bookingRows = bookings.map((booking) => ({
    id: booking.id,
    reference: booking.reference,
    eventName: booking.eventName,
    status: booking.status,
    deliveryWindow: booking.deliveryWindow,
    crewCount: Array.isArray(booking.crewIds) ? booking.crewIds.length : 0,
    clientId: booking.clientId,
  }));

  const assetRows: PortalAssetRow[] = assets.map((asset) => ({
    id: asset.id,
    serial: asset.serial,
    equipmentId: asset.equipmentId,
    productName: products.find((product) => product.sku === asset.equipmentId)?.name ?? asset.equipmentId,
    status: asset.status,
    bookingRef: asset.bookingRef,
  }));

  const deliveryRows = deliveries.map((delivery) => ({
    id: delivery.id,
    eventName: delivery.eventName,
    truck: delivery.truck,
    driver: delivery.driver,
    leadTechnician: delivery.leadTechnician,
    currentLocation: delivery.currentLocation,
    eta: delivery.eta,
    currentStage: delivery.currentStage,
    active: delivery.active,
    clientId: delivery.clientId,
  }));

  return {
    bookings: bookingRows,
    quotes: quotes.map((quote) => ({
      id: quote.id,
      reference: quote.reference,
      status: quote.status,
      estimateTotal: quote.estimateTotal,
      createdAt: dateKey(quote.created),
      clientId: quote.clientId,
    })),
    invoices: invoices.map((invoice) => ({
      id: invoice.id,
      reference: invoice.reference,
      eventName: invoice.eventName,
      status: invoice.status,
      amount: invoice.amount,
      dueDate: dateKey(invoice.dueDate),
      clientId: invoice.clientId,
    })),
    upcomingEvents: bookingRows
      .filter((booking) => ACTIVE_BOOKING_STATUSES.includes(booking.status))
      .map((booking) => ({
        name: booking.eventName,
        status: BOOKING_STATUS_LABEL[booking.status] ?? booking.status,
        assets: assetRows.filter((asset) => asset.bookingRef === booking.reference).length,
        crewCount: booking.crewCount,
        delivery: booking.deliveryWindow,
        clientId: booking.clientId,
      })),
    activeDelivery: deliveryRows.find((delivery) => delivery.active) ?? null,
    deliveries: deliveryRows,
    crew: crew.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      phone: member.phone,
      active: member.active,
    })),
    vehicles: vehicles.map((vehicle) => ({
      id: vehicle.id,
      label: vehicle.label,
      status: vehicle.status,
      driver: vehicle.driver,
    })),
    assets: assetRows,
    products: products.map(toEquipment),
    assetSummary: isInternal ? assetStats(assetRows) : [],
    assetMetrics: isInternal
      ? assetMetrics(assetRows, deliveryRows.filter((delivery) => delivery.active).length)
      : assetMetrics([], 0),
    source: "database",
  };
}
