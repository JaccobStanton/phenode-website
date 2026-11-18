/**
 * Product specifications — transcribed from the PheNode Summer 2025 Buyer's Guide
 * (docs/reference/phenode-brochure-summer-2025.pdf) and agrelaeco.com.
 * Do not add numbers here that are not in a published Agrela source.
 */

export const BASE_STATION = {
  name: 'PheNode base station',
  includes: [
    'Control box and sensor frame (durable aluminum construction)',
    '10 W / 6 V solar panel',
    '5 MP RGB camera (Agrela Standard Imager) — remote visual monitoring',
    'Cellular or Wi-Fi connectivity, with satellite backup',
    'SDI-12 and RS-485 connectors for custom and third-party sensors',
    'Mounts to U-posts, poles and tripods (1.5"–2.5" diameter); optional 3-section aluminum tower with ground stakes and guy wires',
    'USB-C and solar power options',
  ],
  coreMeasurements: [
    'Air temperature', 'Relative humidity', 'Air pressure', 'Vapor pressure', 'Rainfall',
    'Wind speed, direction and gust', 'Solar radiation', 'Soil moisture, temperature and salinity (EC)',
    'Soil water potential', 'Growing degree days',
  ],
  sensorSpecs: [
    { name: 'Temperature', range: '−40 to 85 °C', accuracy: '±0.5 to ±1.0 °C' },
    { name: 'Air pressure', range: '300 to 1100 hPa', accuracy: '±0.6 to ±1.2 hPa' },
    { name: 'Humidity', range: '0 to 100 %', accuracy: '±3 %' },
    // Jake, Nov 16: vapor pressure is its own measurement, and the base station has no IAQ (the Buyer's Guide paired them)
    { name: 'Vapor pressure', range: '0 to 47 kPa', accuracy: 'Resolution 0.01 kPa' },
    { name: 'Rainfall', range: '—', accuracy: '±4 %' }, // Jake, Nov 16 (the Buyer's Guide said ±3 %)
    { name: 'Wind speed', range: '0.5 to 45 m/s (1.12 to 100 mph)', accuracy: '0.1 m/s at 10 m/s' },
    { name: 'Wind direction', range: '0 to 359°', accuracy: '±1° RMS at 10 m/s' },
    { name: 'Wind gust', range: '—', accuracy: '±0.3 m/s up to 10 m/s; 3 % from 10 to 45 m/s' },
    { name: 'Imaging', range: '5 MP RGB', accuracy: '—' },
  ],
}

export const WIRELESS_NODE = {
  name: 'Agrela wireless sensor',
  includes: [
    '6 V solar panel and internal rechargeable battery (USB-C recharge)',
    'LoRaWAN communication — low power, long range',
    'Communicates with a PheNode up to 1 km away (line of sight)',
    'Mounting bracket',
    'Two agnostic sensor ports, for ambient air and/or soil sensors',
  ],
  // Jake, Nov 16–17: the node no longer has its own ambient air sensors (temperature, humidity, pressure, air quality,
  // and the radiation shield they sat in). Its light sensor stays; ambient air and soil are measured with sensors in
  // its two ports.
  coreMeasurements: ['Lux (light intensity / daylength)'],
  addOnMeasurements: ['Ambient air', 'Soil moisture (VWC)', 'Soil temperature', 'Soil electrical conductivity (salinity)', 'Soil water potential'],
  transmit: 'Hourly transmission to the nearest PheNode via LoRaWAN',
  range: 'Up to 1 km line of sight',
  sensorSpecs: [
    { name: 'Lux (light intensity)', range: '188 µLux to 88,000 Lux', accuracy: '—' },
  ],
}

/**
 * Add-on sensors — the "Sensor add-ons" cards on the PheNode page (wireless node part) and the base station's add-on
 * spec table. `row` groups the cards (soil first, then air and sun); `connects` says what each one plugs into
 * ('base' = PheNode base station, 'node' = wireless sensor node). Nov 17 (Jake): ATMOS 14 and SP-421 added; TEROS 54 and
 * TEROS 22 specs from METER's spec sheets, SP-421 from Apogee's manual (see the project notes for the sources). Nov 18
 * (Jake): the water potential sensor and the profile probe connect to the wireless node too.
 */
export const ADD_ON_SENSORS = [
  {
    id: 'soil-standard', // TEROS 12
    row: 'soil',
    name: 'Standard soil sensor',
    measures: ['Soil temperature', 'Soil moisture (VWC)', 'Soil electrical conductivity (salinity)'],
    image: 'sensor-soil-standard',
    imageWidths: [400, 700],
    note: 'Captures soil data at multiple depths, with up to two on each wireless node.',
    connects: ['base', 'node'],
    specs: [
      { name: 'Soil temperature', range: '−40 to +60 °C', accuracy: '±0.3 to 0.5 °C' },
      { name: 'Soil moisture (VWC)', range: '0.0 to 1.0 m³/m³', accuracy: '1–3 % VWC' },
      { name: 'Soil EC (bulk)', range: '0 to 20,000 µS/cm', accuracy: '±5 to 8 % µS/cm' },
    ],
  },
  {
    id: 'water-potential', // TEROS 22
    row: 'soil',
    name: 'Water potential sensor',
    measures: ['Soil water potential', 'Soil temperature'],
    image: 'sensor-water-potential-2026',
    imageWidths: [400, 700],
    note: 'Measures how tightly water is held by the soil — the plant-available side of soil moisture.',
    connects: ['base', 'node'],
    specs: [
      { name: 'Soil water potential', range: '0 to −100,000 kPa', accuracy: '±(10 % of reading + 2 kPa) from −100 to −5 kPa; resolution 0.1 kPa' },
      { name: 'Soil temperature', range: '−40 to +60 °C', accuracy: '±1.0 °C' },
    ],
  },
  {
    id: 'profile-probe', // TEROS 54
    row: 'soil',
    name: 'Premium soil profile probe',
    measures: ['Soil temperature', 'Soil moisture'],
    image: 'sensor-profile-probe-angle',
    imageWidths: [400, 800, 1400],
    note: 'Measures multiple depths at once — 15, 30, 45 and 60 cm — and is easier to install and remove than conventional profile probes.',
    connects: ['base', 'node'],
    specs: [
      { name: 'Soil profile probe measurement depths', range: '15 cm, 30 cm, 45 cm, 60 cm', accuracy: '—' }, // was "Depths" (Jake, Nov 16)
      { name: 'Soil moisture (VWC)', range: '0.00 to 0.70 m³/m³', accuracy: '±0.05 m³/m³ (mineral soils)' },
      { name: 'Soil temperature', range: '−20 to +60 °C', accuracy: '±0.25 to 0.35 °C' },
    ],
  },
  {
    id: 'ambient-air', // ATMOS 14 — the same sensor as the base station's own air readings, so the same numbers
    row: 'air',
    name: 'Ambient air sensor',
    measures: ['Air temperature', 'Relative humidity', 'Air pressure', 'Vapor pressure'],
    image: 'sensor-atmos-14',
    imageWidths: [300, 590],
    note: 'Temperature, humidity, air pressure and vapor pressure, read inside a louvered radiation shield.',
    connects: ['base', 'node'],
    specs: [
      { name: 'Air temperature', range: '−40 to 85 °C', accuracy: '±0.5 to ±1.0 °C' },
      { name: 'Relative humidity', range: '0 to 100 %', accuracy: '±3 %' },
      { name: 'Air pressure', range: '300 to 1100 hPa', accuracy: '±0.6 to ±1.2 hPa' },
      { name: 'Vapor pressure', range: '0 to 47 kPa', accuracy: 'Resolution 0.01 kPa' },
    ],
  },
  {
    id: 'solar-radiation', // Apogee SP-421; graphic from Jake ("Solar Radiation.png", Nov 17 — only 150 px wide)
    row: 'air',
    name: 'Solar radiation sensor',
    measures: ['Solar radiation (shortwave)'],
    image: 'sensor-solar-radiation',
    imageWidths: [150],
    note: 'A silicon-cell pyranometer for incoming shortwave radiation, the energy that drives evapotranspiration.',
    connects: ['base'],
    specs: [
      { name: 'Solar radiation', range: '0 to 1750 W/m²', accuracy: 'Calibration uncertainty < 3 %' },
      { name: 'Spectral range', range: '360 to 1120 nm', accuracy: '—' },
    ],
  },
]

export const SOFTWARE = {
  name: 'PheNode software',
  dataPlan: [
    'All cellular and cloud infrastructure fees are covered by the service subscription',
    'Your data is stored and kept safe even if a subscription expires',
    'The hardware warranty covers failed components and sensors while the subscription is active',
    'Tech support, software demos and real-time remote installation support',
  ],
}
