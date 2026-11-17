# Agrela × PheNode website

Marketing site for Agrela Ecosystems and the PheNode environmental monitoring platform. React + Vite, Tailwind v4, GSAP ScrollTrigger, Motion, React Three Fiber. Static output — deploy anywhere that serves files.

Start with `docs/creative-direction.md` (brand, narrative, storyboard, motion and 3D strategy) and `docs/asset-manifest.md` (where real photography, screenshots and GLB models drop in).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # serve dist/ on :4173
npm run lint
```

Node 20+. Fonts are self-hosted (`@fontsource-variable/inter`, the PheNode app's font, and `@fontsource-variable/geist-mono`) — no third-party requests at runtime.

### Environment

| Variable | Purpose |
|---|---|
| `VITE_LEAD_ENDPOINT` | Optional. POST target for the contact / configurator forms (JSON body: name, organization, email, projectType, application, locations, sensors, timeline, message, intent, attachment). Without it, forms open a prefilled email to `support@agrelaeco.com` and offer a copy button. |
| `VITE_BASE` | Optional. Base path when hosting under a sub-path (e.g. `/preview/`). |
| `VITE_ROUTER` | Optional. `hash` switches to a hash router for hosts that cannot rewrite deep links to `index.html`. |
| `VITE_DOCS_SOURCE` | Optional. `agrelaeco` links the Support PDFs to agrelaeco.com's copies instead of `public/docs/` (used for the Claude preview, which can't hold files over 15 MB). |

### Deploy

The build is static. For history-mode routing, rewrite all paths to `/index.html` (Netlify `_redirects`, Cloud Run with nginx `try_files`, a GCS bucket behind a load balancer with a 404 → index rewrite, or Vercel's default). Otherwise build with `VITE_ROUTER=hash`.

**Netlify (progress preview):** GitHub `JaccobStanton/phenode-website` is connected to Netlify, which builds every push to `main`. `netlify.toml` sets the build (`npm run build` → `dist`, Node 22) and sends `X-Robots-Tag: noindex, nofollow` on every page so the preview stays out of search engines. **Delete that `[[headers]]` block at launch.** Deep links use `public/_redirects`.

## Structure

```
src/
  data/            specs (Buyer's Guide numbers), sensors, applications/roles/needs, case studies, docs, nav, company
  lib/             motion helpers (GSAP/ScrollTrigger, reduced-motion, reveal, scroll progress), seeded demo data
  context/         PersonalizationContext — role + "need" selection, persisted in localStorage
  components/
    ui/            primitives (Section, Eyebrow, Button, Img, Stat, Tag, AssetPlaceholder), logos, SpecTable
    layout/        Nav (surface-aware), Footer, Page
    viz/           SVG storytelling: SystemChain, DataJourney, HyperlocalField, scenes (field/corridor/city/ecosystem/greenhouse/chamber),
                   ExplorerScene, EnvironmentTransition, ScaleNetwork, ArchitectureDiagram, MiniChart, DataPulse
    three/         ProductModel3D (GLB viewer: parts, hotspots, exploded view) + nodeHotspots
    hardware/      NodeExplorer + BaseStationExplorer (3D + hotspot list + fallback), BaseStationHotspots (annotated 2D fallback), PartExplorer (hero)
    software/      DashboardMock (illustrative dashboard), DeviceFrame (monitor/laptop/tablet/phone)
    configurator/  configModel (pure), ConfigScene, Configurator (7 steps), LeadForm
  sections/home/   one file per homepage chapter, in story order
  pages/           routed pages
scripts/           Playwright screenshots, interaction flows, axe audit; models/ builds the GLBs in public/models
docs/              creative direction, asset manifest
public/assets/     WebP assets (see docs/asset-manifest.md), public/docs/ documents, public/models/ GLB drop-in points
```

## Content rules baked in

- Every number comes from the PheNode Summer 2025 Buyer's Guide or agrelaeco.com (`src/data/specs.js`). No invented specifications.
- Named partners and dates come from public press (Danforth Center, The Ray, AP News); anything beyond that is a labelled placeholder (`src/data/caseStudies.js`). The individual case study pages are hidden for now (`FEATURES.caseStudyPages`): the Case Studies page, the home "Case studies" rows and the application pages link to each deployment's press releases (`press` in `caseStudies.js`), and `/case-studies/<slug>` redirects to `/case-studies`.
- Charts and maps use seeded demo data and carry a "Demo data" tag. The dashboard is an illustrative recreation of the real GUI's features only.
- Claims awaiting verification are gated behind `VERIFIED_CLAIMS` in `src/data/specs.js`. The pilot-customer retention figure is not shown at all (Jake's PM, Nov 16: not public).
- Pricing is intentionally omitted. The Buyer's Guide is hidden for now (`FEATURES.buyersGuide`): its Resources entry and the "Source: … Buyer's Guide" credits. Its PDF moved to `media-src/docs/` so it isn't published. Its numbers still back `specs.js`.
- The privacy policy (`/legal/privacy`) and terms of service (`/legal/terms`, `src/data/legalTerms.jsx`) are Agrela's updated November 2026 versions, copied word for word from the text Jake sent (Nov 16), typos included. The privacy policy's mention of the Terms of Service links to `/legal/terms` instead of printing the agrelaeco.com address.
- Support (`/support`) is one list of documents by version, as on agrelaeco.com/support (`src/data/docs.js`). The PDFs are copies of agrelaeco.com's, in `public/docs/` (current) and `public/docs/archive/`. The Claude preview build sets `VITE_DOCS_SOURCE=agrelaeco` to link to agrelaeco.com's copies instead (the preview can't hold files over 15 MB).
- The home page's "Application experiences" and "Hardware" sections are hidden for now (`FEATURES.homeApplications`, `FEATURES.homeHardware`); the home sections after them are renumbered (Software is 06), and the Applications and PheNode pages are unaffected. In home "Software", the screenshots, the Precipitation part, "What the software does today" and "Configurable software" are hidden too (`FEATURES.homeSoftwareDetails`); "Explore the software" sits under the recording. Home "Case studies" is hidden as well (`FEATURES.homeCaseStudies`; the Case Studies page is unaffected).
- Customer quotes (`TestimonialSlot`) are hidden for now (`FEATURES.customerQuotes`); they render as labelled placeholders until approved quotes exist. Nadia's quotes (home, Company, Support) stay.

## Personalization

Home 05 is a sentence to complete: "I'm a [role] and I need to understand [question]." Picking a role reorders the application chapters and changes CTA language; the question shows a demo deployment and a suggested starting point, and pre-fills the configurator (`/design-your-system?need=soil`). Until a role is picked the sentence shows an example and nothing is reordered. Both persist in `localStorage` under `agrela.personalization.v1`.

## Configurator

**Switched off for now** (`FEATURES.designSystem = false` in `src/data/features.js`): the page, its navbar tab, the menu and footer buttons, home "Build your PheNode" and every button or chip that leads to it are hidden, and `/design-your-system` redirects to Contact. Set the flag to `true` to bring it all back (the home section numbers adjust themselves, `src/data/homeSections.js`).

`/design-your-system` — seven visual steps or a four-question guided mode. Configurations save to `localStorage` (`agrela.config.v1`) and to the URL (`?c=…`) with a reference ID (`PHN-XXXXXX`, a hash of the configuration). "Talk to Agrela about this system" attaches the configuration to the lead form.

## Accessibility & motion

Semantic landmarks, skip link, keyboard-operable hotspots and configurator, visible focus rings, alt text on every image, `aria-pressed`/`role="switch"` on toggles, WCAG AA contrast (axe: 0 violations across routes at 1440 px and 390 px — `node scripts/a11y.mjs` against a preview server). `prefers-reduced-motion` switches every scrubbed sequence to its end state, stops pulses and 3D auto-rotation, and keeps opacity-only reveals. No information lives only in animation.

## Performance notes

Code-split by route and by library (`react`, `motion`, `three` chunks); the 3D canvas mounts only near the viewport and pauses its frame loop off-screen; images are responsive WebP with lazy loading (hero is eager + high priority); pulses are SVG SMIL, not JS; fonts are variable WOFF2 subsets.

## Scripts

```bash
node scripts/screenshots.mjs           # every route at desktop/tablet/mobile (preview server on :4173)
node scripts/sectionshots.mjs / 1440 '#hyperlocal' '#scale'
node scripts/flow-home.mjs 390         # role → explorer → hotspots → modules
node scripts/flow-configurator.mjs     # walks all seven configurator steps
node scripts/a11y.mjs                  # axe-core audit
```
