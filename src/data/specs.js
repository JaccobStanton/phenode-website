/**
 * Product specifications — transcribed from the PheNode Summer 2025 Buyer's Guide
 * (docs/reference/phenode-brochure-summer-2025.pdf) and agrelaeco.com.
 * Do not add numbers here that are not in a published Agrela source.
 */

export const BASE_STATION = {
  name: 'PheNode base station',
  tagline: 'Control box, sensor frame, and the standard sensor suite — solar powered, cellular or Wi-Fi with satellite backup.',
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
    'Air temperature', 'Relative humidity', 'Air pressure / vapor pressure', 'Rainfall',
    'Wind speed, direction and gust', 'Solar radiation', 'Soil moisture, temperature and salinity (EC)',
    'Soil water potential', 'Growing degree days',
  ],
  sensorSpecs: [
    { name: 'Temperature', range: '−40 to 85 °C', accuracy: '±0.5 to ±1.0 °C' },
    { name: 'Air pressure', range: '300 to 1100 hPa', accuracy: '±0.6 to ±1.2 hPa' },
    { name: 'Humidity', range: '0 to 100 %', accuracy: '±3 %' },
    { name: 'Vapor pressure / IAQ', range: 'IAQ 0–500', accuracy: 'Sensor-to-sensor deviation ±15 % ±15' },
    { name: 'Rainfall', range: '—', accuracy: '±3 %' },
    { name: 'Wind speed', range: '0.5 to 45 m/s (1.12 to 100 mph)', accuracy: '0.1 m/s at 10 m/s' },
    { name: 'Wind direction', range: '0 to 359°', accuracy: '±1° RMS at 10 m/s' },
    { name: 'Wind gust', range: '—', accuracy: '±0.3 m/s up to 10 m/s; 3 % from 10 to 45 m/s' },
    { name: 'Imaging', range: '5 MP RGB', accuracy: '—' },
  ],
}

export const WIRELESS_NODE = {
  name: 'Agrela wireless sensor',
  tagline: 'Battery-operated, solar-powered nodes that collect data hundreds of meters from the base station.',
  includes: [
    '6 V solar panel and internal rechargeable battery (USB-C recharge)',
    'LoRaWAN communication — low power, long range',
    'Communicates with a PheNode up to 1 km away (line of sight)',
    'Mounting bracket',
    'Ports for up to two soil probes',
    'Radiation shield for ambient-air measurements',
  ],
  coreMeasurements: ['Air temperature', 'Relative humidity', 'Air pressure', 'Lux (light intensity / daylength)', 'Air quality / gas resistance'],
  addOnMeasurements: ['Soil moisture (VWC)', 'Soil temperature', 'Soil electrical conductivity (salinity)'],
  transmit: 'Hourly transmission to the nearest PheNode via LoRaWAN',
  range: 'Up to 1 km line of sight',
  sensorSpecs: [
    { name: 'Temperature', range: '−40 to 85 °C', accuracy: '±0.5 to ±1.0 °C' },
    { name: 'Air pressure', range: '300 to 1100 hPa', accuracy: '±0.6 to ±1.2 hPa' },
    { name: 'Humidity', range: '0 to 100 %', accuracy: '±3 %' },
    { name: 'Air quality / gas resistance', range: 'IAQ 0–500', accuracy: 'Sensor-to-sensor deviation ±15 % ±15' },
    { name: 'Lux (light intensity)', range: '188 µLux to 88,000 Lux', accuracy: '—' },
  ],
}

export const ADD_ON_SENSORS = [
  {
    id: 'soil-standard',
    name: 'Standard soil sensor',
    measures: ['Soil temperature', 'Soil moisture (VWC)', 'Soil electrical conductivity (salinity)'],
    image: 'sensor-soil-standard',
    note: 'Connects to the base station or to a wireless node (up to two per node) to capture soil data at multiple depths.',
    specs: [
      { name: 'Soil temperature', range: '−40 to +60 °C', accuracy: '±0.3 to 0.5 °C' },
      { name: 'Soil moisture (VWC)', range: '0.0 to 1.0 m³/m³', accuracy: '1–3 % VWC' },
      { name: 'Soil EC (bulk)', range: '0 to 20,000 µS/cm', accuracy: '±5 to 8 % µS/cm' },
    ],
  },
  {
    id: 'water-potential',
    name: 'Water potential sensor',
    measures: ['Soil water potential'],
    image: 'sensor-water-potential-2026',
    note: 'Measures how tightly water is held by the soil — the plant-available side of soil moisture.',
    specs: [
      { name: 'Soil water potential', range: '0 to −100,000 kPa', accuracy: '±(10 % of reading + 2 kPa) from −100 to −5 kPa; resolution 0.1 kPa' },
    ],
  },
  {
    id: 'profile-probe',
    name: 'Premium soil profile probe',
    measures: ['Soil temperature', 'Soil moisture'],
    image: 'sensor-profile-probe-angle',
    note: 'Measures multiple depths at once — 15, 30, 45 and 60 cm — and is easier to install and remove than conventional profile probes.',
    specs: [{ name: 'Depths', range: '15 cm, 30 cm, 45 cm, 60 cm', accuracy: '—' }],
  },
]

export const SOFTWARE = {
  name: 'PheNode software',
  capabilities: [
    { id: 'fleet', name: 'Fleet management', text: 'Manage, view and download data for an entire PheNode fleet from one place.' },
    { id: 'wireless', name: 'Wireless sensor network', text: 'View the wireless sensor network data for every PheNode in your fleet.' },
    { id: 'viz', name: 'Data visualization', text: 'Flexible, robust time-series visualization, with Grafana available through the API.' },
    { id: 'precipitation', name: 'Precipitation', text: 'Rainfall, storms, forecast, season against normal and drought for every PheNode, and a monthly check of each rain gauge against the official gauges nearby.' },
    { id: 'cleaning', name: 'Data cleaning preferences', text: 'Set cleaning preferences for .csv downloads so datasets arrive the way your analysis expects.' },
    { id: 'imaging', name: 'Imaging', text: 'View your operations remotely with images captured by PheNode (1–4 per day per PheNode over cellular).' },
    { id: 'control', name: 'Remote PheNode control', text: 'Adjust settings on deployed hardware without a site visit.' },
    { id: 'accounts', name: 'Sub-accounts', text: 'Create sub-accounts for employees, partners or public demonstrations.' },
    { id: 'api', name: 'API access', text: 'Pull structured data into your own tools and pipelines.' },
    { id: 'backend', name: 'Dockerized backend', text: 'Control your data flow with a portable backend for advanced deployments.' },
  ],
  dataPlan: [
    'All cellular and cloud infrastructure fees are covered by the service subscription',
    'Your data is stored and kept safe in Agrela\'s cloud for two years even if a subscription expires',
    'Hardware warranty while the subscription is active; replacements for failed components and sensors',
    'Tech support, software demos and real-time remote installation support',
  ],
}

export const CONNECTIVITY = {
  base: ['Cellular', 'Wi-Fi', 'Satellite backup'],
  node: ['LoRaWAN to the base station'],
}

// Big numbers used in the Technical Capabilities section — all from published Agrela material.
export const HEADLINE_NUMBERS = [
  { value: '1 km', label: 'Wireless node range', note: 'Line of sight, node to base station' },
  { value: '500+', label: 'Acres from one PheNode', note: 'With a fleet of wireless sensors (agrelaeco.com)' },
  { value: '2', label: 'Soil probes per node', note: 'Soil moisture, temperature and EC at multiple depths' },
  { value: '5 MP', label: 'On-board imager', note: 'RGB, 1–4 images per day per PheNode' },
  { value: '−40 °C', label: 'Operating range low end', note: 'Temperature sensing to 85 °C' },
  { value: '4', label: 'Profile-probe depths', note: '15, 30, 45 and 60 cm' },
]

/**
 * Claims that need internal verification before they appear on the site.
 * Flip to true only once Agrela has confirmed the definition, date range and substantiation.
 */
export const VERIFIED_CLAIMS = {
  pilotRetention: false, // "100 % pilot-customer retention since 2023"
  deploymentCount: false,
  measurementsCollected: false,
}
