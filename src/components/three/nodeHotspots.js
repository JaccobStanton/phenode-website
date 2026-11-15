/**
 * Hotspot copy for the wireless node explorer — specs from the Summer 2025 Buyer's Guide.
 * Where each point sits comes from the model itself: the `hotspot_<id>` empties in public/models/wireless-node.glb.
 */
export const NODE_MODEL = 'wireless-node.glb'

export const HOTSPOTS = [
  { id: 'solar', label: 'Solar panel', text: '6 V solar panel keeps the node charged in direct sunlight for year-round operation.' },
  { id: 'lux', label: 'Light sensor', text: 'Lux window measures overall light and daylength — 188 µLux to 88,000 Lux.' },
  { id: 'radio', label: 'LoRaWAN radio', text: 'Low-power, long-range link to the base station: up to 1 km line of sight. Transmits hourly.' },
  { id: 'battery', label: 'Battery + USB-C', text: 'Internal rechargeable battery. Plug into USB-C to recharge for up to a growing season of full use without sunlight.' },
  { id: 'air', label: 'Ambient air sensors', text: 'Air temperature (±0.5–1.0 °C), humidity (±3 %), pressure and air quality.' },
  { id: 'soil', label: 'Soil probe ports', text: 'Plug in up to two soil probes — moisture (VWC), temperature and electrical conductivity at multiple depths.' },
  { id: 'mount', label: 'Mounting bracket', text: 'Black anodized aluminum bracket spans the base of the enclosure; mounts to posts and poles.' },
]
