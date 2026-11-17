/** The exported widths of the front render (public/assets/hardware/base-station-v4-<w>.webp; 800 and 1200 added Nov 17
 *  so phones get a size close to what they need — a 3× phone took the 1600). */
export const BASE_STATION_WIDTHS = [600, 800, 1000, 1200, 1600, 2400]

/**
 * The base-station components, in the order they read left-to-right around the frame.
 * `x`/`y` are percentages of the front render (hardware/base-station-v4, 2400 × 1625).
 * Copy comes from the Summer 2025 Buyer's Guide (rain gauge accuracy ±4 % and the frame's line: Jake, Nov 16); `short` is the one-line version for the hero index. `photo` (optional)
 * is shown beside the copy in the base station explorer's info card.
 * `zoom` and `fx`/`fy` (% of the render) frame the component's close-up in the home hero's detail view (PartExplorer);
 * fx/fy default to x/y.
 * `model` (optional) is for the 3D viewer when the GLB has no `hotspot_<id>` anchor or part of its own for a component:
 * `at` = anchor in model space (metres), `meshes` = the GLB meshes that make it up (ProductModel3D gives them their own
 * part, so they light up on their own when it is selected).
 */
export const BASE_STATION_PARTS = [
  { id: 'rain', label: 'Rain gauge', x: 13.5, y: 21, zoom: 2.2, fx: 14.5, fy: 23, side: 'right', short: 'Tipping-bucket rainfall, ±4 %', text: 'Tipping-bucket rainfall with an Agrela-designed funnel. Accuracy ±4 %.' },
  // The solar radiation sensor (Apogee SP-421) on top of the frame, left of the antenna (Jake, Nov 17). Figures from the
  // add-on card's specs (ADD_ON_SENSORS 'solar-radiation'); the photo is his "Solar Radiation.png" (150 px wide). In the
  // GLB it came in with the control box's parts as `control_gloss` (body; its white diffuser is in `control_white`).
  { id: 'radiation', label: 'Solar radiation', x: 30.8, y: 12.5, zoom: 3, fx: 31, fy: 15, side: 'right', short: 'Incoming solar radiation, 0–1750 W/m²', text: 'A pyranometer for incoming shortwave radiation: 0 to 1750 W/m², calibration uncertainty < 3 %.', photo: { name: 'hardware/sensor-solar-radiation', widths: [150], alt: 'The solar radiation sensor (Apogee SP-421)' }, model: { at: [-0.088, 0.312, -0.03], meshes: ['control_gloss'] } },
  { id: 'solar', label: 'Solar panel', x: 46, y: 31, zoom: 1.55, fx: 45, side: 'left', short: '10 W / 6 V — runs the station off-grid', text: '10 W / 6 V panel with USB-C as an alternative power option.' },
  { id: 'wind', label: 'Wind sensor', x: 59.5, y: 6, zoom: 2.8, fy: 11, side: 'right', short: 'Speed, direction and gust', text: 'Speed 0.5–45 m/s, direction 0–359° (±1° RMS), gust ±0.3 m/s.' },
  { id: 'air', label: 'Ambient air', x: 78.5, y: 29, zoom: 2.4, fx: 82, fy: 30, side: 'right', short: 'Temperature, humidity and pressure in a radiation shield', text: 'Temperature −40 to 85 °C, humidity ±3 %, pressure 300–1100 hPa, vapor pressure.', photo: { name: 'hardware/sensor-atmos-14', widths: [300, 590], alt: 'The ambient air sensor (ATMOS 14) in its louvered radiation shield' } },
  { id: 'control', label: 'Control box', x: 47, y: 72, zoom: 1.9, fy: 70, side: 'right', short: 'Controller, ports, power, cellular / Wi‑Fi / satellite', text: 'System controller, sensor connections (SDI-12 / RS-485), cellular or Wi-Fi with satellite backup, power management.' },
  { id: 'imager', label: 'Imager', x: 21.5, y: 68, zoom: 2.6, fx: 19, fy: 66, side: 'left', short: '5 MP camera, 1–4 images a day', text: '5 MP RGB camera on an adjustable mount — 1 to 4 images per day over cellular.' },
  { id: 'soil', label: 'Soil sensor', x: 90.5, y: 79, zoom: 2.4, fx: 90, fy: 78, side: 'left', short: 'Moisture, temperature and EC', text: 'Soil moisture, temperature and EC; water-potential and profile probes available.' },
  { id: 'frame', label: 'Aluminum frame', x: 89.5, y: 42, zoom: 2, fx: 86, fy: 48, side: 'left', short: 'Mounts to posts, poles, tripods or a tower', text: 'Durable, recyclable aluminum. Mounts to U-posts, poles and tripods (1.5–2.5"D), or our premium 3-section tower.' },
]
