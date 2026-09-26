"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PortalAccountRow, PortalData, PortalRequests, PortalViewer } from "@/types";
import { AdminCrud } from "./AdminCrud";
import { OverviewTab } from "./OverviewTab";
import { EventsTab } from "./EventsTab";
import { EquipmentTab } from "./EquipmentTab";
import { QuotesInvoicesTab } from "./QuotesInvoicesTab";
import { CrewTab } from "./CrewTab";
import { LogisticsTab } from "./LogisticsTab";
import { AssetsTab } from "./AssetsTab";
import { OSArchitecture } from "./OSArchitecture";
import { RequestsTab } from "./RequestsTab";

interface PortalShellProps {
  viewer: PortalViewer;
  requests: PortalRequests;
  data: PortalData;
  accounts: PortalAccountRow[];
}

export function PortalShell({ viewer, requests, data, accounts }: PortalShellProps) {
  const isAdmin = viewer.role === "admin";
  const isInternal = viewer.role !== "client";
  const canManage = isAdmin && data.source === "database";

  const tabs = [
    { key: "overview", label: "Overview", node: <OverviewTab viewer={viewer} data={data} /> },
    {
      key: "events",
      label: isAdmin ? "Events & Bookings" : "My Events",
      node: <EventsTab viewer={viewer} data={data} canManage={canManage} accounts={accounts} />,
    },
    ...(isInternal
      ? [
          {
            key: "equipment",
            label: "Equipment",
            node: <EquipmentTab data={data} canManage={canManage} accounts={accounts} />,
          },
          { key: "crew", label: "Crew", node: <CrewTab data={data} canManage={canManage} /> },
          { key: "assets", label: "Assets", node: <AssetsTab data={data} canManage={canManage} accounts={accounts} /> },
        ]
      : []),
    {
      key: "quotes",
      label: "Quotes & Invoices",
      node: <QuotesInvoicesTab viewer={viewer} data={data} canManage={canManage} accounts={accounts} />,
    },
    {
      key: "logistics",
      label: "Logistics",
      node: <LogisticsTab viewer={viewer} data={data} canManage={canManage} accounts={accounts} />,
    },
    ...(isInternal ? [{ key: "os", label: "STAGEGRID OS", node: <OSArchitecture /> }] : []),
    {
      key: "requests",
      label: isAdmin ? "Requests" : "My Requests",
      node: <RequestsTab viewer={viewer} requests={requests} canManage={canManage} />,
    },
    ...(isAdmin
      ? [
          {
            key: "accounts",
            label: "Clients & Staff",
            node: (
              <AdminCrud
                moduleKey="clients"
                rows={accounts as unknown as Record<string, unknown>[]}
                accounts={accounts}
                heading="Portal accounts"
                allowCreate={canManage}
                allowDelete={canManage}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <Tabs defaultValue="overview" orientation="vertical" className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
      <aside className="border-b border-border lg:border-b-0 lg:border-r">
        <TabsList className="overflow-x-auto p-4 lg:sticky lg:top-[65px] lg:flex-col lg:items-stretch lg:overflow-visible">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key} className="lg:justify-start">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="hidden border-t border-border px-5 py-4 text-[12px] text-text-dim lg:block">
          <div className="font-medium text-text">{viewer.name}</div>
          <div className="mt-0.5 break-words">{viewer.email}</div>
          <div className="mt-1 uppercase tracking-wide text-text-faint">
            {viewer.role === "admin" ? "STAGEGRID admin" : viewer.role === "staff" ? "STAGEGRID staff" : viewer.company || "Client account"}
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-wide text-text-faint">
            {data.source === "database" ? "Live database" : "Mock mode"}
          </div>
        </div>
      </aside>
      <div className="px-6 py-10 sm:px-10">
        {data.source !== "database" && (
          <p className="mb-6 rounded border border-warn/40 bg-warn/5 px-4 py-3 text-[12.5px] text-warn">
            No database is configured — this is mock data. Set <code className="font-mono">DATABASE_URL</code> to
            manage real rows.
          </p>
        )}
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-0">
            {t.node}
          </TabsContent>
        ))}
        {!isInternal && (
          <p className="mt-8 border-t border-border pt-5 text-[12.5px] text-text-faint">
            You are seeing the records attached to your account. Anything else — crew, warehouse assets and
            internal architecture — stays with STAGEGRID.
          </p>
        )}
      </div>
    </Tabs>
  );
}
