# 3D asset brief: PheNode wireless node + base station

> **Status, Nov 2026:** both models are on the site, built from `WS for web.glb` and `PheNode for web.glb`. See `docs/asset-manifest.md` → 3D models. The brief below is kept for future model updates.

You can send this file to the designer as is. The website draws the products in real time with three.js (React Three Fiber). It shows them assembled, lets visitors rotate them, has an **exploded view**, and pins labelled hotspots to parts. Today the wireless node is a rough procedural stand-in and the base station is a flat render. The files below replace both.

## 1. Deliverables

| File | What |
|---|---|
| `wireless-node.glb` | The wireless sensor node, assembled |
| `base-station.glb` | The base station (frame plus all mounted sensors), assembled |
| `soil-probe-standard.glb`, `soil-profile-probe.glb`, `water-potential.glb` | *Optional.* Add-on sensors as separate models, for the configurator |
| Renders (PNG, transparent background, 2400 px wide) | Assembled front, assembled ¾, and exploded ¾ for each product. Used as the fallback on phones, for reduced motion and when WebGL is unavailable. |
| Source files | The native CAD (STEP plus SolidWorks/Fusion/etc.) and the DCC scene (Blender/Max/C4D) the GLBs were exported from, so we can re-export later |
| *Optional:* `.usdz` of each product | Lets iPhone/iPad users view it in AR (Quick Look) |

**Format:** glTF 2.0 **binary (.glb)**. Not FBX, OBJ or STEP for the web files.

## 2. Structure (this is what makes the exploded view possible)

- **Each part that moves in the exploded view is its own named node.** Don't merge them into one mesh. Use these names so the code can find them:
  - **Wireless node:** `lid_solar`, `enclosure_top`, `enclosure_base`, `lux_window`, `antenna`, `battery`, `usb_c`, `pcb` (only if internals are shown), `soil_port_1`, `soil_port_2`, `shield_plate_1` … `shield_plate_n`, `mount_bracket`
  - **Base station:** `frame`, `solar_panel`, `rain_gauge`, `wind_sensor`, `radiation_shield`, `control_box`, `control_box_lid`, `imager`, `imager_mount`, `soil_probe`, `soil_cable`, `pole_mount`
- **Exploded positions:** pick one of the two options below.
  1. **Preferred:** one animation clip named `explode` that goes from assembled (frame 0) to fully exploded (last frame). Use straight linear moves with no easing; the site adds its own easing and scrubs the clip with a slider and on scroll.
  2. Alternatively, an empty for each part named `<part>_exploded`, placed where that part should end up.
- **Hotspot anchors:** an empty named `hotspot_<id>` at the exact point each label should point to. IDs: `solar`, `lux`, `radio`, `battery`, `shield`, `soil`, `mount` for the node, and `rain`, `solar`, `wind`, `air`, `control`, `imager`, `soil`, `frame` for the base station.
- **Pivots:** each part's origin at its own center. The model is delivered in the assembled position.

## 3. Scale, orientation, budget

- Real-world units in **meters**, **Y-up**, product front facing **+Z**. Assembly origin at the bottom-center of the mount.
- Triangle budget: **node ≤ 60k**, **base station ≤ 150k**. Remove hidden internals (screw threads, PCB traces, cable insides) unless the exploded view is meant to show them. Tell us which internals should be visible.
- File size after compression: **≤ 3 MB per product**. Draco or meshopt is fine. Also send an uncompressed copy.

## 4. Materials

- PBR **metallic-roughness** materials. Name them by finish: `white_enclosure`, `anodized_black`, `brushed_aluminum`, `solar_cell`, `glass_lux`, `rubber`, `cable`.
- Textures: **2048 px max**, power-of-two sizes, PNG or JPG (KTX2 welcome). Logos and labels as texture decals, not geometry.
- Optional: baked ambient occlusion in the occlusion channel. No baked lighting in the base color.

## 5. Before sending

1. Open each `.glb` in https://gltf-viewer.donmccurdy.com and check that it loads with no errors, the part names show up, and the `explode` clip plays.
2. Confirm we have the rights to publish the models and renders on agrelaeco.com.

## Where it plugs in (for the developer)

- `public/models/wireless-node.glb` and `public/models/base-station.glb`, built by `scripts/models/extract-glb.mjs` + `scripts/models/build-model.mjs`.
- `src/components/three/ProductModel3D.jsx` draws either model: `part_<id>` groups highlight (and, with `extras.explode`, separate in the exploded view); `hotspot_<id>` empties place the callouts.
- Callout copy: `src/components/three/nodeHotspots.js` (node) and `src/data/baseStationParts.js` (base station, shared with the hero's 2D render).
