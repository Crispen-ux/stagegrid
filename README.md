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

## Phase 10 — Portal password gate

`/portal` was publicly reachable. It is now behind a password:

- **`lib/portal-auth.ts`** — stateless session tokens: `<expiryMs>.<HMAC-SHA256>` signed with
  `PORTAL_SESSION_SECRET` (derived from the password when unset), verified in constant time. Cookie is
  `HttpOnly`, `SameSite=Lax`, `Secure` in production, 12 hours.
- **`/portal`** (`app/portal/page.tsx`) validates the cookie server-side and `redirect()`s to
  **`/portal/login`** — no password, no dashboard. The portal is also marked `noindex`.
- **`POST /api/portal-session`** validates the password (HMAC-then-compare, not a plain string check) and sets
  the cookie; **`DELETE /api/portal-session`** signs out via the button in the portal header.
- Password comes from `PORTAL_PASSWORD` (set for Production/Preview/Development on Vercel); with no env var
  the local default is `stagegrid`, with a warning logged if that default is ever used in production.
- Verified locally and against production: no session → `307 /portal/login`, wrong password → `401`, correct
  password → `200` with dashboard + Sign out, tampered token → `307`, homepage unaffected.

## Phase 11 — per-client portal accounts and the Requests tab

The single shared password from Phase 10 is gone: every client now signs in with **their own email +
password**, and the portal shows their rows only.

**Accounts and sign-in**

- **`prisma/schema.prisma`** — new `Client` model (`email` unique, `name`, `company`, `passwordHash`,
  `role` = `admin` | `client`, `status` = `pending` | `active` | `suspended`), plus a nullable `clientId`
  (+ index) on `ContactMessage`, `QuoteRequest`, `BuilderQuote` and `BuilderConfig`. Migration
  `prisma/migrations/20260926010000_client_accounts`.
- **`lib/portal-auth.ts`** — passwords are hashed with `scrypt` (N=16384, 16-byte salt, stored as
  `scrypt$salt$hash`) and verified in constant time; session tokens are now
  `<clientId>.<role>.<expiryMs>.<HMAC-SHA256>` signed with `PORTAL_SESSION_SECRET`, still `HttpOnly`,
  `SameSite=Lax`, `Secure` in production, 12 hours. `sessionFromRequest()` lets API routes attribute a
  submission to whoever is signed in.
- **`POST /api/portal-session`** signs in on `{ email, password }` — wrong credentials → `401`, a
  `pending` account → `403`, a suspended one → `403`. **`DELETE`** still signs out.
- **No email service is available**, so access is requested in the portal itself: **`POST /api/access-requests`**
  creates a `pending` account from `{ name, company?, email, password }`, and a STAGEGRID admin activates it
  from the Requests tab (**`PATCH /api/portal-clients/[id]`**, admin-only — `401` without a session, `403` for
  a client account).
- **Seeded accounts** (`npm run db:seed`, `scripts/seed-clients.js`, upserts on email):

  | role | email | password |
  | --- | --- | --- |
  | admin | `ops@stagegrid.co.za` | `SG-62Jzyw` (override with `PORTAL_ADMIN_PASSWORD`) |
  | client | `kim@acme.co.za` | `acme-portal-2026` |
  | client | `sana@northwind.co.za` | `northwind-portal-2026` |

**Requests tab (`components/dashboard/RequestsTab.tsx`)**

- Reads live rows through `lib/portal-requests.ts`: portal access requests, website quote requests,
  builder quotes, saved configurations and contact messages — newest first, dates rendered as ZA dates.
- **Admin** sees everything, including the pending-account queue with an **Activate** button that calls
  `PATCH /api/portal-clients/[id]` and reloads. **A client sees only rows whose `clientId` is theirs**,
  under "My Requests"; empty sections render an explicit empty state instead of a blank table.
- Every write endpoint now tags its row: `POST /api/contact`, `POST /api/quotes`, `POST /api/builder-quotes`
  and `POST /api/builder-configs` set `clientId` from the session cookie (anonymous submissions stay `null`
  and remain admin-only).

**Role-aware shell**

- `PortalShell` builds its tab list from the viewer: admins keep all eight tabs plus **Requests**; a client
  gets **Overview / My Events / Quotes & Invoices / Logistics / My Requests** — crew, warehouse assets,
  equipment inventory and the STAGEGRID OS architecture diagram stay internal. The sidebar shows the signed-in
  name, email and account type.
- Mock dashboard records (`data/portal.ts`) are tagged with `clientEmail` and filtered by
  `portalScope(viewer)`, so the two demo clients each see their own bookings, quotes, invoices, upcoming
  events and live delivery — Acme sees a delivery, Northwind sees an empty state.
- `/portal` resolves the session to a `Client` row server-side: unknown, `pending` or `suspended` accounts
  are redirected to `/portal/login`.

**Verification**

- `tsc --noEmit`, `next lint` and `next build` clean (**31 routes**, `/portal` and `/portal/login` dynamic).
- `npm run check:portal` (`scripts/render-check.tsx`, run with `npx tsx --tsconfig tsconfig.render.json`)
  server-renders the shell, Requests tab and Overview for admin/both clients and asserts the tab lists,
  sections and data scoping.
- Exercised against `next start`: sign-in matrix (bad password `401`, pending `403`, active `200`), no
  session `307`, a quote submitted while signed in as Kim appears in Kim's portal and not Sana's, admin-only
  `PATCH` (`401`/`403`/`200`) and the pending → activate → sign-in loop.

## Phase 12 — admin CRUD across every portal module

Admins now run the operation from inside the portal: one generic CRUD UI drives a management panel in every
dashboard tab, backed by the same module definitions the API validates with.

**Data model (`prisma/schema.prisma`, migration `20260926020000_portal_modules`)**

- Eight new models — `Product`, `Booking`, `Quote`, `Invoice`, `CrewMember`, `Vehicle`, `Asset`, `Delivery` —
  mirror the dashboard's typed shapes and keep a nullable `clientId` so client accounts stay scoped.
- `npm run db:seed` also runs `scripts/seed-portal.ts` (insert-only, tsx): 21 products, 3 bookings, 7 crew,
  3 vehicles, 5 assets, 1 delivery alongside the Phase 11 accounts.
- `lib/portal-data.ts` builds `PortalData` from those tables and falls back to the mock arrays when no
  `DATABASE_URL` is configured — `source: "database" | "mock"` decides whether management controls are enabled.

**One definition for API and UI (`lib/admin-schema.ts`)**

- `ADMIN_MODULES` declares columns + form fields for `products, bookings, quotes, invoices, crew, vehicles,
  assets, deliveries, clients, messages` — the API validates from it and `AdminCrud` renders its tables and
  forms from it, so a new module is one object.
- `parseModuleInput()` returns field-level `errors` (required fields, select options, number min, email shape,
  8+ character passwords, dates → ISO) that the form shows next to each input; `jsonSafe()` flattens Prisma
  `Date`s for the client. `messages` is `creatable: false` — rows only arrive from the public contact form,
  so `POST` answers `405`.

**API — `app/api/admin/[module]` (GET/POST) and `[module]/[id]` (PATCH/DELETE)**

- Admin-only on every method: `401` without a session, `403` for a staff or client account.
- `POST` → `201`, `PATCH`/`DELETE` → `200`; unknown module or missing row → `404`; validation → `400` with
  `errors`; unique conflicts (SKU, reference, email, serial, crew name, vehicle label) → `409`; generated
  references (`bk-…`, `SG-QT-…`, `inv-…`) retry on collision; a reference pointing at a deleted row → `400`.
- `lib/admin-db.ts` maps delegates, hashes `password` → `passwordHash` on account writes and enforces the
  account rules: an admin cannot change their own role, suspend their own account, delete themselves, or
  delete the last active admin. Without a database every write answers `503` — mock mode is read-only.

**Management UI (`components/dashboard/AdminCrud.tsx`)**

- Generic panel: table from `columns`, **Add**/**Edit** forms from `fields` (selects, toggles, dates, money,
  account and product reference pickers), inline delete confirmation, error/notice banners, then
  `router.refresh()` so the server-rendered tab reloads with the new rows.
- Wired in as an admin: Events & Bookings → `bookings`, Equipment → `products`, Crew → `crew`, Assets → asset
  register, Quotes & Invoices → `quotes` + `invoices`, Logistics → `deliveries` + fleet, Requests → contact
  messages get **Mark handled / Delete**, plus a new **Clients & Staff** tab for portal accounts
  (staff appears as a role option). Staff keep the internal tabs read-only, clients are unchanged, and the
  sidebar shows `Live database` or `Mock mode`.

**Verification**

- `tsc --noEmit`, `next lint`, `next build` and `npm run check:portal` clean — the render checks now assert the
  staff shell, the Clients & Staff tab and the message actions.
- 41/41 assertions against `next start`: guard matrix (`401`/`403`/`404`), a full product create → edit →
  delete loop (duplicate SKU `409`, missing field `400`, delete-again `404`), booking reference generation,
  a contact message created through the public form then handled and deleted through the admin API, account
  rules (duplicate email `409`, missing/short password `400`, self-demote/self-delete `400`), a staff account
  signing in but blocked from the admin API, and page checks for admin/staff/client/anon.

## Phase 13 — itemised quotes & invoices + a PDF engine

Quotes and invoices stopped being a single number: each one now carries a line-item breakdown that shows in
the portal, is editable in the admin forms and prints on a generated PDF.

**Data (`prisma/schema.prisma`, migration `20260926030000_quote_invoice_items`)**

- `QuoteItem` / `InvoiceItem` — description, `qty`, `unitPrice`, `amount` (always qty × unit price),
  `sortOrder`, cascade-deleted with their parent.
- `scripts/seed-portal.ts` fills them in for every seeded row (insert-only): quotes get PA / truss / stage /
  lighting / AV / crew / setup / logistics lines derived from the recommended package, invoices get equipment
  hire, crew, transport and project management — each split so the lines sum to the ex-VAT subtotal of the
  stored VAT-inclusive total. Acme's two quotes and two invoices are the most detailed examples.
- `lib/breakdown.ts` holds the shared money maths: `breakdown(total, items)` → subtotal / VAT @ 15% / total,
  plus `rand()` South African formatting (`R 12 345`).

**API**

- `lib/admin-schema.ts` gained a `lines` field type, a `count` column render, `pdfPath` on a module, and
  `items` fields on quotes/invoices. `parseModuleInput()` validates the whole list at once (description
  required, qty ≥ 1, unit price ≥ 0) and recomputes `amount` server-side — the client never dictates money.
- `lib/admin-db.ts` writes breakdowns: `listRows()` includes items in order, `createRow` inserts them,
  `updateRow` replaces the list (items always arrive as the complete set), `deleteRow` relies on the cascade.
  Rows with zero items remain valid and fall back to a single total.
- **`GET /api/quotes/[id]/pdf`** and **`GET /api/invoices/[id]/pdf`** — `pdf-lib` (no font files, safe on
  Vercel serverless) renders an A4 document: dark STAGEGRID masthead, client meta block, itemised table with
  wrapped descriptions, subtotal / VAT / total block, footnotes (validity, booking reference, terms) and page
  numbers. Access is `401` without a session, `404` for a client who does not own the row (no leaking), `503`
  without a database; admins and staff can read any.

**UI**

- Client view (`QuotesInvoicesTab`): every quote and invoice is a card with its line-item table, a
  subtotal/VAT/total strip and a **PDF** button that opens the generated document; rows without items say so
  explicitly instead of pretending to a breakdown.
- Admin: `AdminCrud` renders the `lines` field as an inline editor (add/remove rows, live qty × price,
  running subtotal and incl.-VAT total), shows a `Lines` column, and adds a **PDF** action to every
  quote/invoice row.

**Verification**

- `tsc --noEmit`, `next lint`, `next build` and `npm run check:portal` clean — the render checks now include
  the itemised client view and the admin manage panel (10 checks).
- Local and production runs: quote/invoice lists carry their items, create-with-items → `201`, replacing the
  list → `200` with recomputed amounts, invalid line → `400`, delete → `200`; PDF endpoints answer `200` with
  a real `%PDF` for admin and the owning client, `404` for a different client and unknown ids, `401` anon;
  Kim's portal page shows the breakdown, the VAT strip and the PDF buttons.

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

- Email delivery (approval notices, sending quotes/invoices) — access is requested and activated in-portal.
- Payments/settlement against invoices, and an availability calendar that decrements stock while a booking
  holds equipment.
- A CSV bulk import and an audit trail of admin edits.
- The asset movement scan flow (Picked → Loaded → Returned) — the lifecycle statuses exist but are set by hand
  in the asset register.

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
