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

Node 20+. Fonts are self-hosted (`@fontsource-variable/inter`, the PheNode app's font, and `@fontsource-variable/geist-mono`) — no third-party requests at runtime, except Google Analytics on the live site (see Analytics below).

### Environment

| Variable | Purpose |
|---|---|
| `VITE_LEAD_ENDPOINT` | Optional. POST target for the contact form (JSON body: name, organization, email, projectType, application, locations, sensors, timeline, message, intent, submittedAt, page). Without it, the form opens a prefilled email to `support@agrelaeco.com` and offers a copy button. |
| `VITE_BASE` | Optional. Base path when hosting under a sub-path (e.g. `/preview/`). |
| `VITE_ROUTER` | Optional. `hash` switches to a hash router for hosts that cannot rewrite deep links to `index.html`. |
| `VITE_DOCS_SOURCE` | Optional. `agrelaeco` links the Support PDFs to agrelaeco.com's copies instead of `public/docs/` (used for the Claude preview, which can't hold files over 15 MB). |
| `VITE_SITE_URL` | Optional. The site's public address, for the link-preview image (`og:image` in `index.html`; crawlers need a full address). Default `https://agrela-website.web.app`. Since Nov 18, `.env.production` on Jake's Mac (not in git) sets `https://phenode.com`, so deploys from there use it; a build anywhere else (Netlify, a fresh clone) uses the default unless it's set there too. |
| `VITE_MODEL_SUFFIX` | Optional. `.js` makes the 3D viewers load JS module twins of the models (`models/<name>.glb.js`, made with `scripts/models/module-twin.mjs`: the GLB as base64, meshopt removed). For hosts that can't serve `.glb` files, like the Claude preview. A module loads like the site's own code; the earlier glTF-JSON twins needed a `data:` fetch and WebAssembly, which a strict content policy blocks. |

### Deploy

The build is static. For history-mode routing, rewrite all paths to `/index.html` (Netlify `_redirects`, Cloud Run with nginx `try_files`, a GCS bucket behind a load balancer with a 404 → index rewrite, or Vercel's default). Otherwise build with `VITE_ROUTER=hash`.

**Netlify (progress preview):** GitHub `JaccobStanton/phenode-website` is connected to Netlify, which builds every push to `main`. `netlify.toml` sets the build (`npm run build` → `dist`, Node 22), sends `X-Robots-Tag: noindex, nofollow` on every page so the preview stays out of search engines (**delete that `[[headers]]` block at launch**), and lets browsers keep the hashed build files in `/static/` for a year. Deep links use `public/_redirects`.

**Firebase Hosting (project `agrela-website`):** `firebase.json` serves `dist` with an SPA rewrite (`**` → `/index.html`, the Firebase equivalent of `_redirects`) and also sends `X-Robots-Tag: noindex, nofollow` on every page, including on phenode.com once the domain is connected. **Delete that `X-Robots-Tag` entry at launch**, together with Netlify's. Its other `headers` entries (keep them): the hashed build files in `/static/` are cached for a year, as on Netlify, and pages (`/`, `/index.html` and any address without a file extension) are re-checked on every visit, so a browser never runs an hour-old page against a new deploy's files (Firebase caches for an hour by default). Firebase doesn't build: run `npm run build` (Node 22) and then `firebase deploy --only hosting`.

**Link previews (Nov 18).** Slack, iMessage, LinkedIn and the like read the tags in `index.html` without running the site, so every address shares one card: "PheNode by Agrela — Hyperlocal Environmental Intelligence", the `og:description`, and `public/og-image.jpg` (1200×630). The image needs a full address, filled in from `VITE_SITE_URL` (above). The favicon is the Agrela mark as `favicon.ico` (16/32/48), `icon-192.png` and `apple-touch-icon.png` (180): Safari and Slack don't show SVG icons. Slack keeps a link's preview for a while, so a link shared before a change can show the old one.

**Analytics (Nov 18).** Google Analytics through Firebase (project `agrela-website`, measurement ID `G-K56W00D5EV`), in `src/lib/analytics.js`, started from `src/main.jsx`. It runs only on the live site: a production build without `VITE_ROUTER`, not served from localhost (`npm run preview`) or `*.netlify.app`, in a browser where `isSupported()` holds. The Firebase code is fetched once the page has loaded. Page changes inside the site (no reload) are counted by Google Analytics' enhanced measurement, "Page changes based on browser history events" (web stream settings); the site doesn't log page views itself, which would count them twice. To check after a deploy: Realtime report, go from `/phenode` to `/contact`, and a second `page_view` should appear. The privacy policy mentions analytic services in general but doesn't name Google Analytics.

## Structure

```
src/
  data/            specs (Buyer's Guide numbers), sensors, applications/roles/needs, case studies, docs, nav, company, base station parts
  lib/             motion (reduced motion, reveal, easing, count-up; no GSAP), scroll (GSAP ScrollTrigger, scroll progress),
                   pages (the route chunks, preloaded on link intent), intro (the home intro's header state), seeded demo data
  context/         PersonalizationContext — role + "need" selection, persisted in localStorage
  components/
    ui/            primitives (Section, Eyebrow, Button, Img, Tag, AssetPlaceholder), logos, SpecTable, SentenceSelect
    layout/        Nav (surface-aware), Footer, Page
    viz/           SVG storytelling: SystemChain, DataJourney, HyperlocalMap, scenes (field/corridor/city/ecosystem/greenhouse/chamber),
                   ExplorerScene, EnvironmentTransition, ScaleNetwork, ArchitectureDiagram, MiniChart, DataPulse;
                   sensorField (the home intro's canvas), drawn in a worker where possible (sensorFieldHost, sensorField.worker)
    three/         ProductModel3D (GLB viewer: parts, hotspots, exploded view) + nodeHotspots
    hardware/      NodeExplorer + BaseStationExplorer (3D + hotspot list + fallback), BaseStationHotspots (annotated 2D), PartExplorer + PartDetail (home hero), SensorAddOns, SystemPair
    software/      DeviceFrame (monitor/laptop/tablet/phone)
    media/         real software captures (Screen, ScreenCard, PhoneScreen) and LoopVideo
    forms/         LeadForm (the contact form)
  sections/home/   one file per homepage chapter, in story order; AfterIntro builds them below the intro
  sections/phenode/ the PheNode page's hero and its parts (Base station, Wireless sensor node, Data platform, Software)
  pages/           routed pages
scripts/           Playwright screenshots, interaction flows, axe audit (browser.mjs: shared launcher); models/ builds the GLBs in public/models
docs/              creative direction, asset manifest
public/assets/     WebP assets (see docs/asset-manifest.md), public/docs/ documents, public/models/ GLB drop-in points
```

## Content rules baked in

- Every number comes from the PheNode Summer 2025 Buyer's Guide or agrelaeco.com (`src/data/specs.js`). No invented specifications.
- Named partners and dates come from public press (Danforth Center, The Ray, AP News) (`src/data/caseStudies.js`). There are no individual case study pages (deleted Nov 17, Jake): the Case Studies page and the application pages link to each deployment's press releases (`press` in `caseStudies.js`), and `/case-studies/<slug>` redirects to `/case-studies`.
- Charts and maps use seeded demo data and carry a "Demo data" tag. Software views are captures of the real PheNode software.
- The pilot-customer retention figure is not shown at all (Jake's PM, Nov 16: not public).
- Pricing is intentionally omitted. The Buyer's Guide isn't offered on the site (its Resources entry and "Source: … Buyer's Guide" credits were deleted on Nov 17); its PDF is in `media-src/docs/`, unpublished, and its numbers still back `specs.js`.
- The privacy policy (`/legal/privacy`) and terms of service (`/legal/terms`, `src/data/legalTerms.jsx`) are Agrela's updated November 2026 versions, copied word for word from the text Jake sent (Nov 16), typos included. The privacy policy's mention of the Terms of Service links to `/legal/terms` instead of printing the agrelaeco.com address.
- Resources › API (`/resources/api`, `src/pages/Api.jsx`) is "API Instructions for phenode.live" (September 2026), word for word from the PDF Jake sent on Nov 18, with each command in a block with a Copy button (`src/components/ui/CodeBlock.jsx`). Its help address is the PDF's, support@phenode.com.
- Support (`/support`) is one list of documents by version, as on agrelaeco.com/support (`src/data/docs.js`). The PDFs are copies of agrelaeco.com's, in `public/docs/` (current) and `public/docs/archive/`. The Claude preview build sets `VITE_DOCS_SOURCE=agrelaeco` to link to agrelaeco.com's copies instead (the preview can't hold files over 15 MB).
- The home page runs: intro, hero (01), What is PheNode, Hyperlocal, How PheNode works, Choose your perspective, Software (06), Scale, Your data, Proof, and the closing section (`src/data/homeSections.js` numbers them). Its "Application experiences", "Hardware", "Build your PheNode" and "Case studies" sections, and the extra parts of home "Software", were hidden from Nov 15 and deleted on Nov 17 (Jake), together with the feature flags that hid them (`src/data/features.js`).
- The PheNode tab is one long page (`/phenode`, `src/pages/PheNode.jsx`): the overview, then the Base station, Wireless sensor node, Data platform and Software parts, each at `/phenode#<part>`. `PHENODE_PARTS` in `src/data/navigation.js` sets their order for the page, the header menu and the footer. The old addresses (`/phenode/base-station` and the like) lead to their part.
- On the PheNode page, the overview's "Technical capabilities" and "System architecture" were deleted on Nov 17, with the two "Specifications" links (footer, Resources) that led there; so were the Software part's "Capabilities" and "Configurable modules" and the Wireless sensor node's "Indoors and out". The Data platform part keeps its own System architecture section.
- There are no customer quotes on the site (the placeholder slots were deleted on Nov 17). Nadia's quotes (home, Company, Support) stay.

## Personalization

Home 05 is a sentence to complete: "I'm a [role] and I need to understand [question]." Picking a role reorders the Applications page (its own application first); the question shows a demo deployment and a suggested starting point. Until a role is picked the sentence shows an example and nothing is reordered. Both persist in `localStorage` under `agrela.personalization.v1`.

## Accessibility & motion

Semantic landmarks, skip link, keyboard-operable hotspots and explorers, visible focus rings, alt text on every image, `aria-pressed`/`role="switch"` on toggles, WCAG AA contrast (axe: 0 violations across routes at 1440 px and 390 px — `node scripts/a11y.mjs` against a preview server). `prefers-reduced-motion` switches every scrubbed sequence to its end state, stops pulses and 3D auto-rotation, and keeps opacity-only reveals. No information lives only in animation.

## Performance

Measured with Lighthouse 12 on the production build served compressed (Nov 17): mobile 91–95 and desktop 100 on the home, PheNode, Case Studies, Contact and application pages; no layout shift anywhere. What keeps it there:

- **Code split by page and by library.** Every page is its own chunk (`src/lib/pages.js`); React, GSAP, Motion and three.js are separate vendor chunks (`vite.config.js`). GSAP comes only with the pages that have scroll-driven sections (home, PheNode, applications): the rest of the motion helpers don't need it (`lib/motion.js` vs `lib/scroll.js`). Motion comes only with the home hero; three.js only when a visitor opens a 3D model.
- **The landing page's code starts with the HTML.** A small inline script that `vite.config.js` writes into `index.html` adds `modulepreload` links for the chunks of the page being opened, so they download alongside the app's own instead of a round trip later. Hovering, focusing or touching a link starts loading that page (`usePreloadOnIntent` in `App.jsx`).
- **The home intro has the device to itself first.** The rest of the home page is fetched about a second after the intro starts, on the visitor's first scroll, touch or key, or when they choose "Explore PheNode" (which waits for the hero), and it's built a section at a time in idle moments (`pages/Home.jsx`, `sections/home/AfterIntro.jsx`). The intro's sensor field is drawn in a worker on an OffscreenCanvas where the browser supports it, so its frames never hold up the page (`components/viz/sensorFieldHost.js`); otherwise, and with reduced motion, it's drawn on the page.
- **Fonts and caching.** Inter's Latin subset is preloaded; fonts are self-hosted variable WOFF2 subsets. Hashed build files live in `/static/` and are cached for a year (`netlify.toml`); images, video and models keep their names in `/assets/` and are re-checked.
- **Images.** Responsive WebP with `srcset`/`sizes`, lazy below the fold, eager and high priority for each page's largest image. The base station render has 600–2400 px widths so phones get close to what they need, and its hover spotlight uses an 8 KB silhouette mask instead of the render itself.
- **Safari draws on the page's own thread** (Chrome paints on separate threads), so an effect that costs nothing in Chrome can stall Safari whenever it has to be redrawn: blend modes and SVG masks over large areas, blur and drop-shadow filters on big images, an animated `clip-path`. The home hero's close-ups were tuned for it on Nov 18, measured in Safari with `scripts/hero-lab-safari.js`: no grain overlay on the hero, its background lines faded by their stroke's gradient (no mask) in a layer of their own, a card clip that switches instead of animating, and the station's glide on the Web Animations API. Check new animations in Safari too.
- **Pages reserve their height while they load** (the `Loading` fallback is a screen tall), so the footer never jumps. The 3D canvas mounts only near the viewport and pauses off screen; pulses are SVG SMIL, not JS.

To measure: `npm run build`, serve `dist/` with compression (any static server with brotli or gzip, as Netlify does), then `npx lighthouse <url> --only-categories=performance` (add `--preset=desktop` for desktop).

## Scripts

The scripts use Playwright's Chromium (`npx playwright install chromium`), or the browser at `CHROMIUM_PATH`.

```bash
node scripts/screenshots.mjs           # every route at desktop/tablet/mobile (preview server on :4173)
node scripts/sectionshots.mjs / 1440 '#hyperlocal' '#scale'
node scripts/flow-hero.mjs 1440        # the home hero's component explorer
node scripts/flow-howitworks.mjs       # home 04 at each stop of the journey
node scripts/a11y.mjs                  # axe-core audit
node scripts/hit-scan.mjs              # buttons and links covered by another element
```

`scripts/hero-lab-safari.js` isn't run with node: paste it into Safari's console on the home page (`npm run build`, `npm run preview`). It opens and closes hero close-ups with one effect switched off at a time and shows each variant's longest frames, for checking animations in Safari, which Playwright's Chromium doesn't show (Nov 18).
