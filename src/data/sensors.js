/**
 * Sensor catalog (the application pages' example packages and home 05's sensor chips; the configurator that also used it
 * was deleted on Nov 17).
 * Only items Agrela publishes today are "offered"; third-party integration is listed as an
 * open interface (SDI-12 / RS-485 on the base station), not as a product.
 */
export const SENSORS = [
  // Included on the wireless node
  { id: 'ws-lux', name: 'Light intensity (built in)', short: 'Lux', measures: ['Lux / daylength'] },
  // Add-ons. Ambient air plugs into one of the node's two sensor ports (Jake, Nov 17: the node no longer has its own
  // air sensors; no air quality either).
  { id: 'ws-air', name: 'Ambient air sensor', short: 'Air T / RH / pressure', measures: ['Air temperature', 'Relative humidity', 'Air pressure'] },
  { id: 'soil-standard', name: 'Standard soil sensor', short: 'Soil probe', measures: ['Soil moisture (VWC)', 'Soil temperature', 'Soil EC (salinity)'] },
  { id: 'water-potential', name: 'Water potential sensor', short: 'Water potential', measures: ['Soil water potential'] },
  { id: 'profile-probe', name: 'Soil profile probe', short: 'Profile probe', measures: ['Soil moisture at 15/30/45/60 cm', 'Soil temperature at 15/30/45/60 cm'] },
  // Base-station suite
  { id: 'bs-wind', name: 'Wind (base station)', short: 'Wind', measures: ['Wind speed', 'Wind direction', 'Wind gust'] },
  { id: 'bs-rain', name: 'Rainfall (base station)', short: 'Rain', measures: ['Rainfall'] },
  { id: 'bs-solar', name: 'Solar radiation (base station)', short: 'Solar radiation', measures: ['Solar radiation'] },
  { id: 'bs-imager', name: 'Standard imager (base station)', short: '5 MP imager', measures: ['RGB images, 1–4 per day'] },
  // Interface for third-party
  { id: 'custom-sdi12', name: 'Third-party sensor (SDI-12 / RS-485)', short: 'Custom sensor', measures: ['Your sensor, your variable'] },
]

export const SENSOR_BY_ID = Object.fromEntries(SENSORS.map((s) => [s.id, s]))

/** Example packages — presented as starting points, not SKUs. */
export const PACKAGES = [
  { id: 'soil', name: 'Soil package', for: 'Soil moisture, temperature and salinity at plot scale', node: ['soil-standard', 'soil-standard'], base: [] },
  { id: 'fire-weather', name: 'Fire-weather package', for: 'Temperature, humidity, wind and rainfall where conditions change', node: ['ws-air'], base: ['bs-wind', 'bs-rain'] },
  { id: 'restoration', name: 'Restoration package', for: 'Soil moisture and microclimate across a restoration site', node: ['soil-standard', 'ws-air'], base: ['bs-rain'] },
  { id: 'research', name: 'Research package', for: 'Consistent plot-level monitoring across trials', node: ['soil-standard'], base: ['bs-solar', 'bs-imager'] },
]

