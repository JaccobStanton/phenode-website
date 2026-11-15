/**
 * Sensor catalog for the configurator and hardware explorer.
 * Only items Agrela publishes today are "offered"; third-party integration is listed as an
 * open interface (SDI-12 / RS-485 on the base station), not as a product.
 */
export const SENSOR_CATEGORIES = [
  { id: 'soil', name: 'Soil', color: 'var(--color-clay)' },
  { id: 'weather', name: 'Weather', color: 'var(--color-data)' },
  { id: 'plant', name: 'Plant & light', color: 'var(--color-sage)' },
  { id: 'water', name: 'Water', color: 'var(--color-data-2)' },
  { id: 'custom', name: 'Custom / third-party', color: 'var(--color-alloy)' },
]

export const SENSORS = [
  // Included on the wireless node
  { id: 'ws-air', category: 'weather', name: 'Ambient air (built in)', short: 'Air T / RH / pressure', measures: ['Air temperature', 'Relative humidity', 'Air pressure', 'Air quality'], builtIn: true, host: ['node'] },
  { id: 'ws-lux', category: 'plant', name: 'Light intensity (built in)', short: 'Lux', measures: ['Lux / daylength'], builtIn: true, host: ['node'] },
  // Add-ons
  { id: 'soil-standard', category: 'soil', name: 'Standard soil sensor', short: 'Soil probe', measures: ['Soil moisture (VWC)', 'Soil temperature', 'Soil EC (salinity)'], host: ['node', 'base'], perNodeMax: 2, image: 'sensor-soil-standard', requires: 'Cable + probe', configurable: true },
  { id: 'water-potential', category: 'water', name: 'Water potential sensor', short: 'Water potential', measures: ['Soil water potential'], host: ['base'], image: 'sensor-water-potential-2026', requires: 'Cable', configurable: true },
  { id: 'profile-probe', category: 'soil', name: 'Soil profile probe', short: 'Profile probe', measures: ['Soil moisture at 15/30/45/60 cm', 'Soil temperature at 15/30/45/60 cm'], host: ['base'], image: 'sensor-profile-probe-angle', requires: 'Installation tool recommended', configurable: true },
  // Base-station suite
  { id: 'bs-wind', category: 'weather', name: 'Wind (base station)', short: 'Wind', measures: ['Wind speed', 'Wind direction', 'Wind gust'], builtIn: true, host: ['base'] },
  { id: 'bs-rain', category: 'weather', name: 'Rainfall (base station)', short: 'Rain', measures: ['Rainfall'], builtIn: true, host: ['base'] },
  { id: 'bs-solar', category: 'plant', name: 'Solar radiation (base station)', short: 'Solar radiation', measures: ['Solar radiation'], builtIn: true, host: ['base'] },
  { id: 'bs-imager', category: 'plant', name: 'Standard imager (base station)', short: '5 MP imager', measures: ['RGB images, 1–4 per day'], builtIn: true, host: ['base'] },
  // Interface for third-party
  { id: 'custom-sdi12', category: 'custom', name: 'Third-party sensor (SDI-12 / RS-485)', short: 'Custom sensor', measures: ['Your sensor, your variable'], host: ['base'], requires: 'Compatibility review with Agrela', configurable: true },
]

export const SENSOR_BY_ID = Object.fromEntries(SENSORS.map((s) => [s.id, s]))

/** Example packages — presented as starting points, not SKUs. */
export const PACKAGES = [
  { id: 'soil', name: 'Soil package', for: 'Soil moisture, temperature and salinity at plot scale', node: ['soil-standard', 'soil-standard'], base: [] },
  { id: 'fire-weather', name: 'Fire-weather package', for: 'Temperature, humidity, wind and rainfall where conditions change', node: [], base: ['bs-wind', 'bs-rain'] },
  { id: 'restoration', name: 'Restoration package', for: 'Soil moisture and microclimate across a restoration site', node: ['soil-standard'], base: ['bs-rain'] },
  { id: 'research', name: 'Research package', for: 'Consistent plot-level monitoring across trials', node: ['soil-standard'], base: ['bs-solar', 'bs-imager'] },
]

export const SOFTWARE_MODULES = [
  { id: 'dashboard', name: 'Monitoring dashboard', text: 'Fleet status, latest readings, imaging', default: true },
  { id: 'viz', name: 'Data visualization', text: 'Time series, multi-sensor comparison', default: true },
  { id: 'downloads', name: 'Data downloads', text: 'CSV exports with your cleaning preferences', default: true },
  { id: 'cleaning', name: 'Data cleaning', text: 'Gap and outlier preferences applied on export', default: true },
  { id: 'wireless', name: 'Wireless network management', text: 'Every node, every PheNode', default: true },
  { id: 'api', name: 'API access', text: 'Structured data into your own tools (Grafana and more)', default: false },
  { id: 'backend', name: 'Dockerized backend', text: 'Portable backend for advanced, self-managed data flow', default: false },
  { id: 'integration', name: 'Custom integration', text: 'Scoped with Agrela for your workflow', default: false },
]
