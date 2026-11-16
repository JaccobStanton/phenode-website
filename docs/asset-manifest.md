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
| Case study opener (case study pages are hidden for now) | `case-studies/<slug>/opener-{1200,2400}.webp` | 2:1, 2400×1200 | `pages/CaseStudy.jsx` |
| Case study deployment (real site photos) | `case-studies/<slug>/deployment-{800,1600}.webp` | 4:3 | same (Danforth currently shows a software screenshot) |
| Case study timeline photos | `case-studies/<slug>/<year>-{800,1600}.webp` | 16:9 | same |
| Case study teaser | `case-studies/<slug>/teaser-{600,1200}.webp` | 4:3 | `sections/home/CaseStudiesTeaser.jsx`, `pages/CaseStudies.jsx` |

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

The Buyer's Guide PDF moved to `media-src/docs/phenode-buyers-guide-summer-2025.pdf` (hidden for now, `FEATURES.buyersGuide`; move it back to `public/docs/` to publish it again). Support documents (`src/data/docs.js`) are copies of agrelaeco.com's PDFs (Nov 15, checked by SHA-256 against the originals): `public/docs/phenode-quick-start-guide-v3-fall-2026.pdf` (15.8 MB) and, in `public/docs/archive/`, the v2.1 and v2.0 quick start guides (11.7 MB each) and the v1.1 (24.7 MB) and v1.0 (8.7 MB) user manuals.

## Company photography (in place, Nov 15)

- `company/danforth-center-{800,1200,1800}.webp`: the Donald Danforth Plant Science Center, from agrelaeco.com/about-us (Company page, About us). Source 1800×941 in `media-src/company/`.
- `company/phenode-in-prairie-{800,1200,1800}.webp`: a PheNode in a prairie at dusk, the about-us slideshow's second photo. Not used since Nov 15 (Jake's `DSC02237.jpg` took its place beside Nadia's quote on Support); kept for later. Source 4032×3024 in `media-src/company/`.
- `company/nadia-{800,1200}.webp`: Dr. Nadia Shakoor presenting on a prototype PheNode in a lab — Jake's photo `nadia.jpg` from his Desktop (Company page, Leadership column, under her quote; caption "Dr. Shakoor presenting on a prototype PheNode" (Jake's wording)). Shown uncropped at 3:2. Source 1200×800 in `media-src/company/nadia-original.jpg`.
- `company/phenode-in-barley-{800,1200,1800}.webp`: a PheNode in a barley field at sunset, Jake's photo "PheNode in Barley". No longer on the Company page (Nadia's photo took its place); it is the Resources "Applications" thumbnail. Source 1920×1280 in `media-src/company/phenode-in-barley-original.jpg`.
- `company/about-us-hero-800.webp`: a PheNode on a pole in tall grass at dusk, glass buildings behind — Jake's photo `about-us-hero.jpg` from his Desktop (Company page hero, `position: 50% 45%`). Source 800×1200 in `media-src/company/about-us-hero-original.jpg`; only the 800 size exists, so it is a little soft on high-density screens at desktop widths (a wider export would fix that).

## Page-hero photography (in place, Nov 15)

The heroes of the three pages in the Resources menu put a photo beside the title and lede (`PageHero` in `src/components/layout/Page.jsx`; Jake chose the photos). Resources uses a photo from the agrelaeco.com Gallery; Company uses Jake's `about-us-hero.jpg` (see Company photography) and Support his `DSC02247.jpg` (see Support photography). From 1024 px the photo takes the right five columns and is exactly as tall as the text, so it is cropped differently at each width; `position` (CSS object-position) keeps the PheNode in frame. Below 1024 px it follows the text at 3:2. Originals downloaded from https://www.agrelaeco.com/gallery (the Wix originals on static.wixstatic.com) and kept in `media-src/gallery/`; webp 800/1200/1600 in `public/assets/gallery/`.

| File | Photo | Original | Page |
|---|---|---|---|
| `gallery/phenode-greenhouses-*` | A PheNode on a guyed mast in tall grass, greenhouses behind (Gallery 5/6, `ae5d22_a751ef…`) | 2892×3928 | Not used — was the Company hero until Jake swapped in `about-us-hero.jpg`; kept for later (`position: 50% 30%` framed it well) |
| `gallery/phenode-tripod-field-*` | A PheNode on its tripod in a field, cloudy sky (Gallery 4/6, `ae5d22_abf573…`) | 1961×2614 | Resources (`50% 20%`) |
| `gallery/phenode-base-station-closeup-*` | Base station close-up with the PheNode logo, brick building behind (Gallery 2/6, `ae5d22_e13c02…`) | 1800×1754 | Was the Support hero until Jake's `DSC02247.jpg` replaced it (Nov 15); still the source of the Resources "Support & documentation" thumbnail |

Not used yet, also in the Gallery: 1/6 a PheNode in tall grass by a pine (3024×4032), 3/6 a wireless node close-up (only 787×1010), 6/6 a PheNode in a prairie with a pink flower in front (3300×2578).

## Support photography (in place — Jake's photos, Nov 15)

- `support/phenode-research-field-{800,1200}.webp`: a PheNode on a guyed mast above rows of plants in a field — Jake's `DSC02247.jpg` from his Desktop (Sony A7 III via Lightroom, 1200×800). Support hero, `position: 60% 50%` (keeps the PheNode centred when the sides are cropped). Source in `media-src/support/phenode-research-field-original.jpg`.
- `support/phenode-closeup-{800,1200}.webp`: a close-up of a PheNode, enclosure, two solar panels and sensors against a blue sky — Jake's `DSC02237.jpg` (1200×800). Support service block, beside Nadia's quote, uncropped at 3:2 (the figure was 4:3 for the prairie photo). Source in `media-src/support/phenode-closeup-original.jpg`.
- Both are 1200 px wide, the size Jake has, so no larger versions are exported.

## Case study card photos (in place — Jake's photos, Nov 15)

One photo per card on the Case Studies page (`photo` in `src/data/caseStudies.js`), cropped to 16:10: `public/assets/case-studies/<slug>/card-{800,1200,1600}.webp` (q72). Jake left them on his Desktop as case_study_01–03; he chose to swap 01 and 03, because case_study_03 is the same photo AgFunderNews captions as The Ray's Exit 6 wildflower meadow on I-85.

- `the-ray-i85`: Jake's `case_study_03.jpg` (3300×2578; the Exit 6 meadow, a pink wildflower in front). Crop at 50% from the top. Source `media-src/case-studies/the-ray-i85-original.jpg`.
- `danforth-center-research`: Jake's `case_study_02.jpg` (1200×900, iPhone, Aug 2023; a PheNode in tall grass in front of greenhouses). Crop at 35%; 800 and 1200 only. Source `media-src/case-studies/danforth-center-research-original.jpg`.
- `wsdot-expansion`: the same scene as Jake's `case_study_01.png` (a PheNode on a pole beneath a large conifer), from the full-size original in the agrelaeco.com Gallery (1/6, `ae5d22_c438f5…`, 3024×4032; downloaded with Jake's OK), because his file is only 722×943. Its colours were matched to his file (per-channel histogram match), then cropped at 32%. Sources: `media-src/case-studies/wsdot-expansion-original.jpg` (Gallery original) and `wsdot-expansion-jake-edit.png` (his file, the colour reference).
- Home "Case studies" rows still show placeholders.

## Resources list thumbnails (in place, Nov 15)

Every entry on the Resources page shows a 3:2 thumbnail beside its title, like an article list (Jake). Files: `public/assets/thumbs/<key>-{320,480}.webp`, cropped from the sources below (`thumb` in `GROUPS`, `src/pages/Resources.jsx`). They are decorative (`alt=""`): the title names each link. Press entries use the lead photo of the article they link to, as Jake asked; those photos belong to the publishers or to whoever they credit, so check that Agrela may reuse them. Article photos were saved in the built-in browser to ~/Downloads, then copied to `media-src/press/`.

| Key | Entry | Source |
|---|---|---|
| `support-docs` | Support & documentation | Gallery base-station close-up (`media-src/gallery/phenode-base-station-closeup-original.jpg`) |
| `specifications` | Specifications | AgFunderNews in-article photo "The PheNode environmental monitoring device", credited to Agrela (`media-src/press/agfundernews-2023-phenode-closeup.jpg`, 1920×1440) |
| `press-danforth` | Danforth Center article (2026) | The article's featured image, `wp-content/uploads/2026/05/AgrelaPheNodePR.jpg` (PheNode with a FieldDock drone dock; `media-src/press/danforth-2026-agrela-phenode-pr.jpg`, 1600×900; no credit shown on the page) |
| `press-theray` | The Ray article (Nov 2023) | The article's featured image, "PheNode-Sensor-Array" (a 600×400 render with a transparent background, set on paper-3 #E2DED4; `media-src/press/theray-2023-phenode-sensor-array.webp`) |
| `press-agfundernews` | AgFunderNews article (Dec 2023) | The article's lead image, Nadia Shakoor's headshot, credited to Agrela (`media-src/press/agfundernews-2023-nadia-shakoor-headshot.jpg`, 1920×1281) |
| `how-it-works` | How PheNode works | Jake's `about-us-hero.jpg` (as on the Company hero) |
| `applications` | Applications | Jake's "PheNode in Barley" (`media-src/company/phenode-in-barley-original.jpg`) |
| `case-studies` | Case studies | AgFunderNews in-article photo of a PheNode in a wildflower meadow at The Ray, credited to Agrela (`media-src/press/agfundernews-2023-exit-6-phenode.jpg`, 1920×1500) |
