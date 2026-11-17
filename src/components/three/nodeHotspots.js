/**
 * Hotspot copy for the wireless node explorer — specs from the Summer 2025 Buyer's Guide. Nov 16 (Jake): the node no
 * longer has its own ambient air sensors (that point is gone; its anchor in the model is simply unused), and the
 * sensor ports take up to two sensors for ambient air and/or soil.
 * Where each point sits comes from the model itself: the `hotspot_<id>` empties in public/models/wireless-node.glb.
 */
export const NODE_MODEL = 'wireless-node.glb'

export const HOTSPOTS = [
  { id: 'solar', label: 'Solar panel', text: '6 V solar panel keeps the node charged in direct sunlight for year-round operation.' },
  { id: 'lux', label: 'Light sensor', text: 'Lux window measures overall light and daylength — 188 µLux to 88,000 Lux.' },
  { id: 'radio', label: 'LoRaWAN radio', text: 'Low-power, long-range link to the base station: up to 1 km line of sight. Transmits hourly.' },
  { id: 'battery', label: 'Battery + USB-C', text: 'Internal rechargeable battery. Plug into USB-C to recharge for up to a growing season of full use without sunlight.' },
  { id: 'soil', label: 'Sensor ports', text: 'Plug in up to two sensors to measure ambient air and/or soil conditions.' },
  { id: 'mount', label: 'Mounting bracket', text: 'Black anodized aluminum bracket spans the base of the enclosure; mounts to posts and poles.' },
]
