"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./OverviewTab";
import { EventsTab } from "./EventsTab";
import { EquipmentTab } from "./EquipmentTab";
import { QuotesInvoicesTab } from "./QuotesInvoicesTab";
import { CrewTab } from "./CrewTab";
import { LogisticsTab } from "./LogisticsTab";
import { AssetsTab } from "./AssetsTab";
import { OSArchitecture } from "./OSArchitecture";

const tabs = [
  { key: "overview", label: "Overview", Component: OverviewTab },
  { key: "events", label: "Events & Bookings", Component: EventsTab },
  { key: "equipment", label: "Equipment", Component: EquipmentTab },
  { key: "quotes", label: "Quotes & Invoices", Component: QuotesInvoicesTab },
  { key: "crew", label: "Crew", Component: CrewTab },
  { key: "logistics", label: "Logistics", Component: LogisticsTab },
  { key: "assets", label: "Assets", Component: AssetsTab },
  { key: "os", label: "STAGEGRID OS", Component: OSArchitecture },
] as const;

export function PortalShell() {
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
      </aside>
      <div className="px-6 py-10 sm:px-10">
        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-0">
            <t.Component />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
