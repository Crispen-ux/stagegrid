import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PortalShell } from "@/components/dashboard/PortalShell";
import { RequestsTab } from "@/components/dashboard/RequestsTab";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { QuotesInvoicesTab } from "@/components/dashboard/QuotesInvoicesTab";
import { mockPortalData } from "@/lib/portal-data";
import { ACME_EMAIL, NORTHWIND_EMAIL } from "@/data/portal";
import type { PortalAccountRow, PortalRequests, PortalViewer } from "@/types";

const accounts: PortalAccountRow[] = [];

const requests: PortalRequests = {
  contactMessages: [
    {
      id: "1",
      name: "Thandi",
      company: "Events Co",
      email: "thandi@example.com",
      phone: "082 000 0000",
      message: "Hello there",
      handled: false,
      created: "2026-09-26T09:00:00.000Z",
    },
  ],
  quoteRequests: [
    {
      id: "2",
      reference: "SG-Q-TESTREF1",
      eventType: "corporate",
      guestCount: 250,
      eventDate: null,
      venue: "Sandton",
      name: "Kim Naidoo",
      email: ACME_EMAIL,
      notes: null,
      status: "new",
      created: "2026-09-26T09:05:00.000Z",
    },
  ],
  builderQuotes: [
    { id: "3", reference: "SG-BQ-TESTREF", estimateTotal: 78950, status: "new", created: "2026-09-26T09:10:00.000Z" },
  ],
  builderConfigs: [
    {
      id: "4",
      reference: "SG-C-TESTREF",
      label: "prod",
      created: "2026-09-26T09:11:00.000Z",
      updated: "2026-09-26T09:12:00.000Z",
    },
  ],
  accountRequests: [
    { id: "5", name: "Test Person", company: "Demo Traders", email: "pending@demo.co.za", created: "2026-09-26T09:09:00.000Z" },
  ],
};

const admin: PortalViewer = { id: "cl_admin", name: "STAGEGRID Ops", email: "ops@stagegrid.co.za", role: "admin" };
const staff: PortalViewer = { id: "cl_staff", name: "Sipho Dlamini", email: "sipho@stagegrid.co.za", role: "staff" };
const acme: PortalViewer = { id: "cl_acme", name: "Kim Naidoo", email: ACME_EMAIL, company: "Acme Corp", role: "client" };
const northwind: PortalViewer = { id: "cl_nw", name: "Sana Patel", email: NORTHWIND_EMAIL, company: "Northwind Media", role: "client" };

const dataAdmin = mockPortalData(admin);
const dataStaff = mockPortalData(staff);
const dataAcme = mockPortalData(acme);
const dataNorthwind = mockPortalData(northwind);

/** Database-mode Acme data with a real itemised breakdown on every row. */
const granular = {
  ...dataAcme,
  source: "database" as const,
  quotes: dataAcme.quotes.map((quote) => ({
    ...quote,
    items: [
      { description: "PA system — L-Series line array", qty: 1, unitPrice: 14500, amount: 14500 },
      { description: "Crew — 6 technicians", qty: 6, unitPrice: 1750, amount: 10500 },
    ],
  })),
  invoices: dataAcme.invoices.map((invoice) => ({
    ...invoice,
    items: [
      { description: "Equipment hire — 3 days", qty: 3, unitPrice: 18000, amount: 54000 },
      { description: "Project management & technical design", qty: 1, unitPrice: 9000, amount: 9000 },
    ],
  })),
};

const checks: { label: string; html: string; contains?: string[]; excludes?: string[] }[] = [
  {
    label: "RequestsTab (admin)",
    html: renderToStaticMarkup(<RequestsTab viewer={admin} requests={requests} canManage />),
    contains: [
      "Portal access requests",
      "pending@demo.co.za",
      "Activate",
      "Quote requests",
      "SG-Q-TESTREF1",
      "Builder quotes",
      "SG-BQ-TESTREF",
      "Saved builder configurations",
      "Contact messages",
      "Hello there",
      "Mark handled",
      "Delete",
      "R78",
    ],
    excludes: [],
  },
  {
    label: "RequestsTab (client)",
    html: renderToStaticMarkup(<RequestsTab viewer={acme} requests={requests} canManage={false} />),
    contains: ["Your requests", "Quote requests"],
    excludes: ["Portal access requests", "pending@demo.co.za", "Activate", "Mark handled"],
  },
  {
    label: "PortalShell (admin)",
    html: renderToStaticMarkup(
      <PortalShell viewer={admin} requests={requests} data={dataAdmin} accounts={accounts} />
    ),
    contains: [
      ">Overview<",
      ">Events &amp; Bookings<",
      ">Equipment<",
      ">Crew<",
      ">Assets<",
      ">STAGEGRID OS<",
      ">Requests<",
      ">Clients &amp; Staff<",
      "STAGEGRID admin",
    ],
    excludes: [],
  },
  {
    label: "PortalShell (staff)",
    html: renderToStaticMarkup(
      <PortalShell viewer={staff} requests={requests} data={dataStaff} accounts={accounts} />
    ),
    contains: [">Equipment<", ">Crew<", ">Assets<", ">My Requests<", "STAGEGRID staff"],
    excludes: [">Clients &amp; Staff<"],
  },
  {
    label: "PortalShell (client)",
    html: renderToStaticMarkup(
      <PortalShell viewer={acme} requests={requests} data={dataAcme} accounts={accounts} />
    ),
    contains: [">Overview<", ">My Events<", ">Quotes &amp; Invoices<", ">Logistics<", ">My Requests<", "Acme Corp"],
    excludes: [">Equipment<", ">Crew<", ">Assets<", ">STAGEGRID OS<", ">Clients &amp; Staff<"],
  },
  {
    label: "OverviewTab (acme)",
    html: renderToStaticMarkup(<OverviewTab viewer={acme} data={dataAcme} />),
    contains: ["Corporate Product Launch", "Outdoor Brand Activation", "Upcoming Events"],
    excludes: ["Corporate Conference", "Asset Utilisation"],
  },
  {
    label: "OverviewTab (northwind)",
    html: renderToStaticMarkup(<OverviewTab viewer={northwind} data={dataNorthwind} />),
    contains: ["Corporate Conference", "Quotes", "Overdue Invoices"],
    excludes: ["Corporate Product Launch", "Asset Utilisation"],
  },
  {
    label: "OverviewTab (admin)",
    html: renderToStaticMarkup(<OverviewTab viewer={admin} data={dataAdmin} />),
    contains: ["Corporate Product Launch", "Corporate Conference", "Asset Utilisation"],
  },
  {
    label: "QuotesInvoicesTab (acme, itemised + PDF)",
    html: renderToStaticMarkup(
      <QuotesInvoicesTab viewer={acme} data={granular} canManage={false} accounts={accounts} />
    ),
    contains: [
      "PA system — L-Series line array",
      "Crew — 6 technicians",
      "Equipment hire — 3 days",
      "Subtotal (excl. VAT)",
      "VAT @ 15%",
      "Total (incl. VAT)",
      "/api/quotes/",
      "/api/invoices/",
      ">PDF<",
    ],
    excludes: ["Single total — no line items"],
  },
  {
    label: "QuotesInvoicesTab (admin manage)",
    html: renderToStaticMarkup(
      <QuotesInvoicesTab viewer={admin} data={dataAdmin} canManage accounts={accounts} />
    ),
    contains: ["Add quote", "Add invoice", ">PDF<", "Lines"],
    excludes: [],
  },
];

let failures = 0;
for (const check of checks) {
  const missing = (check.contains ?? []).filter((needle) => !check.html.includes(needle));
  const leaked = (check.excludes ?? []).filter((needle) => check.html.includes(needle));
  if (missing.length === 0 && leaked.length === 0) {
    console.log(`  PASS  ${check.label} (${check.html.length} bytes)`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${check.label}`);
    for (const needle of missing) console.log(`        missing: ${needle}`);
    for (const needle of leaked) console.log(`        should not appear: ${needle}`);
  }
}
console.log(failures === 0 ? "\nAll render checks passed." : `\n${failures} render check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
