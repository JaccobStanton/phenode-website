# Asset manifest

Where real media drops into the site, with the sizes each slot expects. Every slot already renders either a real Agrela render (cut out from the Summer 2025 Buyer's Guide with its alpha mask) or a clearly labelled placeholder, so the site is complete without any of the items below — but each one makes it better.

All raster assets are served from `public/assets/` as WebP with width variants (`name-{width}.webp`); the `<Img>` primitive builds the `srcset`. AVIF variants can be added alongside with the same naming. Keep the largest variant ≤ 400 KB where possible.

## Hardware (in place — from the Buyer's Guide)

| Slot | File(s) | Variants | Notes |
|---|---|---|---|
| Base station, front render (v4, 2026) | `hardware/base-station-v4` | 600 · 1000 · 1600 · 2400 (2400×1625) | Transparent; used in hero, base-station page, Overview card and the 2D fallback of the 3D explorer |
| Full system (node + base station) | `hardware/system-composite` | 600 · 1000 · 1600 · 2400 (2400×1449) | Transparent; final CTA, overview, configurator summary. Still shows the older node and base station |
| Wireless node, front (2026) | `hardware/wireless-node-2026` (from `Wireless Sensor Node.png`) | 320 · 600 · 880 (880×930) | Transparent; node page hero, 3D fallback |
| Base station on the tower (2026) | `hardware/base-station-pole-2026` (from `PheNode rendering with pole 2026.png`) | 460 · 910 (910×2015) | Transparent; base-station page ("Tower configuration") and home → 02 What is PheNode |
| Standard soil sensor | `hardware/sensor-soil-standard` | 400 · 700 · 1100 | Transparent |
| Water potential sensor (2026) | `hardware/sensor-water-potential-2026` (from `Teros 22.png`) | 400 · 700 | Transparent; home Hardware sensor card |
| Ambient air sensor | `hardware/sensor-atmos-14` (from `Atmos 14.png`) | 300 · 590 | Transparent; base station explorer info card when "Ambient air" is selected (`photo` in `baseStationParts.js`) |
| Soil profile probe | `hardware/sensor-profile-probe` (260) · `sensor-profile-probe-angle` (400 · 800 · 1400) | — | Transparent |
| Node with two soil probes | `hardware/wireless-node-with-probes` | 400 · 680 | Transparent; still shows the older node (with the radiation shield) |

**Wanted:** a studio shot of the base station from the side (`hardware/base-station-side`, ≥ 2400 px wide, transparent) and an exploded view (`hardware/node-exploded`, ≥ 1600 px, transparent). Both slots are optional; the 3D explorer covers the exploded view today.

## Data-journey illustrations (in place — home → 04 How PheNode works)

SVGs in `public/assets/journey/`, one per stop of the data path. They crossfade in the stage panel beside the title as the visitor scrolls (`JourneyStage.jsx`) and appear as thumbnails in the mobile list (`JourneyList art`).

| Stop | File | Source |
|---|---|---|
| Sensors | `journey/sensors.svg` | PheNode app `src/assets/diagrams/Soil_Probe.svg` (svgo-minified) |
| Wireless node | `journey/node.svg` | PheNode app `src/assets/diagrams/Wireless-Sensors.svg` (hidden layers removed by svgo: 231 → 38 KB) |
| Base station | `journey/base.svg` | PheNode app `src/assets/diagnostics/Diagnosics_Wireframe.svg` (the System Diagnostics wireframe) |
| Backend · Processing · Database · Dashboard · Download / API | `journey/{backend,processing,database,dashboard,export}.svg` | Drawn to match the app diagrams (#0d56ff outlines, navy fills, #48f7f5 lights) — regenerate with `python3 scripts/gen-journey-art.py public/assets/journey` then run svgo |

To swap in a designer-made drawing, replace the file with the same name; anything with a transparent background and roughly 4:3 to 3:2 proportions sits correctly.

## Logos (in place)

`logos/agrela-ecosystems-dark-{400,800,1600}.webp`, `logos/agrela-ecosystems-light-{…}.webp` (wordmark recolored to paper for ink backgrounds), `logos/agrela-icon-{128,256}.webp`. The PheNode wordmark is inline SVG (`src/components/ui/Logos.jsx`) from the official logo file.

## Environmental photography (placeholders today)

Slots render a labelled `AssetPlaceholder` until real photography exists. For an application hero, export `photos/<name>-{800,1600,2400}.webp` and add `photo: { name, alt, position }` to that application in `src/data/applications.js` — `Application.jsx` renders it with `<Photo>` (`src/components/media/media.jsx`) and falls back to the placeholder otherwise. Use only Agrela's own photography of real deployments (the Oct 6 stock/editorial set was removed at Jake's request).

| Slot | Suggested path | Size / ratio | Component |
|---|---|---|---|
| Application heroes (transportation, agriculture, ecology, urban) | `photos/<name>-{800,1600,2400}.webp` | 21:9, ≥ 2400 wide | `pages/applications/Application.jsx` via `data/applications.js` |
| Case study opener | `case-studies/<slug>/opener-{1200,2400}.webp` | 2:1, 2400×1200 | `pages/CaseStudy.jsx` |
| Case study deployment (real site photos) | `case-studies/<slug>/deployment-{800,1600}.webp` | 4:3 | same (Danforth currently shows a software screenshot) |
| Case study timeline photos | `case-studies/<slug>/<year>-{800,1600}.webp` | 16:9 | same |
| Case study teaser | `case-studies/<slug>/teaser-{600,1200}.webp` | 4:3 | `sections/home/CaseStudiesTeaser.jsx`, `pages/CaseStudies.jsx` |
| Team / lab photography | `company/team-{800,1600}.webp` | 4:3 | `pages/Company.jsx` |

## Software screenshots (in place — captured from phenode.live, 7 Oct 2026)

Captured by Claude from the live software (admin account, read-only browsing) at a 1440 × 900 browser size and 2× pixel density, stitched from tiles into 2880 × 1800 masters, and exported to `public/assets/software/<key>-{1200,2400}.webp` (1200 × 750 / 2400 × 1500, ratio 8:5). **Site, sensor and account names were swapped for neutral labels in the browser before capture** (e.g. "Research Field 02", "University Plot 03", "Prairie Site 02", "team@example.org" / "Research Team"); every reading, chart, map and image is real data as it appeared that morning. Keys, labels and alt text live in `SCREENS` in `src/components/media/media.jsx`; render with `<Screen id>` (inside `DeviceFrame aspect={SCREEN_RATIO}`) or `<ScreenCard id caption>`. Full-resolution masters: `media-src/phenode-captures-2026-10-07/` (not served).

| Key | View (state captured) | Used in |
|---|---|---|
| `fleet-overview` | Your Fleet, newest readings first | Software page hero; Software views |
| `base-station` | Base Station Measurements: dials + first charts (Research Field 02, last 7 days) | Software views |
| `base-station-charts` | Same page scrolled to the charts | (spare — the recordings cover it) |
| `measurement-categories` | Same, category menu open | Software views |
| `imaging` | Imaging (University Plot 04, a midday capture) | Base station page; Software views |
| `system-diagnostics` | Diagnostics (Prairie Site 02: 27 nodes, 5 of 6 sensors active) | Home Software cards; Base station page; Software views |
| `wireless-fleet-overview` | Wireless Fleet Overview (University Plot 03, 7 active nodes) | Wireless node page; Software views |
| `sensor-map` | Sensor Overview, satellite map, nearby nodes + PheNode pin | Wireless node page; Software views |
| `wireless-sensor-measurements` | One node, Soil category, two probes, last 7 days | Home Software cards; Wireless node page; Software views |
| `multi-sensor-overlay` | Soil moisture, four nodes, both probes, last 7 days | Home Software cards; Data platform → Compare; Software views |
| `dual-comparison` | Air temperature vs relative humidity, Research Field 02 (= Danforth Field Research Site), last 7 days | Data platform → Compare; Danforth case study; Software views |
| `data-downloads` | Data Downloads filled in (no download triggered) | Data platform; Software views |

**Precipitation views (27 Oct 2026).** The Precipitation page (Base Station › Precipitation) was on the staging build only, so these were captured from the app run locally against staging's own responses, recorded read-only that morning. Same size, density and export as above, with the browser clock held at the recording time (10:40 AM CDT). The selected unit is Research Field 02 (= Danforth Field Research Site, as in `dual-comparison`); every other site reads "Field Site NN". Readings are real; St. Charles County and its airport gauge are shown by name. Masters: `media-src/phenode-captures-2026-10-27/`.

| Key | View (state captured) | Used in |
|---|---|---|
| `precipitation-overview` | Overview: Today's Rainfall (no rain yet, afternoon not reported) + Next 7 days (NWS) | Home Software → Precipitation; Software views |
| `precipitation-storms` | Overview scrolled: Fleet Rainfall + Storm Events (3 storms in October) + Radar | Software views |
| `precipitation-season` | Season: Season vs Normal (119% since Apr 1) + Drought Status (D0, St. Charles County) | Home Software → Precipitation; Software views |
| `precipitation-unit-check` | Gauge Check scrolled to Unit Check: September, 78% of the middle of 3 nearby gauges, what to check | Home Software → Precipitation; Software views |

Phone captures (390 × 844 browser size, 2×): `software/mobile-fleet-{390,780}.webp` and `software/mobile-base-station-{390,780}.webp`, keyed in `PHONE_SCREENS` and shown with `<PhoneScreen>` in `DeviceFrame kind="phone" aspect={PHONE_RATIO}` (Software page → "On a phone, too").

Still showing a real site name: the home 03 map (`software/hyperlocal-map`, Jake's capture) labels the Danforth Field Research Site PheNode. Swap it for a neutral capture if partners shouldn't be named. `DashboardMock` is no longer used by any page.

## 3D models (in place — from the Nov 2026 CAD exports)

| File | Source | Size | Shown in |
|---|---|---|---|
| `public/models/wireless-node.glb` | `WS for web.glb` (node "WS for web") | ≈ 0.45 MB, 33k triangles | `NodeExplorer` (home Hardware, wireless node page) |
| `public/models/base-station.glb` | `PheNode for web.glb` (node "PheNode Complete for web") | ≈ 0.65 MB, 51k triangles | `BaseStationExplorer` (home Hardware, base station page) |

Both are drawn by `src/components/three/ProductModel3D.jsx` (lazy-loaded, mounted near the viewport, paused off-screen; meshopt decoding only, so no third-party decoder is fetched). Without WebGL the explorers fall back to `hardware/wireless-node-front` and the annotated `hardware/base-station-v4` render.

Built with `scripts/models/` (see the header of each script for setup): `extract-glb.mjs` pulls the product mesh out of the Blender export (centimetres → metres, base at y = 0), then `build-model.mjs` groups the meshes into `part_<id>` nodes, assigns the PBR finishes (colours matched to the v4 render), simplifies to well under a pixel of error, adds the `hotspot_<id>` anchors and compresses with meshopt. Callout copy lives in `src/components/three/nodeHotspots.js` and `src/data/baseStationParts.js`; where each callout sits is set by the anchors in `build-model.mjs`. The base-station GLB has no soil probe, so its "Soil sensor" point sits at the sensor ports under the control box.

## Video (in place — built from the 7 Oct 2026 captures)

Both are cursor-free, seamless loops at 1920 × 1200, 30 fps, built frame by frame from the stitched captures (fixed header and sidebar, content scrolled underneath exactly as the app scrolls), encoded as H.264 MP4 and VP9 WebM, each with a WebP poster. They play through `<LoopVideo>`: muted, inline, looping, sources attached only near the viewport, paused off-screen; under reduced motion they hold the poster with a Play control.

| File | Content | Length / size | Used in |
|---|---|---|---|
| `video/software-tour-1920.{mp4,webm}` + `software-tour-poster.webp` | Fleet → base station (scrolls to its charts) → wireless sensor map → imaging → fleet | 16.2 s · 2.3 MB / 1.7 MB | Home → Software monitor |
| `video/base-station-scroll-1920.{mp4,webm}` + `base-station-scroll-poster.webp` | Base station page, top → bottom → top | 12.7 s · 1.4 MB / 0.7 MB | Base station page → In the software |

The earlier `video/software-scroll-1920.*` (Jake's screen recording) is no longer used.

## Documents

`public/docs/phenode-buyers-guide-summer-2025.pdf` is live. Everything else listed in `src/data/docs.js` is a placeholder path until the file is added; set `placeholder: false` once it exists.
