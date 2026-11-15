/**
 * Deterministic demo data for charts and maps. Everything produced here is labelled "Demo data" in the UI.
 * The generator imitates real diurnal cycles and rain events — it is illustrative, not measured.
 */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hourly series over `days` days. Returns { t: hourIndex, v } points. */
export function diurnalSeries({ seed = 1, days = 7, base = 22, amp = 7, noise = 0.6, drift = 0, phase = 15 } = {}) {
  const rnd = mulberry32(seed)
  const out = []
  for (let h = 0; h < days * 24; h++) {
    const hour = h % 24
    const cyc = Math.cos(((hour - phase) / 24) * Math.PI * 2)
    const v = base + drift * (h / (days * 24)) + amp * cyc + (rnd() - 0.5) * noise * 2
    out.push({ t: h, v: Math.round(v * 10) / 10 })
  }
  return out
}

/** Soil moisture: slow drying with rain-event rewetting. */
export function soilMoistureSeries({ seed = 7, days = 14, start = 32, rainAt = [60, 200], rainGain = 9, dryRate = 0.035, noise = 0.15 } = {}) {
  const rnd = mulberry32(seed)
  const out = []
  let v = start
  for (let h = 0; h < days * 24; h++) {
    v -= dryRate * (0.8 + rnd() * 0.4)
    if (rainAt.includes(h)) v += rainGain
    v = Math.max(10, Math.min(45, v))
    out.push({ t: h, v: Math.round((v + (rnd() - 0.5) * noise) * 10) / 10 })
  }
  return out
}

export function rainfallSeries({ seed = 3, days = 14, events = [[60, 6], [200, 11]] } = {}) {
  const rnd = mulberry32(seed)
  const out = []
  for (let h = 0; h < days * 24; h++) {
    let v = 0
    events.forEach(([at, total]) => { if (h >= at && h < at + 5) v += (total / 5) * (0.6 + rnd() * 0.8) })
    out.push({ t: h, v: Math.round(v * 100) / 100 })
  }
  return out
}

/** 2D field variability grid, values 0..1, with a gentle gradient + patches. */
export function fieldGrid({ seed = 11, cols = 12, rows = 8 } = {}) {
  const rnd = mulberry32(seed)
  const patches = Array.from({ length: 4 }, () => ({ x: rnd() * cols, y: rnd() * rows, r: 2 + rnd() * 3, s: (rnd() - 0.5) * 0.9 }))
  const grid = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      let v = 0.45 + 0.25 * (x / cols) - 0.15 * (y / rows)
      patches.forEach((p) => { const d = Math.hypot(x - p.x, y - p.y); v += p.s * Math.max(0, 1 - d / p.r) })
      v += (rnd() - 0.5) * 0.08
      row.push(Math.max(0, Math.min(1, v)))
    }
    grid.push(row)
  }
  return grid
}

/** Node positions scattered within a shape. kind: 'field' | 'corridor' | 'city' | 'ecosystem' | 'single' */
export function nodeLayout(kind, count, seed = 5) {
  const rnd = mulberry32(seed + count)
  const pts = []
  for (let i = 0; i < count; i++) {
    if (kind === 'corridor') {
      const t = (i + 0.5) / count
      pts.push({ x: 0.06 + t * 0.88, y: 0.5 + Math.sin(t * Math.PI * 1.6) * 0.14 + (rnd() - 0.5) * 0.08 })
    } else if (kind === 'city') {
      const cols = Math.ceil(Math.sqrt(count * 1.6)); const rows = Math.ceil(count / cols)
      const c = i % cols; const r = Math.floor(i / cols)
      pts.push({ x: 0.08 + (c + 0.5) / cols * 0.84 + (rnd() - 0.5) * 0.04, y: 0.1 + (r + 0.5) / rows * 0.8 + (rnd() - 0.5) * 0.04 })
    } else if (kind === 'single') {
      pts.push({ x: 0.5, y: 0.5 })
    } else if (kind === 'ecosystem') {
      const a = rnd() * Math.PI * 2; const rr = Math.sqrt(rnd()) * 0.42
      pts.push({ x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr * 0.8 })
    } else {
      const cols = Math.ceil(Math.sqrt(count * 1.5)); const rows = Math.ceil(count / cols)
      const c = i % cols; const r = Math.floor(i / cols)
      pts.push({ x: 0.1 + (c + 0.5) / cols * 0.8, y: 0.12 + (r + 0.5) / rows * 0.76 })
    }
  }
  return pts
}

export const toPath = (series, w, h, pad = 0, yMin, yMax) => {
  const vals = series.map((p) => p.v)
  const lo = yMin ?? Math.min(...vals); const hi = yMax ?? Math.max(...vals)
  const sx = (i) => pad + (i / (series.length - 1)) * (w - pad * 2)
  const sy = (v) => h - pad - ((v - lo) / (hi - lo || 1)) * (h - pad * 2)
  return series.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(p.v).toFixed(1)}`).join(' ')
}
