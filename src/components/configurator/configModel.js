/**
 * Configurator model — pure functions, no React. Everything here maps to real PheNode offerings.
 */
import { SENSOR_BY_ID, SOFTWARE_MODULES } from '../../data/sensors.js'
import { NEEDS } from '../../data/applications.js'

export const APPLICATION_OPTIONS = [
  { id: 'environmental-intelligence', name: 'Environmental intelligence', scene: 'ecosystem' },
  { id: 'agriculture', name: 'Agricultural research', scene: 'field' },
  { id: 'soil', name: 'Soil monitoring', scene: 'field' },
  { id: 'transportation', name: 'Transportation', scene: 'corridor' },
  { id: 'restoration', name: 'Restoration', scene: 'ecosystem' },
  { id: 'fire-weather', name: 'Fire weather', scene: 'corridor' },
  { id: 'urban-heat', name: 'Urban heat', scene: 'city' },
  { id: 'ecology', name: 'Ecological research', scene: 'ecosystem' },
  { id: 'custom', name: 'Custom', scene: 'field' },
]

export const SCALE_OPTIONS = [
  { id: 'single', name: 'Single location', scene: 'single', nodes: 1, bases: 1, hint: 'One base station and its onboard sensors, with a node or two nearby.' },
  { id: 'plot', name: 'Research plot', scene: 'field', nodes: 5, bases: 1, hint: 'A handful of nodes across replicated plots.' },
  { id: 'field', name: 'Field', scene: 'field', nodes: 20, bases: 1, hint: 'One base station commanding nodes across the field.' },
  { id: 'corridor', name: 'Transportation corridor', scene: 'corridor', nodes: 24, bases: 3, hint: 'Nodes at intervals; a base station every few kilometres.' },
  { id: 'restoration', name: 'Restoration site', scene: 'ecosystem', nodes: 10, bases: 1, hint: 'Nodes placed by treatment, slope and aspect.' },
  { id: 'campus', name: 'Campus', scene: 'city', nodes: 16, bases: 2, hint: 'Distributed monitoring across buildings, green space and pavement.' },
  { id: 'urban', name: 'Urban network', scene: 'city', nodes: 40, bases: 4, hint: 'Neighborhood-scale coverage with several base stations.' },
  { id: 'custom', name: 'Custom', scene: 'field', nodes: 10, bases: 1, hint: 'Start anywhere; adjust everything.' },
]

export const NODE_SENSOR_OPTIONS = [
  { id: 'soil-standard', category: 'soil', max: 2 },
]
export const BASE_ADDON_OPTIONS = ['soil-standard', 'water-potential', 'profile-probe', 'custom-sdi12']

export const DEFAULT_CONFIG = {
  application: null,
  scale: null,
  base: { count: 1, connectivity: 'cellular', tower: false },
  nodes: 10,
  nodeTemplate: { soilProbes: 2 },
  nodeOverrides: {},
  baseAddons: { 'soil-standard': 1, 'water-potential': 0, 'profile-probe': 0, 'custom-sdi12': 0 },
  software: SOFTWARE_MODULES.filter((m) => m.default).map((m) => m.id),
}

export function reducer(state, action) {
  switch (action.type) {
    case 'set': return { ...state, [action.key]: action.value }
    case 'application': return { ...state, application: action.value }
    case 'scale': {
      const opt = SCALE_OPTIONS.find((s) => s.id === action.value)
      return { ...state, scale: action.value, nodes: opt ? opt.nodes : state.nodes, base: { ...state.base, count: opt ? opt.bases : state.base.count }, nodeOverrides: {} }
    }
    case 'base': return { ...state, base: { ...state.base, ...action.value } }
    case 'nodes': return { ...state, nodes: Math.max(1, Math.min(100, action.value)), nodeOverrides: Object.fromEntries(Object.entries(state.nodeOverrides).filter(([i]) => Number(i) < action.value)) }
    case 'template': return { ...state, nodeTemplate: { ...state.nodeTemplate, ...action.value } }
    case 'override': return { ...state, nodeOverrides: { ...state.nodeOverrides, [action.index]: { ...(state.nodeOverrides[action.index] || {}), ...action.value } } }
    case 'applyToAll': return { ...state, nodeTemplate: { ...state.nodeTemplate, ...(state.nodeOverrides[action.index] || {}) }, nodeOverrides: {} }
    case 'baseAddon': return { ...state, baseAddons: { ...state.baseAddons, [action.id]: Math.max(0, Math.min(8, action.value)) } }
    case 'software': {
      const set = new Set(state.software); set.has(action.id) ? set.delete(action.id) : set.add(action.id)
      return { ...state, software: [...set] }
    }
    case 'replace': return { ...DEFAULT_CONFIG, ...action.value }
    case 'reset': return { ...DEFAULT_CONFIG }
    default: return state
  }
}

export function nodeProbes(config, index) {
  const o = config.nodeOverrides[index]
  return o && o.soilProbes != null ? o.soilProbes : config.nodeTemplate.soilProbes
}

export function summarize(config) {
  const nodes = config.nodes
  let soilOnNodes = 0
  for (let i = 0; i < nodes; i++) soilOnNodes += nodeProbes(config, i)
  const baseSoil = (config.baseAddons['soil-standard'] || 0) * config.base.count
  const waterPotential = (config.baseAddons['water-potential'] || 0) * config.base.count
  const profile = (config.baseAddons['profile-probe'] || 0) * config.base.count
  const custom = (config.baseAddons['custom-sdi12'] || 0) * config.base.count
  const app = APPLICATION_OPTIONS.find((a) => a.id === config.application)
  const scale = SCALE_OPTIONS.find((s) => s.id === config.scale)
  const software = config.software.map((id) => SOFTWARE_MODULES.find((m) => m.id === id)).filter(Boolean)
  return {
    application: app?.name || 'Not set',
    scale: scale?.name || 'Not set',
    bases: config.base.count,
    connectivity: config.base.connectivity,
    tower: config.base.tower,
    nodes,
    soilSensors: soilOnNodes + baseSoil,
    airLightSensors: nodes,
    waterPotential,
    profileProbes: profile,
    customSensors: custom,
    imagers: config.base.count,
    software,
    apiEnabled: config.software.includes('api'),
    backendEnabled: config.software.includes('backend'),
    measurements: [...new Set([
      ...(config.base.count ? ['Air temperature', 'Relative humidity', 'Air pressure', 'Rainfall', 'Wind speed / direction / gust', 'Solar radiation', 'Imaging'] : []),
      ...(nodes ? ['Lux / daylength', 'Air quality'] : []),
      ...(soilOnNodes + baseSoil ? ['Soil moisture (VWC)', 'Soil temperature', 'Soil EC'] : []),
      ...(waterPotential ? ['Soil water potential'] : []),
      ...(profile ? ['Soil profile 15/30/45/60 cm'] : []),
      ...(custom ? ['Custom / third-party'] : []),
    ])],
  }
}

/** Short, stable reference ID derived from the configuration (not a database key). */
export function referenceId(config) {
  const s = JSON.stringify({ ...config, nodeOverrides: config.nodeOverrides })
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0 }
  return 'PHN-' + h.toString(36).toUpperCase().padStart(6, '0').slice(-6)
}

export function encodeConfig(config) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(config)))).replace(/=+$/, '') } catch { return '' }
}
export function decodeConfig(s) {
  try { return JSON.parse(decodeURIComponent(escape(atob(s)))) } catch { return null }
}

/** Starting configuration from a "need" (solution explorer) id. */
export function configFromNeed(needId) {
  const need = NEEDS.find((n) => n.id === needId)
  if (!need) return null
  const appMap = { soil: 'soil', 'fire-weather': 'fire-weather', 'urban-heat': 'urban-heat', 'ag-microclimate': 'agriculture', roadside: 'transportation', restoration: 'restoration', 'crop-research': 'agriculture', ecological: 'ecology', 'weather-networks': 'environmental-intelligence', custom: 'custom', 'environmental-intelligence': 'environmental-intelligence' }
  const scaleMap = { field: 'field', corridor: 'corridor', city: 'urban', ecosystem: 'restoration' }
  const soilProbes = need.sensors.filter((s) => s === 'soil-standard').length
  const base = { ...DEFAULT_CONFIG, application: appMap[needId] || 'custom', scale: scaleMap[need.scene] || 'field', nodeTemplate: { soilProbes: Math.min(2, soilProbes) } }
  const opt = SCALE_OPTIONS.find((s) => s.id === base.scale)
  base.nodes = opt.nodes; base.base = { ...base.base, count: opt.bases }
  if (need.sensors.includes('custom-sdi12')) base.baseAddons = { ...base.baseAddons, 'custom-sdi12': 1 }
  return base
}

/** Guided mode: answers → suggested configuration. Presented as guidance, not a quote. */
export function configFromAnswers({ monitor, area, frequency, existingSensors }) {
  const appByMonitor = { soil: 'soil', weather: 'environmental-intelligence', vegetation: 'ecology', 'urban-heat': 'urban-heat', fire: 'fire-weather', restoration: 'restoration', plots: 'agriculture', other: 'custom' }
  const scaleByArea = { single: 'single', lt1: 'plot', '1-10': 'plot', '10-100': 'field', '100+': 'field', corridor: 'corridor', city: 'urban', custom: 'custom' }
  const nodesByArea = { single: 2, lt1: 4, '1-10': 8, '10-100': 20, '100+': 40, corridor: 24, city: 40, custom: 10 }
  const cfg = { ...DEFAULT_CONFIG, application: appByMonitor[monitor] || 'custom', scale: scaleByArea[area] || 'field' }
  const opt = SCALE_OPTIONS.find((s) => s.id === cfg.scale)
  cfg.nodes = nodesByArea[area] || opt.nodes
  cfg.base = { ...cfg.base, count: opt.bases, tower: area === 'corridor' || area === '100+' }
  cfg.nodeTemplate = { soilProbes: monitor === 'soil' || monitor === 'plots' || monitor === 'restoration' ? 2 : monitor === 'vegetation' ? 1 : 0 }
  cfg.baseAddons = { ...cfg.baseAddons, 'custom-sdi12': existingSensors === 'yes' ? 1 : 0, 'water-potential': monitor === 'soil' ? 1 : 0 }
  cfg.software = [...new Set([...cfg.software, ...(frequency === 'sub-hourly' || existingSensors === 'yes' ? ['api'] : [])])]
  cfg.notes = frequency === 'sub-hourly' ? 'Wireless nodes transmit hourly; sub-hourly cadence applies to base-station sensors — review with Agrela.' : null
  return cfg
}

export const sensorName = (id) => SENSOR_BY_ID[id]?.name || id
