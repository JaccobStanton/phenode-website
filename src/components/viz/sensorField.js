/**
 * The living sensor field behind the home intro.
 *
 * A perspective landscape of hyperlocal sensor points, seen from just above the ground and gliding slowly forward.
 * A smooth, slowly shifting environmental field colours the points (deep blue → Agrela blue → PheNode cyan, with warm
 * amber pockets where it runs hot), so neighbouring points read differently — the point of hyperlocal measurement.
 * On load the network switches on from the middle of the field outward; after that, points ping (rings + a small
 * reading), and every few seconds a sync wave runs through the network.
 *
 * Canvas 2D with pre-rendered glow sprites drawn additively: no WebGL, small, and cheap enough for phones. The caller
 * pauses it off screen. Reduced motion gets a single still frame with a few readings.
 *
 * Two canvases (Nov 17, performance pass): the field of soft glows, drawn at a lower resolution on phones (filling the
 * pixels is most of each frame's cost there, and a glow looks the same), and an overlay above it for the pings, beams
 * and readings, kept sharp. Without an overlay canvas everything is drawn on the one canvas, as before.
 *
 * It runs on the page or in a worker on OffscreenCanvases (sensorFieldHost.js decides; sensorField.worker.js): nothing
 * here needs the document, given `measure`.
 */

// a frame: requestAnimationFrame, which workers have too where OffscreenCanvas is supported (a timer otherwise)
const nextFrame = (cb) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(cb) : setTimeout(() => cb(performance.now()), 16))
const cancelFrame = (id) => (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id))

export const HORIZON = 0.6 // horizon height as a fraction of the stage (desktop / tablet)
export const HORIZON_PHONE = 0.62

const TAU = Math.PI * 2
const CAM_H = 2.4 // camera height above the ground (world units)
const Z_FAR = 25 // draw distance
const GLIDE = 0.34 // forward drift, world units per second
const FIELD_DPR_PHONE = 1.5 // the field's resolution cap on phones (the overlay keeps up to 2×)
const NC = 20 // cool colour steps
const NW = 4 // warm steps
const COOL = [[16, 48, 118], [26, 117, 224], [64, 188, 246], [116, 244, 238]] // deep blue → Agrela blue → sky → PheNode cyan
const COOL_AT = [0, 0.45, 0.76, 1]
const WARM = [[255, 222, 170], [248, 186, 110], [236, 142, 62]] // warm pockets: pale rim → amber → deep amber (the site's signal colours)
const MONO = '"Geist Mono Variable", "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace'

// Illustrative readings, each derived from the field value at the point (0 = cool/wet … 1 = warm/dry).
const READINGS = [
  { kind: 'Temperature', value: (v) => `${(15.5 + 11 * v).toFixed(1)} °C` },
  { kind: 'Humidity', value: (v) => `${Math.round(82 - 34 * v)} %` },
  { kind: 'Soil moisture', value: (v) => `${(0.38 - 0.19 * v).toFixed(2)} m³/m³` },
  { kind: 'Soil temperature', value: (v) => `${(13.5 + 9 * v).toFixed(1)} °C` },
  { kind: 'Soil EC', value: (v) => `${Math.round(240 + 620 * v)} µS/cm` },
  { kind: 'Water potential', value: (v) => `−${Math.round(18 + 95 * v)} kPa` },
  { kind: 'Light', value: (v) => `${Math.round(21000 + 62000 * v).toLocaleString('en-US')} lux` },
  { kind: 'Wind speed', value: (v) => `${(0.8 + 4.2 * v).toFixed(1)} m/s` },
  { kind: 'Air pressure', value: (v) => `${Math.round(1006 + 12 * v)} hPa` },
]

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t) }

/** Seeded 2D gradient noise, roughly −1…1. */
function perlin(seed) {
  let s = seed >>> 0 || 1
  const rnd = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296
  const base = Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = base[i]; base[i] = base[j]; base[j] = t }
  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++) perm[i] = base[i & 255]
  const gx = [1, -1, 1, -1, 1, -1, 0, 0]
  const gy = [1, 1, -1, -1, 0, 0, 1, -1]
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y)
    const xf = x - xi, yf = y - yi
    const X = xi & 255, Y = yi & 255
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10)
    const a = perm[perm[X] + Y] & 7, b = perm[perm[X + 1] + Y] & 7
    const c = perm[perm[X] + Y + 1] & 7, d = perm[perm[X + 1] + Y + 1] & 7
    const n00 = gx[a] * xf + gy[a] * yf
    const n10 = gx[b] * (xf - 1) + gy[b] * yf
    const n01 = gx[c] * xf + gy[c] * (yf - 1)
    const n11 = gx[d] * (xf - 1) + gy[d] * (yf - 1)
    const x1 = n00 + u * (n10 - n00)
    const x2 = n01 + u * (n11 - n01)
    return x1 + v * (x2 - x1)
  }
}

function coolRGB(t) {
  for (let i = 1; i < COOL_AT.length; i++) {
    if (t <= COOL_AT[i]) {
      const k = (t - COOL_AT[i - 1]) / (COOL_AT[i] - COOL_AT[i - 1])
      return COOL[i - 1].map((c, j) => c + (COOL[i][j] - c) * k)
    }
  }
  return COOL[COOL.length - 1]
}

/** Glow sprites, one per colour step: a white-hot core falling off through the colour to nothing.
 *  Row 0 is the cool field (deep blue → cyan by field value); rows 1–3 are the warm pockets. */
function makeSprites() {
  const out = []
  for (let wi = 0; wi < NW; wi++) {
    for (let ci = 0; ci < NC; ci++) {
      const [r, g, b] = (wi === 0 ? coolRGB(ci / (NC - 1)) : WARM[wi - 1]).map((c) => Math.round(c))
      const hot = [r, g, b].map((c) => Math.round(c + (255 - c) * 0.6))
      const cv = typeof document === 'undefined' ? new OffscreenCanvas(48, 48) : document.createElement('canvas')
      cv.width = cv.height = 48
      const x = cv.getContext('2d')
      const grd = x.createRadialGradient(24, 24, 0, 24, 24, 24)
      grd.addColorStop(0, `rgba(${hot[0]},${hot[1]},${hot[2]},1)`)
      grd.addColorStop(0.16, `rgba(${r},${g},${b},0.95)`)
      grd.addColorStop(0.4, `rgba(${r},${g},${b},0.26)`)
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
      x.fillStyle = grd
      x.fillRect(0, 0, 48, 48)
      out.push({ img: cv, rgb: `${r},${g},${b}` })
    }
  }
  return out
}

/** Stable 0…1 hash of a grid cell, for per-point jitter. */
const hash = (i, k) => {
  let x = Math.imul(i, 374761393) + Math.imul(k, 668265263)
  x = Math.imul(x ^ (x >>> 13), 1274126177)
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296
}

const overlaps = (a, b, pad) => a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @param {{ overlay?: HTMLCanvasElement|OffscreenCanvas, reduced?: boolean,
 *   avoid?: () => ({x:number,y:number,w:number,h:number}|null), measure?: () => ({w:number,h:number,dpr:number}) }} opts
 *   overlay: a canvas the same size, above the field, for the pings and readings.
 *   avoid: the area (in canvas CSS px) that readings must stay clear of — the headline and button.
 *   measure: the canvases' size in CSS px and the screen's pixel ratio (by default read from the canvas and window).
 */
export function createSensorField(canvas, { overlay = null, reduced = false, avoid = () => null, measure = null } = {}) {
  const ctx = canvas.getContext('2d')
  const octx = overlay ? overlay.getContext('2d') : ctx
  const noise = perlin(0x2026)
  const sprites = makeSprites()
  const height = (xw, zw) => 0.65 * noise(xw * 0.055 + 31.7, zw * 0.055 + 3.1) // gentle hills
  const spriteAt = (F, heat) => sprites[(heat < 0.3 ? 0 : heat < 0.6 ? 1 : heat < 0.85 ? 2 : 3) * NC + Math.round(F * (NC - 1))]
  const fieldAt = (xw, zw, t) => {
    const n1 = noise(xw * 0.06 + t * 0.035, zw * 0.06 - t * 0.02)
    const n2 = noise(xw * 0.16 - t * 0.05, zw * 0.16 + 7.3)
    return clamp(0.5 + 0.9 * (0.72 * n1 + 0.28 * n2), 0, 1)
  }
  // warm pockets: small, scattered hot spots in an otherwise cool field
  const heatAt = (xw, zw, t) => clamp((noise(xw * 0.085 + 101.7 + t * 0.012, zw * 0.085 + 57.1) - 0.24) / 0.2, 0, 1)

  let w = 1, h = 1, dpr = 1, odpr = 1, hz = 0, f = 1, dx = 0.62
  const dz = 0.62
  let time = reduced ? 8 : 0
  let offset = 0, exit = 0, last = 0, raf = 0, running = false
  let nextPing = 1.6, nextWave = 7.5, wave = null
  let recent = []
  const pings = []
  const cands = [] // flat [xw, zw, F, …] of points readings may come from (refreshed every frame)

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'
    const H = CAM_H * (1 - 0.3 * exit) // the camera dips toward the ground as the intro scrolls away
    const zNear = Math.max(0.8, ((H - 0.7) * f) / (h - hz + 12))
    const reveal = reduced ? 1e9 : Math.max(0, time - 0.15) * 12 // radius of the switch-on front (world units)
    const revealing = reveal < 70
    cands.length = 0
    const k0 = Math.ceil((offset + zNear) / dz)
    const k1 = Math.floor((offset + Z_FAR) / dz)
    for (let k = k0; k <= k1; k++) {
      const zw = k * dz
      const z = zw - offset
      const fog = 1 - smooth(Z_FAR * 0.42, Z_FAR, z)
      const xmax = ((w / 2 + 30) * z) / f
      const i0 = Math.ceil(-xmax / dx), i1 = Math.floor(xmax / dx)
      const rBase = clamp((0.05 * f) / z, 0.45, 3.4)
      const near = 1 - smooth(4, 8.5, z) // up close the points go soft and large, like out-of-focus bokeh
      for (let i = i0; i <= i1; i++) {
        const xw = (i + (hash(i, k) - 0.5) * 0.8) * dx
        const zj = zw + (hash(k + 7, i) - 0.5) * 0.8 * dz
        const zv = zj - offset
        if (zv < zNear) continue
        const sy = hz + ((H - height(xw, zj)) * f) / zv
        if (sy > h + 8) continue
        const sx = w / 2 + (xw * f) / zv
        // while the network switches on, points beyond the front (and its glow) are skipped before the noise lookups
        const front = revealing ? reveal - Math.hypot(xw, zj - 13) : 0
        if (revealing && front <= -1.4) continue
        const F = fieldAt(xw, zj, time)
        const heat = heatAt(xw, zj, time)
        let a = (0.1 + 0.95 * F * F) * fog * (1 - 0.45 * near)
        let boost = 0
        if (revealing) {
          a *= clamp(front / 2.5, 0, 1)
          boost += clamp(1 - Math.abs(front) / 1.4, 0, 1) * 0.6
        }
        if (wave) boost += clamp(1 - Math.abs(Math.hypot(xw - wave.x, zj - wave.z) - wave.r) / 1.2, 0, 1) * 0.5 * wave.fade
        a += boost * fog
        if (a < 0.015) continue
        const s = rBase * (0.7 + 0.7 * F + boost * 0.5) * (1 + 0.8 * near) * 6
        ctx.globalAlpha = a > 1 ? 1 : a
        ctx.drawImage(spriteAt(F, heat).img, sx - s / 2, sy - s / 2, s, s)
        if (zv > 4.5 && zv < 15 && ((i ^ k) & 1) === 0 && sy > hz + 14) cands.push(xw, zj, F)
      }
    }
    if (octx !== ctx) {
      octx.setTransform(odpr, 0, 0, odpr, 0, 0)
      octx.clearRect(0, 0, w, h)
    }
    drawPings(H)
  }

  function drawPings(H) {
    for (let n = pings.length - 1; n >= 0; n--) {
      const p = pings[n]
      const age = time - p.born
      const z = p.zw - offset
      if (age > 3.4 || z < 1.4) { pings.splice(n, 1); continue }
      const gy = height(p.xw, p.zw)
      const sx = w / 2 + (p.xw * f) / z
      const sy = hz + ((H - gy) * f) / z
      const flat = clamp((H - gy) / z, 0.12, 0.6)
      octx.globalCompositeOperation = 'lighter'
      const flash = clamp(1 - age / 0.9, 0, 1)
      if (flash > 0) {
        const s = clamp((0.05 * f) / z, 0.45, 3.4) * 11
        octx.globalAlpha = flash
        octx.drawImage(p.sprite.img, sx - s / 2, sy - s / 2, s, s)
      }
      octx.lineWidth = 1.25
      octx.strokeStyle = `rgb(${p.sprite.rgb})`
      for (const delay of [0, 0.45]) {
        const a = age - delay
        if (a < 0 || a > 1.9) continue
        const rad = (0.15 + (1 - (1 - a / 1.9) ** 3) * 1.6) * (f / z)
        octx.globalAlpha = (1 - a / 1.9) * 0.75
        octx.beginPath()
        octx.ellipse(sx, sy, rad, rad * flat, 0, 0, TAU)
        octx.stroke()
      }
      if (p.beam) {
        // a reading going up: a soft column of light rising from the point into the sky, gone in under two seconds
        const ba = clamp(age / 0.25, 0, 1) * (1 - smooth(0.5, 1.8, age))
        if (ba > 0.01) {
          const topY = hz - h * 0.34
          const col = octx.createLinearGradient(0, sy, 0, topY)
          col.addColorStop(0, `rgba(${p.sprite.rgb},0.6)`)
          col.addColorStop(0.3, `rgba(${p.sprite.rgb},0.22)`)
          col.addColorStop(1, `rgba(${p.sprite.rgb},0)`)
          octx.globalAlpha = ba
          octx.fillStyle = col
          octx.fillRect(sx - 1.5, topY, 3, sy - topY)
          octx.fillRect(sx - 0.5, topY, 1, sy - topY)
        }
      }
      if (!p.reading) continue
      const la = smooth(0.12, 0.5, age) * (1 - smooth(2.6, 3.3, age))
      if (la < 0.01) continue
      // a leader up from the point, with the reading flagged off its top
      octx.globalCompositeOperation = 'source-over'
      octx.globalAlpha = la
      const top = sy - 30
      const lead = octx.createLinearGradient(0, sy - 5, 0, top)
      lead.addColorStop(0, `rgba(${p.sprite.rgb},0)`)
      lead.addColorStop(1, `rgba(${p.sprite.rgb},0.9)`)
      octx.strokeStyle = lead
      octx.lineWidth = 1
      octx.beginPath()
      octx.moveTo(Math.round(sx) + 0.5, sy - 5)
      octx.lineTo(Math.round(sx) + 0.5, top)
      octx.stroke()
      const tx = p.right ? Math.round(sx) + 7 : Math.round(sx) - 6
      octx.textAlign = p.right ? 'left' : 'right'
      octx.shadowColor = 'rgba(0,0,0,0.7)'
      octx.shadowBlur = 8
      octx.font = `500 9.5px ${MONO}`
      if ('letterSpacing' in octx) octx.letterSpacing = '1.4px'
      octx.fillStyle = 'rgba(150,200,255,0.85)'
      octx.fillText(p.reading.kind.toUpperCase(), tx, top + 2)
      octx.font = `500 13px ${MONO}`
      if ('letterSpacing' in octx) octx.letterSpacing = '0px'
      octx.fillStyle = 'rgba(244,242,236,0.96)'
      octx.fillText(p.reading.value, tx, top + 18)
      octx.shadowBlur = 0
    }
  }

  function spawnPing(withReading = Math.random() < 0.66, age = 0) {
    const n = cands.length / 3
    if (!n) return
    const keep = avoid()
    for (let tries = 0; tries < 14; tries++) {
      const j = Math.floor(Math.random() * n) * 3
      const xw = cands[j], zw = cands[j + 1], F = cands[j + 2]
      const z = zw - offset
      const sx = w / 2 + (xw * f) / z
      const sy = hz + ((CAM_H - height(xw, zw)) * f) / z
      let reading = null, right = true, box = null
      if (withReading) {
        right = sx < w - 200
        // the box the reading occupies, stretched downward for the ~3 s it drifts toward the viewer
        box = { x: right ? sx - 2 : sx - 172, y: sy - 46, w: 174, h: 46 + 34 }
        if (box.x < 8 || box.x + box.w > w - 8 || box.y < hz - 30) continue
        if (keep && overlaps(box, keep, 20)) continue
        if (pings.some((q) => q.box && overlaps(box, q.box, 12))) continue
        const pool = READINGS.filter((r) => !recent.includes(r.kind))
        const pick = pool[Math.floor(Math.random() * pool.length)]
        recent = [...recent.slice(-3), pick.kind]
        reading = { kind: pick.kind, value: pick.value(F) }
      }
      // pings without a reading send a beam up instead, where it won't cross the headline
      const beam = !withReading && !reduced && (!keep || sx < keep.x - 40 || sx > keep.x + keep.w + 40)
      pings.push({ xw, zw, born: time - age, reading, right, box, beam, sprite: spriteAt(clamp(F + 0.25, 0, 1), heatAt(xw, zw, time)) })
      return
    }
  }

  function step(dt) {
    nextPing -= dt
    if (nextPing <= 0 && time > 2.4) { spawnPing(); nextPing = 0.55 + Math.random() * 0.75 }
    nextWave -= dt
    if (!wave && nextWave <= 0 && cands.length) {
      const j = Math.floor(Math.random() * (cands.length / 3)) * 3
      wave = { x: cands[j], z: cands[j + 1], r: 0, fade: 1 }
      nextWave = 8 + Math.random() * 4
    }
    if (wave) {
      wave.r += dt * 7
      wave.fade = 1 - smooth(16, 34, wave.r)
      if (wave.r > 34) wave = null
    }
  }

  function tick(now) {
    raf = 0
    if (!running) return
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    time += dt
    offset += dt * GLIDE * (1 + 6 * exit * exit)
    step(dt)
    draw()
    raf = nextFrame(tick)
  }

  /** Reduced motion: one still frame, with a few readings already up. */
  function still() {
    pings.length = 0
    draw()
    for (let i = 0; i < 3; i++) spawnPing(true, 2.4)
    draw()
  }

  function resize() {
    const m = measure ? measure() : { w: canvas.getBoundingClientRect().width, h: canvas.getBoundingClientRect().height, dpr: window.devicePixelRatio }
    w = Math.max(1, m.w)
    h = Math.max(1, m.h)
    const phone = w < 720
    // the field at up to 1.5× on phones (it was 1.75×), the overlay's rings and readings at up to 2×
    dpr = Math.min(m.dpr || 1, phone ? FIELD_DPR_PHONE : 2)
    odpr = Math.min(m.dpr || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    if (overlay) {
      overlay.width = Math.round(w * odpr)
      overlay.height = Math.round(h * odpr)
    }
    hz = h * (phone ? HORIZON_PHONE : HORIZON)
    f = (3.3 * (h - hz)) / CAM_H // the nearest visible row sits about 3.3 units ahead
    dx = phone ? 0.5 : 0.62
    pings.length = 0
    if (reduced) still()
    else if (!running) draw()
  }

  return {
    resize,
    start() {
      if (reduced || running) return
      running = true
      last = 0
      raf = nextFrame(tick)
    },
    stop() {
      running = false
      cancelFrame(raf)
      raf = 0
    },
    setExit(p) { exit = clamp(p, 0, 1) },
    destroy() {
      running = false
      cancelFrame(raf)
      pings.length = 0
    },
  }
}
