# STAGEGRID — Phase 1 through 8

Next.js 14 (App Router) + TypeScript + Tailwind CSS prototype for STAGEGRID.

## Phase 2 additions

- **Mock equipment catalog** (`data/equipment.ts`): 21 products across all 9 categories (Audio, Subwoofers,
  Microphones, Mixing, Trussing, Stage, Lighting, AV, Accessories), each typed as `Equipment`.
- **Equipment catalog page** (`app/equipment/page.tsx`): search, category filter, "available only" toggle,
  responsive product grid.
- **Persistent Event Basket** (`lib/basket-context.tsx`): a `BasketProvider` (React Context + `useReducer`)
  wraps the whole app via `components/Providers.tsx`, persisted to `localStorage` so it survives reloads and
  navigation. `useBasket()` exposes `addToEvent`, `setQuantity`, `remove`, `clear`, `itemCount`, `total`.
- **Nav basket badge** (`components/equipment/BasketIndicator.tsx`): live item count in the header, visible on
  every page.
- **Basket panel** (`components/equipment/BasketPanel.tsx`): sticky sidebar on the equipment page showing line
  items, quantity controls, running total, and a hand-off CTA into the Event Builder.

## Phase 3 — basket wired into the Event Builder

- The builder's right-hand panel (visible on every one of the 10 steps, not just Review) now shows, beneath the
  auto-generated recommendation: a live, editable list of anything added from the Equipment catalog
  (`BasketMiniList`), and a **Combined Estimated Total** = recommended package estimate + basket subtotal.
- Quantities can be adjusted or items removed directly from the builder — no need to leave the flow.
- The **Review** step (step 10) now itemises named equipment from the basket alongside the recommended
  package line, with a basket subtotal and the same combined grand total, so the quote request reflects both
  the system-recommended infrastructure and anything the person picked out by hand.
- A "Browse Equipment" link stays visible throughout the builder to add more.

The recommendation engine (`lib/calculations.ts`) is untouched — it still returns its own indicative estimate.
Basket and recommendation are summed at the display layer, so either can be swapped for real pricing later
without the other needing to change.

## Phase 4 — Solutions detail pages

- **`data/solutions.ts`** expanded: each of the 6 solutions now carries a hero tagline, use cases, technical
  capabilities, a 5-step delivery process, technical considerations, and the `EquipmentCategory`s it draws
  from — instead of just the name/summary used by the homepage grid.
- **`/solutions`**: index page listing all six with the same premium grid treatment as the homepage.
- **`/solutions/[slug]`**: statically generated (`generateStaticParams`) detail page per solution — hero, use
  cases, capabilities, live equipment examples pulled from the actual catalog (`data/equipment.ts`) by
  category, a 5-step process, technical considerations (with the same non-certifying disclaimer as the Event
  Builder), a CTA block, and 3 related solutions.
- Verified: `tsc --noEmit`, `eslint`, and `next build` all clean — all 6 solution pages statically prerender.

## Phase 5 — Projects, About, How It Works, Contact & Request Quote

Fills in the remaining pages that were already linked from the nav, footer and solution pages but 404'd
until now:

- **`/projects`**: case-study cards from `data/projects.ts` (`StageEvent` type) — the 4 examples from the
  brief (Corporate Product Launch, Outdoor Brand Activation, Corporate Conference, Music Event), each with
  guest count, region, infrastructure tags and outcome copy.
- **`/about`**: the fragmentation thesis, Mission, Vision and 4 Operating Principles — no generic corporate
  filler copy.
- **`/how-it-works`**: the 6-step pipeline (Tell us → Configure → Recommendation → Approve → Deploy →
  Operate/Recover) as a connected vertical timeline.
- **`/contact`**: a validated form (name, company, email, phone, message) with inline error states and a
  success state — client-side only, no backend, matching the "no real backend yet, flows should feel real"
  brief.
- **`/request-quote`**: a shorter lead-capture form (event type, guest count, date, venue, contact) that
  produces a mock reference number on submit and offers a link into the live Event Builder as the faster
  alternative.

## Phase 6 — Portal dashboard (STAGEGRID OS preview)

- **`data/portal.ts`**: mock `Booking`, `Quote`, `Invoice` (new type added to `types/index.ts`), `CrewMember`,
  `Vehicle` and `Asset` data, plus a sample live delivery and asset-lifecycle summary.
- **`/portal`**: a tabbed dashboard (`components/dashboard/`) with 8 sections:
  - **Overview** — stat cards + the upcoming-events list from the brief's exact example (event name, status,
    asset count, crew count, delivery window).
  - **Events & Bookings** — full bookings table with status, delivery window, crew size.
  - **Equipment** — live counts per category, pulled from the same `data/equipment.ts` used by the catalog.
  - **Quotes & Invoices** — two tables with status badges (draft/sent/approved/expired, draft/sent/paid/overdue).
  - **Crew** — roster with role labels and initials avatars.
  - **Logistics** — the Uber-style live delivery tracker: current stage highlighted along the full
    Warehouse → Loaded → En Route → Arrived → Setup → Live → Strike → Returning pipeline, truck/driver/lead
    tech/location/ETA, plus fleet status.
  - **Assets** — the asset lifecycle board (Available → Reserved → Picked → Loaded → Deployed → Returned →
    Inspection → Maintenance) with utilisation/deployment/maintenance/missing/revenue-per-asset metrics and a
    recent-activity table.
  - **STAGEGRID OS** — the architecture diagram connecting CRM, Quotes, Event Builder, Inventory, Asset
    Tracking, Crew, Logistics, Pricing, Maintenance, Billing, Analytics and AI, labelled "Coming to STAGEGRID
    OS" per the brief's rule against implying these are live today.
- Verified: `tsc --noEmit`, `eslint`, and `next build` clean — all 19 routes prerender.

## Phase 7 — Legal pages

- **`components/marketing/LegalLayout.tsx`**: shared layout (title, "last updated" date, intro, numbered
  sections) reused by all four pages below.
- **`/privacy`** — information collected, how it's used, sharing, security, user rights, cookies (honest that
  this prototype sets none), contact.
- **`/terms`** — acceptance, use of the site, the rule that a Builder configuration or Basket is *not* a
  confirmed booking, IP, limitation of liability, South African governing law, changes to terms.
- **`/rental-terms`** — equipment condition, delivery/collection (including self-collect liability), damage &
  loss, payment terms, cancellation policy, client responsibilities, indemnity.
- **`/safety`** — written to match Section 27 of the brief precisely: indicative recommendations are explicitly
  *not* automated structural/electrical/rigging/noise certification; qualified technical review is required
  before deployment; on-site safety, power, weather, crew certification and incident reporting are covered
  without overclaiming.
- Verified: `tsc --noEmit`, `eslint`, and `next build` all clean — **all 23 routes now build and every internal
  link in the nav, footer and page content resolves** (no more dangling links from earlier phases).

## Phase 8 — Dynamic Pricing page, shadcn/ui, Framer Motion, real photography

- **`/pricing`** (new): `data/pricing.ts` + `app/pricing/page.tsx`. Covers the 8 pricing factors from Section 12
  of the brief, a sample price breakdown, and is explicit that this is a roadmap view — the Event Builder's
  rules engine is the only *live* pricing today. Linked from the footer and the Portal's STAGEGRID OS tab.

- **shadcn/ui foundation**: `components.json`, `lib/utils.ts` (`cn()`), and
  `class-variance-authority`/`clsx`/`tailwind-merge`/`@radix-ui/react-*` added as real dependencies.
  `components/ui/` now has `button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`, `select.tsx` (Radix-backed),
  `tabs.tsx` (Radix-backed) and `separator.tsx` — all adapted to our existing design tokens (`accent`, `border`,
  `surface`, etc.) rather than introducing shadcn's default color-variable system, so they sit seamlessly
  alongside the custom `.btn`/`.chip` classes from earlier phases (not every element was migrated — see "still
  open" below). Wired into: `Nav`, `BasketIndicator`, `EquipmentCard`, the Portal's tab navigation (genuinely
  Radix `Tabs` now, not custom `useState`), status badges in Overview/Events/Quotes & Invoices tabs, and the
  Contact / Request Quote forms (`Input`, `Select`).

- **Framer Motion polish pass**: `framer-motion` installed.
  - **Nav**: a genuine full-screen animated mobile menu was added — this was actually a gap from Section 17 of
    the original brief that no earlier phase had built (nav links were simply hidden below `md:`, with no
    mobile menu at all). It's now a hamburger-triggered, staggered slide-in `AnimatePresence` panel.
  - **Hero**: staggered fade/slide-up entrance for the heading, subhead, CTAs and tags.
  - **`RevealOnScroll`** (new, reusable): scroll-triggered fade-in, applied to the Solutions grid (home +
    `/solutions`), the Projects grid, and the Equipment catalog grid.
  - **Event Builder**: step content now cross-fades/slides via `AnimatePresence` when moving between the 10
    steps, instead of snapping instantly.
  - Kept deliberately restrained — no page-transition wrapper, no motion on every element — per the brief's
    "avoid animation overload" instruction.

- **Real photography**: `lib/photos.ts` provides deterministic placeholder photography via Picsum Photos
  (seeded, so each equipment/solution/project always renders the same image rather than a random one on every
  reload). Applied to: the homepage hero background, all 6 Solutions detail page headers, the Solutions
  equipment-example thumbnails, Projects cards, and Equipment catalog cards — replacing the icon/empty-block
  placeholders from earlier phases. `next.config.js` has `images.remotePatterns` for `picsum.photos`.
  **This is explicitly a placeholder choice**, documented in `lib/photos.ts` itself: swap `photoUrl()` for real
  STAGEGRID brand photography (via `next/image` with your own CDN/remote pattern) before production — I have no
  way to source or verify licensed STAGEGRID photography from inside this environment.

- Verified: `tsc --noEmit`, `eslint`, and `next build` all clean across all **24 routes**.

**Still genuinely open**, if you want another phase: not every legacy `.btn`/`.chip` usage was migrated to the
new shadcn primitives (Event Builder's step chips and progress rail, for example, still use the earlier custom
classes — converting those is straightforward but wasn't done here to keep this phase bounded); a
Radix-backed `Dialog`/`Sheet` for the basket (currently a sidebar panel, not a slide-over); and real brand
photography in place of the Picsum placeholders.

## Phase 9 — real APIs, Prisma + Postgres, Vercel

The four submission flows that were client-side only are now backed by route handlers, deployed as
serverless functions on Vercel with a Prisma Postgres database attached to the project:

- **`POST /api/contact`** — Contact form (`components/marketing/ContactForm.tsx`).
- **`POST /api/quotes`** — Request Quote form (`components/marketing/RequestQuoteForm.tsx`); returns a
  server-issued `SG-Q-…` reference instead of the old client-side random one.
- **`POST /api/builder-quotes`** — Event Builder "Request Technical Quote" (`BuilderShell.tsx`, previously a
  button with no handler). The server re-validates the configuration and **recomputes** the recommendation and
  basket total from `lib/calculations.ts` + `data/equipment.ts`, so the stored `estimateTotal` never depends on
  what the browser claimed.
- **`POST /api/builder-configs`** + **`GET /api/builder-configs/[ref]`** — "Save Configuration" and load it
  back by reference, so a builder configuration survives beyond the session.

Infrastructure:

- **Prisma 7** (`prisma/schema.prisma`): `ContactMessage`, `QuoteRequest`, `BuilderQuote`, `BuilderConfig`,
  each with a unique human-readable reference. The client is generated to `lib/generated/prisma` (gitignored)
  by `prisma generate`, which runs in both `postinstall` and `build`, and connects through `@prisma/adapter-pg`.
- **Graceful fallback** (`lib/db.ts`): with no `DATABASE_URL` / `POSTGRES_URL` / `PRISMA_DATABASE_URL` set,
  `getDb()` returns `null` and every endpoint logs the payload and answers with a synthetic id plus
  `mocked: true` — all forms keep working on a fresh clone. Set the variable and the identical code path
  persists for real.
- **Validation is enforced twice**: browser-side for UX (`ContactForm`, `RequestQuoteForm`) and again on the
  server (`lib/server.ts`, `lib/config-validation.ts`), because the client copy is not a contract.
- **Migration**: `prisma/migrations/20260926000000_init` — 4 tables, unique indexes on the references.
  Apply with `npm run db:migrate`.
- **Deployed**: `lene6/stagegrid` on Vercel, Prisma Postgres **free** tier (region `fra1`), with
  `DATABASE_URL` / `POSTGRES_URL` / `PRISMA_DATABASE_URL` set for Production, Preview and Development.
  `vercel.json` pins `buildCommand` to `npm run build` so `prisma generate` runs on every build.
- Verified: `tsc --noEmit`, `eslint` and `next build` clean (**28 routes**); all endpoints exercised against
  the production alias — writes return `mocked: false` and land in Postgres, `GET /api/builder-configs/[ref]`
  round-trips a saved configuration, and validation errors come back as `400` with field-level messages.

## What's in Phase 1

- **Design system**: dark industrial tokens in `tailwind.config.ts` / `app/globals.css`, matching the earlier
  HTML prototypes (background, surface, border, accent, ok/warn colors; Space Grotesk display + Inter body).
- **Typed data layer** (`types/index.ts`): domain types for `Event`, `Equipment`, `Package`, `Quote`, `Booking`,
  `Asset`, `CrewMember`, `Vehicle`, `PricingRule`, etc. — the shapes the future STAGEGRID OS API will return.
- **Deterministic recommendation engine** (`lib/calculations.ts`): pure functions —
  `calculateRecommendedPackage`, `calculateEstimatedPrice`, `calculatePowerRequirement`,
  `calculateCrewRequirement`, `calculateSetupTime`, `validateConfiguration` — used by both the homepage preview
  and the full builder. Swap the internals for real API calls later without touching any component.
- **Homepage** (`app/page.tsx`): hero, trust strip, live interactive Event Builder preview, solutions grid.
- **Full Event Builder** (`app/event-builder/page.tsx`): all 10 steps from the brief, split-screen layout,
  clickable progress rail, live schematic + recommendation panel, review step.
- Shared `Nav` / `Footer`, reusable `Schematic` and `RecommendationPanel` components used by both builder surfaces.

## Not yet built (next phases)

- `/solutions/[slug]` detail pages, `/equipment` catalog + basket, `/projects`, `/about`, `/how-it-works`,
  `/contact`, `/request-quote`, `/portal` dashboard, live logistics tracker, asset lifecycle dashboard,
  dynamic pricing explainer, mock data for equipment/projects/crew/vehicles, shadcn/ui components, animations.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without a `DATABASE_URL` the site runs in **mock mode**: every form still submits
and reports success, and payloads are logged to the server console instead of being stored. To persist locally,
copy `.env.example` to `.env`, point `DATABASE_URL` at a Postgres instance and run `npm run db:migrate` once.

`npm run build` produces a production build (this requires normal internet access to fetch Inter and Space
Grotesk from Google Fonts at build time via `next/font/google`, and runs `prisma generate` first). Deployed
environment variables live on Vercel — pull them with `npx vercel env pull`.

## Notes

- Everything in `lib/calculations.ts` is currently rules-based mock logic, matching Section 9's requirement
  that these are indicative estimates only — no structural, electrical or rigging safety certification is
  implied anywhere in the copy.
- `npx tsc --noEmit` and `npx eslint` both pass clean as of this delivery.
