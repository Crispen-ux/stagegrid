"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { portalScope } from "@/data/portal";
import type { PortalRequests, PortalViewer } from "@/types";
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
}

export function PortalShell({ viewer, requests }: PortalShellProps) {
  const scope = portalScope(viewer);
  const isAdmin = viewer.role === "admin";

  const tabs = [
    { key: "overview", label: "Overview", node: <OverviewTab viewer={viewer} /> },
    {
      key: "events",
      label: isAdmin ? "Events & Bookings" : "My Events",
      node: <EventsTab viewer={viewer} />,
    },
    ...(isAdmin
      ? [
          { key: "equipment", label: "Equipment", node: <EquipmentTab /> },
          { key: "crew", label: "Crew", node: <CrewTab /> },
          { key: "assets", label: "Assets", node: <AssetsTab /> },
        ]
      : []),
    { key: "quotes", label: "Quotes & Invoices", node: <QuotesInvoicesTab viewer={viewer} /> },
    { key: "logistics", label: "Logistics", node: <LogisticsTab viewer={viewer} /> },
    ...(isAdmin ? [{ key: "os", label: "STAGEGRID OS", node: <OSArchitecture /> }] : []),
    {
      key: "requests",
      label: isAdmin ? "Requests" : "My Requests",
      node: <RequestsTab viewer={viewer} requests={requests} />,
    },
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
            {isAdmin ? "STAGEGRID admin" : viewer.company || "Client account"}
          </div>
        </div>
      </aside>
      <div className="px-6 py-10 sm:px-10">
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-0">
            {t.node}
          </TabsContent>
        ))}
        {!isAdmin && (
          <p className="mt-8 border-t border-border pt-5 text-[12.5px] text-text-faint">
            You are seeing the records attached to your account. Anything else — crew, warehouse assets and
            internal architecture — stays with STAGEGRID.
          </p>
        )}
      </div>
    </Tabs>
  );
}
