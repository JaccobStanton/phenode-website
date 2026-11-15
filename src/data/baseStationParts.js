/**
 * The base-station components, in the order they read left-to-right around the frame.
 * `x`/`y` are percentages of the front render (hardware/base-station-v4, 2400 × 1625).
 * Copy comes from the Summer 2025 Buyer's Guide; `short` is the one-line version for the hero index. `photo` (optional)
 * is shown beside the copy in the base station explorer's info card.
 * `zoom` and `fx`/`fy` (% of the render) frame the component's close-up in the home hero's detail view (PartExplorer);
 * fx/fy default to x/y.
 */
export const BASE_STATION_PARTS = [
  { id: 'rain', label: 'Rain gauge', x: 13.5, y: 21, zoom: 2.2, fx: 14.5, fy: 23, side: 'right', short: 'Tipping-bucket rainfall, ±3 %', text: 'Tipping-bucket rainfall with an Agrela-designed funnel. Accuracy ±3 %.' },
  { id: 'solar', label: 'Solar panel', x: 46, y: 31, zoom: 1.55, fx: 45, side: 'left', short: '10 W / 6 V — runs the station off-grid', text: '10 W / 6 V panel with USB-C as an alternative power option.' },
  { id: 'wind', label: 'Wind sensor', x: 59.5, y: 6, zoom: 2.8, fy: 11, side: 'right', short: 'Speed, direction and gust', text: 'Speed 0.5–45 m/s, direction 0–359° (±1° RMS), gust ±0.3 m/s.' },
  { id: 'air', label: 'Ambient air', x: 78.5, y: 29, zoom: 2.4, fx: 82, fy: 30, side: 'right', short: 'Temperature, humidity and pressure in a radiation shield', text: 'Temperature −40 to 85 °C, humidity ±3 %, pressure 300–1100 hPa, vapor pressure.', photo: { name: 'hardware/sensor-atmos-14', widths: [300, 590], alt: 'The ambient air sensor (ATMOS 14) in its louvered radiation shield' } },
  { id: 'control', label: 'Control box', x: 47, y: 72, zoom: 1.9, fy: 70, side: 'right', short: 'Controller, ports, power, cellular / Wi‑Fi / satellite', text: 'System controller, sensor connections (SDI-12 / RS-485), cellular or Wi-Fi with satellite backup, power management.' },
  { id: 'imager', label: 'Imager', x: 21.5, y: 68, zoom: 2.6, fx: 19, fy: 66, side: 'left', short: '5 MP camera, 1–4 images a day', text: '5 MP RGB camera on an adjustable mount — 1 to 4 images per day over cellular.' },
  { id: 'soil', label: 'Soil sensor', x: 90.5, y: 79, zoom: 2.4, fx: 90, fy: 78, side: 'left', short: 'Moisture, temperature and EC', text: 'Soil moisture, temperature and EC; water-potential and profile probes available.' },
  { id: 'frame', label: 'Aluminum frame', x: 89.5, y: 42, zoom: 2, fx: 86, fy: 48, side: 'left', short: 'Mounts to posts, poles, tripods or a tower', text: 'Durable, recyclable aluminum. Mounts to U-posts, poles and tripods (1.5–2.5"), or the 3-section tower.' },
]
