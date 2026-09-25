export interface PricingFactor {
  label: string;
  description: string;
}

export const pricingFactors: PricingFactor[] = [
  { label: "Demand", description: "How many other bookings are competing for the same equipment and crew on your dates." },
  { label: "Date", description: "Weekday, weekend and seasonal timing all shift baseline availability and cost." },
  { label: "Duration", description: "Multi-day bookings and extended setup windows are priced differently to single-day turnarounds." },
  { label: "Inventory availability", description: "Real-time stock levels for the specific equipment your configuration recommends." },
  { label: "Seasonality", description: "Peak event seasons (December, festival season) carry different demand curves to quieter months." },
  { label: "Equipment utilisation", description: "How heavily specific assets are already booked across the wider STAGEGRID fleet." },
  { label: "Delivery distance", description: "Route length and access complexity from the nearest STAGEGRID warehouse to your venue." },
  { label: "Crew requirements", description: "Specialist crew (certified riggers, lighting programmers) are scheduled and priced separately from general crew." },
];

export const sampleBreakdown = [
  { label: "Base equipment package", amount: 62000 },
  { label: "Delivery & logistics", amount: 8500 },
  { label: "Technical crew", amount: 14000 },
  { label: "Seasonal demand adjustment", amount: 4200 },
];
