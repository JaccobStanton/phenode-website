# Agrela × PheNode — Creative Direction

_Working document for the website redesign. Everything below is grounded in the Summer 2025 PheNode Buyer's Guide, the Pilot Phase 2 R&D 2026 deck, the current agrelaeco.com, and public press (Danforth Center, The Ray). Nothing in the build claims a capability, number, customer, or quote that is not in one of those sources — anything else is a clearly labelled placeholder._

---

## 1. Brand visual direction — "Field Instrument"

**The idea.** PheNode is a scientific instrument that lives outdoors. The site should feel like the instrument: precise, quiet, physical, and calm — with the environment as the subject and the hardware as the lens. Not a SaaS site, not an agtech brochure, not a weather-station catalogue.

**Two worlds, one system.** The visual system is built on a deliberate contrast that the whole story depends on:

| | Physical world | Digital world |
|---|---|---|
| Surface | **PheNode white** `#FFFFFF` light-section backgrounds (the PheNode app's white, since 28 Oct 2026), **Paper** `#F4F2EC` warm soft white for text and fills on ink, **Stone** warm grays | **Ink** `#0E1012` charcoal, `#161A1D`, `#1F2428` |
| Accent | **Signal amber** `#E08A2E` — a measurement being taken, sensor activity, alerts | **Data cyan** `#5FB7C9` — a measurement that has become data (continuity with the real dashboard's midnight-blue/cyan UI) |
| Material | **Alloy** `#C8CCD0` / `#8F969C` aluminum, carbon-black solar | Hairline rules, mono labels, grid |
| Nature | **Moss** `#4C6B4A`, **Sage** `#8A9A78`, **Loam** `#7A5C3C`, **Clay** `#B08968` — used as tints in environment scenes, never as a wash | — |

A reading leaves the world as an amber pulse and arrives in the software as a cyan packet. That one rule is repeated in every diagram, so the visitor learns it without being told.

**Green is restrained.** Vegetation colors appear only inside environment scenes and the Agrela logo. Section backgrounds are ink or paper, never green.

**Typography.**
- Display + body: **Inter** (variable), the PheNode app's typeface (since 28 Oct 2026; Instrument Sans before). Headlines 600–700 at −0.03em; hero up to 96px desktop / 44px mobile. Body 17–19px, line-height 1.55.
- Data + labels: **Geist Mono** — eyebrows (`01 — ENVIRONMENT`), measurement values, spec numbers, chart axes. Oversized spec numerals use Inter 400 at 96–140px with mono units.
- No italics for emphasis; emphasis is weight and color.

**Composition.** 12-column grid, 1440px content max, 24px gutters (16px mobile). Sections breathe: 160px vertical rhythm on desktop, 96px mobile. Alternating ink/paper sections make every chapter visually distinct while the tokens keep them one system. Corners are small (6–10px) on controls, none on imagery. No card grids of equal boxes — every section has its own layout.

**Imagery.** Real Agrela renders (cut out from the Buyer's Guide with their alpha masks) are the hero objects: base station composite, wireless node (three angles), tower system, soil probes, water-potential sensor, profile probe. Environments are **built, not stocked**: procedural SVG/CSS scenes (horizon, contour lines, plot grids, a highway corridor, a city block map) that can later be swapped for real field photography through the asset manifest (`docs/asset-manifest.md`).

**Logo use.** The PheNode wordmark SVG (blue `#1A75E0` + cyan `#48F7F5` mark) and the Agrela Ecosystems logo are used as supplied; the Agrela wordmark gets a light variant for ink sections.

---

## 2. Homepage narrative

The visitor follows a single reading from the environment to a decision, then discovers they can build the system that makes that journey for their own question.

```
Environment → Measurement → Wireless node → Network → Base station → Data platform → Software → Insight → Decision
```

Beat by beat:

1. **Curiosity** — "Understand your environment." The instrument in a landscape; readings appear around it.
2. **Definition** — "One system. Built around your environment." The whole chain, animated, before any detail.
3. **Why it matters** — Hyperlocal environmental intelligence: one station can't describe a landscape.
4. **How it works** — a reading becomes a dataset, step by step, with the user in control.
5. **Perspective** — one sentence to complete: "I'm a [role] and I need to understand [question]." The rest of the page reorders itself around the role.
6. **Applications** — four cinematic chapters (Roadside & fire weather, Agriculture & the research pipeline, Ecology & restoration, Urban heat).
7. **Hardware** — the node in 3D, the base station annotated, sensors attach.
8. **Scale** — 1 → 10 → 100 → regional network.
9. **Build your PheNode** — the configurator, previewed.
10. **Software** — the dashboard across devices; configurable modules.
11. **Your data** — dashboards & downloads for everyone, API & dockerized backend for power users.
12. **Proof** — only verified facts; placeholders where permission is pending.
13. **Case studies** — editorial, public deployments first.
14. **Final moment** — the whole system together. "Build around the environment you need to understand."

---

## 3. Section-by-section storyboard (homepage)

| # | Section | Background | Visual | Key motion |
|---|---|---|---|---|
| 01 | Hero | Ink, atmospheric horizon | Base-station composite render, isolated, large | Readings (amber) fade in around the hardware; a slow parallax drift; a single pulse travels to the control box and turns cyan |
| 02 | What is PheNode | Paper | Vertical system chain: Environment → Nodes → Base Station → Data Platform → Software/API → Decisions | Scroll-scrubbed: each stage lights as it enters; particles move down the spine |
| 03 | Hyperlocal | Ink | Field map: one station → variation heatmap → distributed nodes; TRADITIONAL vs PHENODE comparison | Three scroll states; the map "resolves" as nodes are placed |
| 04 | How it works | Paper | Horizontal data journey: Sensors → Node → Base Station → Backend → Processing → Database → Dashboard → Download/API | Pinned; one packet travels the whole path as you scroll; capability notes appear at each stop |
| 05 | Perspective | Ink | Fill-in sentence ("I'm a … and I need to understand …"); the role and question words open grouped lists, the questions led by the role's own | Picking a role re-orders the chapters below with layout animation; the answer is always on screen: a demo deployment with two nodes' readings, and the starting point (environment → deployment → sensors → data → software → insight → configuration) |
| 06 | Applications | Full-bleed chapters | Roadside corridor with nodes at intervals; fire-weather state; research field with plots; growth chamber → greenhouse → field pipeline; ecosystem contours; city block map 92°F → hyperlocal | Each chapter is a mini scroll story; hardware persists while the environment changes |
| 07 | Hardware | Paper (studio) | R3F wireless node (rotate, exploded view, hotspots); base station render with annotated hotspots; sensors attach | Pointer-driven rotation; exploded view on scroll; hotspots reveal short technical notes |
| 08 | Scale | Ink | Network graph: 1 → 5 → 20 → 50+ nodes → corridor → region | Nodes bloom outward from the base station; links draw |
| 09 | Build teaser | Paper | Mini configurator preview | Node count ticks; scene instruments itself |
| 10 | Software | Ink (dashboard-continuous) | Device frames (desktop, laptop, tablet, phone) with illustrative dashboard UI; a packet flies from the field into the screen; screen expands to fill viewport; software module picker | Pinned expand; charts draw |
| 11 | Your data | Paper | Two-lane diagram: typical users / advanced users | Static with staged reveal |
| 12 | Proof | Ink | Verified numbers only (founded 2016 at the Danforth Center; commercial since 2023; deployments with The Ray / GDOT (18-mile I-85 pilot), WSDOT, Danforth). Retention stat rendered only when `VERIFIED_CLAIMS.pilotRetention` is true | Count-up on enter |
| 13 | Case studies | Paper | Editorial teasers | Image parallax |
| 14 | Final CTA | Ink | Full system composite | Slow assembly |

---

## 4. Animation choreography

**Principles:** scientific, controlled, physical. Motion explains; it never decorates.

- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; `power2.inOut` for scrubbed diagrams. Durations 0.5–1.2 s. No bounce, no elastic.
- **Scroll:** GSAP ScrollTrigger with `scrub: 0.8` for diagrams and pinned sequences; `once: true` reveals for text. Pinned sections are limited to three (How it works, Software expand, Zoom journey) to keep the page from feeling like a slideshow.
- **Micro-motion (Motion):** layout animations for the role-driven reordering; hover states on hardware hotspots; configurator step transitions.
- **Pulses:** a single reusable `DataPulse` primitive animates a dot along an SVG path with a fading trail; amber before the control box, cyan after.
- **Reduced motion:** `prefers-reduced-motion` switches every scrubbed sequence to its end state, disables pulses and 3D auto-rotation, and keeps opacity-only reveals. All information in animations is also present as text.
- **Performance budget:** one WebGL canvas on the page at a time (node explorer), lazy-mounted when near the viewport; particles are SVG/CSS; images are responsive WebP; GSAP/Three are code-split.

---

## 5. 3D interaction strategy

Both products are real-time models built from the CAD exports (`public/models/*.glb`, React Three Fiber):

1. **Wireless sensor node.** Drag to rotate, slow turntable when idle, exploded view (solar panel and lid lift, bracket, ports and vent drop), hotspots: solar / LoRaWAN antenna / light sensor / battery & USB-C / ambient air / soil probe ports (2) / mounting bracket. Selecting a part turns it to the camera and tints it in the signal colour.
2. **Base station.** The same viewer on the light studio surface, rocking gently about the front view; hotspots for rain gauge, solar, wind, air, control box, imager, soil sensor ports and aluminum frame. The hero keeps the annotated v4 render (`hardware/base-station-v4`).

Mobile: the 3D canvas renders at capped DPR with auto-rotate only; below 640px a pre-rendered angle fallback is used if WebGL is unavailable.

---

## 6. Data visualization strategy

- **Charts** are SVG, drawn in-page (no chart library): time series for soil moisture, air temperature, humidity; small multiples for sensor comparison; a node-status strip. Axes and labels in Geist Mono; series colors from a fixed set (cyan, amber, sage, alloy) that match the configurator and diagrams.
- **Demo data** is generated deterministically (seeded) to look like real diurnal cycles and rain events, and every chart carries a "Demo data" tag. No performance claims are drawn.
- **Maps** are stylized: a plot grid for research fields, a corridor line for highways, a block map for cities. No real customer coordinates.
- **Heat/variation** uses a sequential amber↔cyan ramp so "hotter/drier" and "cooler/wetter" read instantly and remain legible for color-blind viewers (luminance also varies).

---

## 7. System architecture visualization

A clean vertical stack for technically sophisticated visitors:

```
Sensors (onboard + add-on, SDI-12 / RS-485)
→ Wireless Sensor Node (LoRaWAN, solar + battery, up to 2 soil probes)
→ Wireless network (up to 1 km line-of-sight per node)
→ PheNode base station (control box: controller, sensor connections, power, cellular / Wi-Fi)
→ Backend (ingest API, dockerized)
→ Storage / processing (time-series database, cleaning preferences)
→ PheNode software (dashboard, fleet, wireless network, imaging, downloads)
→ API / CSV downloads / external tools (Grafana)
```

"View technical architecture" expands the same diagram with the second layer of detail (connectivity options, data plan, portable backend) without leaving the page.

---

## 8. Design Your System — the configurator

A seven-step visual assembly, built as a dedicated page and previewed on the homepage.

1. **Application** — Environmental Intelligence · Agricultural Research · Soil Monitoring · Transportation · Restoration · Fire Weather · Urban Heat · Ecological Research · Custom
2. **Scale** — Single location · Research plot · Field · Transportation corridor · Restoration site · Campus · Urban network · Custom (the scene changes shape)
3. **Base station** — animates into the scene; connectivity choice (cellular / Wi-Fi); tower option
4. **Wireless nodes** — stepper 1…100; the scene instruments itself
5. **Configure nodes** — click a node → categories SOIL / WEATHER / PLANT / WATER / CUSTOM-THIRD-PARTY; sensors attach visually; up to 2 soil probes per node is enforced from the real spec
6. **Software** — Dashboard · Visualization · Downloads · Data cleaning · API · Dockerized backend · Custom integration (only real offerings)
7. **Your system** — exploded overview with oversized counts, a reference ID (e.g. `PHN-7K2Q`), "Talk to Agrela about this system" → lead form pre-filled with the configuration; "Save configuration" stores it locally and in the URL.

A **guided mode** ("I'd rather answer questions") asks what to monitor, area size, measurement frequency, and whether sensors already exist, and proposes a starting configuration — presented as guidance, not a quote.

---

## 9. Case-study presentation

Editorial, not cards: full-bleed opening image (placeholder until photography is cleared), a mono "data strip" (PROJECT · LOCATION · PARTNER · DEPLOYMENT · MEASUREMENTS), then long-form sections — Challenge, PheNode deployment, Data collected, Result/insight — with a timeline (e.g. 2025 Installation → 2026 Establishment → 2027 Vegetation development) and charts animating beside photography. Public deployments (The Ray / Georgia DOT I-85 pilot; Danforth Center research; WSDOT expansion) are presented with only publicly reported facts; everything else is a labelled placeholder awaiting customer permission.

---

## 10. Conversion journey

Curiosity → Understanding PheNode → Understanding the system → Seeing their own application → Technical confidence → Exploring a configuration → Contacting Agrela.

- **Primary actions:** Request a Demo (nav, hero), Design Your System (hero, hardware, scale, final), Talk to Agrela (configurator summary, contact).
- **Secondary:** Explore PheNode, View Case Studies, View Documentation, View Specifications.
- **Personalization** changes CTA language per role (e.g. "Plan a corridor deployment" for infrastructure managers, "Instrument a trial" for crop researchers).
- **Lead capture** happens where intent is highest: the end of the configurator (with the configuration attached) and the contact page (qualifying fields: project type, application, number of locations/nodes, sensors of interest, timeline). Forms are progressive and short.
- **Trust** is placed next to the claim it supports (testimonial slots inside agriculture, data/software, configurability, and support sections — populated only when quotes are approved).
