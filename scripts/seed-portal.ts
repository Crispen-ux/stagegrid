/**
 * Seeds the portal modules (products, bookings, quotes, invoices, crew, fleet,
 * assets, live delivery) from the mock arrays the dashboard used before Phase 12.
 *
 *   npm run db:seed-portal
 *
 * Insert-only: rows that already exist are left alone, so re-running never
 * overwrites edits made through the portal's admin CRUD.
 */
import "dotenv/config";
import * as path from "node:path";
import { config } from "dotenv";

config({ path: path.join(__dirname, "..", ".env.local") });

import { getDb } from "@/lib/db";
import { equipment } from "@/data/equipment";
import { bookings, crew, invoices, quotes, sampleAssets, activeDelivery, vehicles } from "@/data/portal";

async function main() {
  const db = getDb();
  if (!db) {
    console.error("No DATABASE_URL found — run `npx vercel env pull` first.");
    process.exit(1);
  }

  const clients = await db.client.findMany({ select: { id: true, email: true } });
  const clientIdFor = (email?: string) =>
    email ? clients.find((client) => client.email === email)?.id ?? null : null;

  let created = 0;
  let skipped = 0;
  const note = (made: boolean) => (made ? (created += 1) : (skipped += 1));

  for (const item of equipment) {
    const existing = await db.product.findUnique({ where: { sku: item.id } });
    if (existing) {
      note(false);
      continue;
    }
    await db.product.create({
      data: {
        sku: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        specs: item.specs as unknown as Record<string, string>,
        dailyRate: item.dailyRate,
        available: item.available,
        quantityAvailable: item.quantityAvailable,
        compatiblePackages: item.compatiblePackages,
      },
    });
    note(true);
  }

  const crewIdByName = new Map<string, string>();
  const clientIdByBookingRef = new Map<string, string | null>();
  for (const booking of bookings) {
    clientIdByBookingRef.set(booking.id, clientIdFor(booking.clientEmail));
  }
  for (const member of crew) {
    const existing = await db.crewMember.findFirst({ where: { name: member.name } });
    if (existing) {
      crewIdByName.set(member.name, existing.id);
      note(false);
      continue;
    }
    const row = await db.crewMember.create({
      data: { name: member.name, role: member.role, active: true },
    });
    crewIdByName.set(member.name, row.id);
    note(true);
  }

  for (const vehicle of vehicles) {
    const existing = await db.vehicle.findUnique({ where: { label: vehicle.label } });
    if (existing) {
      note(false);
      continue;
    }
    await db.vehicle.create({
      data: { label: vehicle.label, status: vehicle.status, driver: null },
    });
    note(true);
  }

  for (const asset of sampleAssets) {
    const existing = await db.asset.findUnique({ where: { serial: asset.serial } });
    if (existing) {
      note(false);
      continue;
    }
    await db.asset.create({
      data: { serial: asset.serial, equipmentId: asset.equipmentId, status: asset.status },
    });
    note(true);
  }

  for (const booking of bookings) {
    const existing = await db.booking.findUnique({ where: { reference: booking.id } });
    if (existing) {
      note(false);
      continue;
    }
    await db.booking.create({
      data: {
        reference: booking.id,
        eventName: booking.eventName,
        status: booking.status,
        deliveryWindow: booking.deliveryWindow,
        crewIds: booking.crew.map((member) => crewIdByName.get(member.name) ?? member.id),
        clientId: clientIdFor(booking.clientEmail),
      },
    });
    note(true);
  }

  for (const quote of quotes) {
    const existing = await db.quote.findUnique({ where: { reference: quote.id } });
    if (existing) {
      note(false);
      continue;
    }
    await db.quote.create({
      data: {
        reference: quote.id,
        status: quote.status,
        estimateTotal: quote.recommendedPackage.estimatedTotal,
        created: new Date(`${quote.createdAt}T09:00:00.000Z`),
        clientId: clientIdFor(quote.clientEmail),
      },
    });
    note(true);
  }

  for (const invoice of invoices) {
    const existing = await db.invoice.findUnique({ where: { reference: invoice.id } });
    if (existing) {
      note(false);
      continue;
    }
    await db.invoice.create({
      data: {
        reference: invoice.id,
        eventName: invoice.eventName,
        amount: invoice.amount,
        status: invoice.status,
        dueDate: invoice.dueDate ? new Date(`${invoice.dueDate}T00:00:00.000Z`) : null,
        bookingRef: invoice.bookingId,
        clientId: clientIdByBookingRef.get(invoice.bookingId) ?? null,
      },
    });
    note(true);
  }

  if (activeDelivery) {
    const existing = await db.delivery.findFirst({ where: { eventName: activeDelivery.eventName, active: true } });
    if (existing) {
      note(false);
    } else {
      await db.delivery.create({
        data: {
          eventName: activeDelivery.eventName,
          truck: activeDelivery.truck,
          driver: activeDelivery.driver,
          leadTechnician: activeDelivery.leadTechnician,
          currentLocation: activeDelivery.currentLocation,
          eta: activeDelivery.eta,
          currentStage: activeDelivery.currentStage,
          active: true,
          clientId: clientIdFor(activeDelivery.clientEmail),
        },
      });
      note(true);
    }
  }

  const [products, rows, crewCount, fleet, assets, deliveries] = await Promise.all([
    db.product.count(),
    db.booking.count(),
    db.crewMember.count(),
    db.vehicle.count(),
    db.asset.count(),
    db.delivery.count(),
  ]);
  console.log(
    `Portal data seeded — ${created} created, ${skipped} already present.\n` +
      `  products=${products} bookings=${rows} crew=${crewCount} vehicles=${fleet} assets=${assets} deliveries=${deliveries}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
