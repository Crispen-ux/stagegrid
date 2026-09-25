import type { EquipmentCategory } from "@/types";

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Solution {
  slug: string;
  num: string;
  name: string;
  summary: string;
  tagline: string;
  equipmentCategories: EquipmentCategory[];
  useCases: string[];
  capabilities: string[];
  process: ProcessStep[];
  considerations: string[];
}

export const solutions: Solution[] = [
  {
    slug: "sound",
    num: "01",
    name: "Sound",
    summary: "Professional PA systems engineered around audience size, venue acoustics and event requirements.",
    tagline: "Coverage engineered for the room, not just the guest count.",
    equipmentCategories: ["audio", "subwoofers", "microphones", "mixing"],
    useCases: [
      "Corporate town halls and product launches requiring intelligible speech reinforcement",
      "Brand activations needing high-output music playback across an open outdoor footprint",
      "Conferences with multiple breakout rooms and simultaneous audio zones",
      "Concerts and festivals requiring full-range, high-SPL line array systems",
    ],
    capabilities: [
      "Line array and point-source system design matched to venue geometry",
      "Multi-zone audio for simultaneous sessions or staggered programme content",
      "Wireless microphone coordination (RF scanning to avoid interference)",
      "Front-of-house and monitor mixing by qualified audio engineers",
      "Digital signal processing for room correction and even coverage",
    ],
    process: [
      { title: "Venue & audience assessment", description: "We review capacity, venue acoustics and indoor/outdoor factors that affect coverage." },
      { title: "System design", description: "PA configuration, speaker placement and subwoofer arrangement are modelled for the space." },
      { title: "Deployment", description: "Rigging, cabling, RF coordination and system tuning are completed ahead of doors-open." },
      { title: "Live operation", description: "Qualified audio technicians operate front-of-house for the duration of the event." },
      { title: "Strike", description: "Full teardown, packing and return to inventory once the event concludes." },
    ],
    considerations: [
      "Outdoor events may require weather protection for speaker stacks and control positions.",
      "High-SPL systems can trigger municipal noise regulations — indicative guidance only, final compliance is the client's responsibility.",
      "Power requirements scale with system size; confirm venue supply capacity in advance.",
    ],
  },
  {
    slug: "trussing",
    num: "02",
    name: "Trussing",
    summary: "Modular structural systems for lighting rigs, branding and production loads.",
    tagline: "The structural backbone that carries lighting, branding and sound.",
    equipmentCategories: ["trussing"],
    useCases: [
      "Ground-supported rigs for lighting and PA at outdoor activations",
      "Branding and signage structures at trade shows and expos",
      "Roof systems for festival main stages carrying heavy production loads",
      "Goal-post and archway structures for entrances and photo backdrops",
    ],
    capabilities: [
      "Modular box truss in multiple cross-sections for different load classes",
      "Ground support towers and self-climbing systems",
      "Full roof structure systems for large-format outdoor stages",
      "Load calculations for lighting, audio and banner/branding weight",
      "Certified rigging crew for all overhead work",
    ],
    process: [
      { title: "Load assessment", description: "We calculate the combined weight of lighting, audio and branding the structure will carry." },
      { title: "Structural design", description: "Truss configuration, span and support points are planned against the load and venue constraints." },
      { title: "Build & rig", description: "Certified crew assemble and rig the structure to specification." },
      { title: "Inspection", description: "Pre-show structural check before the truss is loaded live." },
      { title: "Strike", description: "Controlled de-rig and return to inventory." },
    ],
    considerations: [
      "Heavier truss tiers require additional certified rigging crew — reflected in crew estimates.",
      "Ground conditions (paving, grass, slope) affect base and ballast requirements for ground-supported rigs.",
      "Final structural sign-off requires qualified engineering review, not an automated estimate.",
    ],
  },
  {
    slug: "staging",
    num: "03",
    name: "Staging",
    summary: "Modular stages, platforms and risers built for rapid, safe deployment.",
    tagline: "Modular platforms sized to the performance, not a fixed template.",
    equipmentCategories: ["stage"],
    useCases: [
      "Presenter platforms for corporate keynotes and panel discussions",
      "Product launch stages with runway or catwalk extensions",
      "Multi-tier stages for live performances and festival headline acts",
      "Elevated VIP platforms and camera risers",
    ],
    capabilities: [
      "Modular deck systems in multiple sizes with adjustable-height legs",
      "Stairs, ramps and handrails for certified access and egress",
      "Skirting and branding wraps for a finished visual edge",
      "Multi-level configurations for performers, presenters and camera positions",
    ],
    process: [
      { title: "Layout planning", description: "Stage footprint, height and access points are planned around the performance or presentation format." },
      { title: "Deck build", description: "Modular deck sections are assembled, levelled and locked to the required footprint." },
      { title: "Access & safety fit-out", description: "Stairs, ramps, handrails and skirting are installed to specification." },
      { title: "Handover", description: "Stage is checked and handed to production before rehearsal or doors-open." },
      { title: "Strike", description: "De-rig and return of all deck, leg and access components." },
    ],
    considerations: [
      "Load ratings vary by deck configuration — confirm expected foot traffic and equipment weight in advance.",
      "Uneven ground may require additional levelling time on outdoor sites.",
      "Multi-tier stages require additional setup hours, reflected in the crew and time estimate.",
    ],
  },
  {
    slug: "lighting",
    num: "04",
    name: "Lighting",
    summary: "Architectural, stage and activation lighting design and control.",
    tagline: "Lighting that shapes mood, focus and brand presence.",
    equipmentCategories: ["lighting"],
    useCases: [
      "Architectural up-lighting for venue and brand-colour washes",
      "Stage lighting for keynotes, performances and panel discussions",
      "Moving-light and gobo design for activations and product reveals",
      "Full show lighting design for festivals and concerts",
    ],
    capabilities: [
      "LED wash and architectural fixtures with full colour control",
      "Moving head spot and beam fixtures for dynamic looks",
      "DMX/Art-Net programmable control consoles",
      "Lighting design and programming by dedicated lighting technicians",
    ],
    process: [
      { title: "Design brief", description: "Mood, brand colours and key moments (entrances, reveals, performances) are discussed." },
      { title: "Fixture plan", description: "Fixture types, positions and DMX universe planning are mapped to the venue." },
      { title: "Rig & focus", description: "Fixtures are rigged, powered, patched and focused ahead of programming." },
      { title: "Programming", description: "Cues and looks are programmed and rehearsed against the event run-sheet." },
      { title: "Live operation & strike", description: "A lighting technician operates the show live; full de-rig follows the event." },
    ],
    considerations: [
      "Premium activation lighting design requires additional programming time ahead of the event.",
      "Outdoor daylight events may need higher-output fixtures for visible effect.",
      "Moving light rigs typically require truss support — coordinate with the Trussing solution.",
    ],
  },
  {
    slug: "av",
    num: "05",
    name: "AV",
    summary: "Displays, presentation systems and technical event AV.",
    tagline: "Screens, switching and signal management that just works on the day.",
    equipmentCategories: ["av"],
    useCases: [
      "Single-screen presentation setups for conferences and meetings",
      "Multi-screen video wall backdrops for product launches and activations",
      "Broadcast-grade AV for hybrid or livestreamed events",
      "Confidence monitors and camera feeds for panel discussions",
    ],
    capabilities: [
      "Fine-pitch LED video wall panels in configurable formats",
      "Multi-input vision switching with programme/preview monitoring",
      "Fast-fold projection and screen packages",
      "Signal distribution and redundancy for mission-critical presentations",
    ],
    process: [
      { title: "Content & format review", description: "Presentation formats, screen aspect ratios and content sources are confirmed." },
      { title: "System design", description: "Screen size, switching and signal path are planned for the room and content." },
      { title: "Build & test", description: "Screens are rigged or built, signal-tested end to end before doors-open." },
      { title: "Live operation", description: "AV technicians run switching and troubleshoot live during the event." },
      { title: "Strike", description: "De-rig and return of all screens, switching and cabling." },
    ],
    considerations: [
      "Video wall panels require a flat, stable rigging surface or dedicated frame structure.",
      "Broadcast-grade AV needs confirmed content specs and signal sources well ahead of the event.",
      "Bright venues or daylight conditions affect required screen brightness (nits).",
    ],
  },
  {
    slug: "logistics",
    num: "06",
    name: "Logistics",
    summary: "Delivery, setup, technical crew, strike and return — fully coordinated.",
    tagline: "One coordinated operation from warehouse to strike.",
    equipmentCategories: ["accessories"],
    useCases: [
      "Full delivery, setup and strike for multi-discipline event infrastructure",
      "Multi-site rollouts requiring coordinated fleet and crew scheduling",
      "Time-critical turnarounds between consecutive bookings",
      "Self-collect options for smaller, client-managed setups",
    ],
    capabilities: [
      "Route and fleet scheduling for on-time delivery",
      "Technical crew allocation matched to the equipment package",
      "On-site setup supervision by a lead technician",
      "Coordinated strike and return-to-warehouse processing",
    ],
    process: [
      { title: "Scheduling", description: "Delivery windows, load-in access and crew requirements are confirmed against the venue." },
      { title: "Loading", description: "Equipment is picked, checked and loaded for the confirmed route." },
      { title: "Delivery & setup", description: "Crew deliver, install and test all infrastructure ahead of the event." },
      { title: "On-site standby", description: "Technical crew remain available for the live event where required." },
      { title: "Strike & return", description: "Equipment is struck, loaded, returned and checked back into inventory." },
    ],
    considerations: [
      "Delivery windows depend on venue load-in access and loading-dock availability.",
      "Multi-site or same-day turnaround bookings require confirmed scheduling well in advance.",
      "Self-collect option shifts responsibility for safe transport and handling to the client.",
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

export function getRelatedSolutions(slug: string, count = 3) {
  return solutions.filter((s) => s.slug !== slug).slice(0, count);
}
