import type { StageEvent } from "@/types";

export const projects: StageEvent[] = [
  {
    id: "proj-001",
    name: "Corporate Product Launch",
    type: "corporate",
    guestCount: 250,
    region: "Johannesburg",
    infrastructure: ["Standard PA + Line Array", "8m x 6m Modular Stage", "9m Ground-Supported Truss", "Architectural Lighting"],
    outcome: "Delivered a full-capability launch stage in a single 6-hour build window, with same-night strike for a back-to-back venue booking.",
  },
  {
    id: "proj-002",
    name: "Outdoor Brand Activation",
    type: "activation",
    guestCount: 600,
    region: "Gauteng",
    infrastructure: ["High-Output PA + Subs", "12m Dual-Tower Truss", "Full Activation Lighting Design", "Weather-Protected FOH"],
    outcome: "Coordinated a multi-day outdoor build across variable weather, with contingency weather protection built into the technical plan from day one.",
  },
  {
    id: "proj-003",
    name: "Corporate Conference",
    type: "conference",
    guestCount: 400,
    region: "Cape Town",
    infrastructure: ["Multi-Zone Speech PA", "Broadcast-Grade AV", "Video Wall Backdrop", "Wireless Microphone Package"],
    outcome: "Ran a two-day multi-session conference with simultaneous breakout audio zones and zero signal dropouts across all presentation feeds.",
  },
  {
    id: "proj-004",
    name: "Music Event",
    type: "festival",
    guestCount: 1000,
    region: "KwaZulu-Natal",
    infrastructure: ["12x Line Array + 12 Subs", "Full Roof Structure System", "16m x 10m Main Stage + Wings", "Full Show Lighting Design"],
    outcome: "Delivered a festival-scale main stage build with a 20-person crew, on schedule despite a compressed 12-hour load-in window.",
  },
];
