// Model pipeline, step 2 of 2 — see extract-glb.mjs for setup.
// usage: node scripts/models/build-model.mjs ws <raw>.glb public/models/wireless-node.glb
//        node scripts/models/build-model.mjs ph <raw>.glb public/models/base-station.glb
// The part / finish rules below are keyed to the CAD colour names and positions (mm) of the Nov 2026 exports;
// a re-export with different colours or geometry needs its rules and hotspot anchors checked.

// Raw extracted GLB (metres, base at y = 0, one primitive per CAD colour) → web GLB:
// parts grouped under `part_<id>` nodes, named PBR finishes, `hotspot_<id>` empties (normal / yaw in extras),
// meshopt-simplified geometry with creased normals, quantized and EXT_meshopt_compression'd.
// usage: node scripts/build-model.mjs ws|ph <raw.glb> <out.glb>
import { NodeIO, Document } from '@gltf-transform/core'
import { EXTMeshoptCompression, KHRMeshQuantization, KHRMaterialsClearcoat } from '@gltf-transform/extensions'
import { quantize, reorder } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import * as THREE from 'three'
import { toCreasedNormals, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const [which, input, output] = process.argv.slice(2)
await MeshoptSimplifier.ready; await MeshoptEncoder.ready

const CONFIGS = {
  // ── Agrela wireless sensor node ──────────────────────────────────────────────────────────────────────────
  ws: {
    error: 0.00007, crease: 44,
    finishes: {
      enclosure: { color: '#dfe0e0', rough: 0.4, clearcoat: 0.35 },
      solar: { color: '#1f2226', rough: 0.26, metal: 0.25 },
      bracket: { color: '#1b1c1e', rough: 0.48, metal: 0.55 },
      enamel: { color: '#151617', rough: 0.24 },
      plastic: { color: '#1d1e20', rough: 0.55 },
      washer: { color: '#3c3d3e', rough: 0.7 },
      steel: { color: '#c8cacd', rough: 0.3, metal: 1 },
      brass: { color: '#b48a3a', rough: 0.32, metal: 1 },
      window: { color: '#e4eef2', rough: 0.04, alpha: 0.32 },
      vent: { color: '#b9bec4', rough: 0.62 },
      pcb: { color: '#2f3a94', rough: 0.45 },
      gold: { color: '#e3c878', rough: 0.3, metal: 0.8 },
      chip: { color: '#f4f3ee', rough: 0.4 },
      antenna: { color: '#121314', rough: 0.5 },
    },
    classify(mat, b) {
      const [, cy, cz] = b.c
      switch (mat) {
        case 'Opaque(179,179,179).001': return [b.mn[1] > 55 ? 'lid' : 'body', 'enclosure']
        case 'Opaque(25,25,25).001':
          if (b.mn[1] > 86) return ['solar', 'solar']
          if (b.mn[1] < 5) return ['mount', 'bracket']
          if (b.mn[1] >= 39 && b.mx[1] <= 48.5 && Math.abs(cz) > 40) return ['mount', 'plastic'] // bracket screws
          if (cz > 45 && cy > 55) return ['lux', 'plastic'] // window bezel + sensor bits
          if (b.mn[1] < 30) return ['soil', 'plastic'] // the two glands hanging below
          if (b.mn[1] >= 42.5 && b.mx[1] <= 53 && cz > -40 && cz < 0 && b.tris < 400) return ['soil', 'plastic'] // gland nuts
          return ['body', 'plastic']
        case 'Opaque(64,64,64)': return ['soil', 'washer']
        case 'Acrylic_(Clear)': return ['lux', 'window']
        case 'Opaque(203,203,203).001': return ['body', 'steel']
        case 'Tough_2000_(with_Formlabs_SLA_3D_Printers)': return ['air', 'vent']
        case 'Paint_-_Enamel_Glossy_(Black)': return ['mount', 'enamel']
        case 'Opaque(244,229,167)': return ['lux', 'gold']
        case 'Opaque(48,59,150)': return ['lux', 'pcb']
        case 'Opaque(251,250,245)': return ['lux', 'chip']
        case 'Opaque(168,125,34).001': return ['radio', 'brass']
        case 'Opaque(10,10,10).001': return ['radio', 'antenna']
      }
      throw new Error('unmapped ' + mat)
    },
    // exploded-view offsets (metres) per part
    explode: { solar: [0, 0.04, 0], lid: [0, 0.025, 0], lux: [0, 0.025, 0.028], radio: [0.035, 0.025, 0], body: [0, 0, 0], air: [0, -0.022, 0.012], soil: [0, -0.03, 0], mount: [0, -0.052, -0.012] },
    // hotspot anchors (metres, model frame: x right, y up, z front). normal: hide when facing away; yaw: degrees to turn to.
    hotspots: {
      solar: { pos: [-0.009, 0.0915, 0.005], part: 'solar', normal: [0, 1, 0] },
      lux: { pos: [-0.010, 0.070, 0.0735], part: 'lux', normal: [0, 0, 1], yaw: 0 },
      radio: { pos: [0.0615, 0.150, -0.013], part: 'radio', yaw: 90 },
      battery: { pos: [-0.045, 0.051, 0.0655], part: 'body', normal: [0, 0, 1], yaw: 0 },
      air: { pos: [-0.0095, 0.031, 0.025], part: 'air', normal: [0, -0.5, 0.866], yaw: 0 },
      soil: { pos: [-0.0345, 0.022, -0.022], part: 'soil', normal: [-0.96, -0.28, 0], yaw: -90 },
      mount: { pos: [-0.0095, 0.012, -0.0735], part: 'mount', normal: [0, 0, -1], yaw: 180 },
    },
  },
  // ── PheNode base station ─────────────────────────────────────────────────────────────────────────────────
  ph: {
    error: 0.00022, crease: 44,
    finishes: {
      aluminium: { color: '#cfd2d5', rough: 0.34, metal: 0.85 },
      enclosure: { color: '#dddede', rough: 0.42, clearcoat: 0.3 },
      white: { color: '#ececea', rough: 0.5 },
      plastic: { color: '#1a1b1c', rough: 0.5 },
      gloss: { color: '#151617', rough: 0.26, clearcoat: 0.6 },
      rubber: { color: '#141516', rough: 0.78 },
      solar: { color: '#2d3033', rough: 0.4, metal: 0.2 },
      shield: { color: '#f3f3f1', rough: 0.3 },
      cast: { color: '#c9ccce', rough: 0.5, metal: 0.6 },
      steel: { color: '#c4c7ca', rough: 0.28, metal: 1 },
      brass: { color: '#b48a3a', rough: 0.32, metal: 1 },
      lens: { color: '#14232b', rough: 0.06, metal: 0.3 },
      camera: { color: '#b9babb', rough: 0.45 },
      vent: { color: '#80898c', rough: 0.55 },
      darkgrey: { color: '#3f4041', rough: 0.5 },
      lightgrey: { color: '#c4c4c4', rough: 0.4 },
      connector: { color: '#121212', rough: 0.45 },
    },
    classify(mat, b) {
      const [cx, cy, cz] = b.c
      switch (mat) {
        case 'Opaque(245,245,246)': return ['frame', 'aluminium']
        case 'Opaque(25,25,25)': {
          const tall = b.mx[1] - b.mn[1] > 100
          if (tall && Math.abs(cx) > 160) return ['frame', 'rubber'] // the two grips, front and back faces
          if (cz < -139) return ['frame', 'plastic'] // hardware behind the frame plate
          if (Math.abs(cx) < 140 && cz > -5 && cy > 125 && cy < 300) return ['solar', 'solar'] // panel + junction box
          if (cx > 30 && cx < 120 && cy > 280) return ['wind', 'gloss']
          if (cx < -130 && cy > 175) return ['rain', 'plastic']
          if (cx > -115 && cx < -60 && cy > 285) return ['control', 'gloss'] // antenna capsule
          if (cx > -205 && cx < -100 && cy < 175) return ['imager', 'plastic']
          if (Math.abs(cx) < 110 && cy < 240) return ['control', 'plastic']
          return ['frame', 'plastic']
        }
        case 'Opaque(179,179,179)':
          if (cx < -130 && cy > 175) return ['rain', 'white']
          if (cx < -100) return ['imager', 'camera']
          return ['control', 'enclosure']
        case 'Opaque(203,203,203)':
          if (cy > 300) return ['rain', 'steel'] // bird spikes
          if (cx > 30 && cx < 120 && cy > 280) return ['wind', 'steel']
          if (cx < -130 && cy > 175) return ['rain', 'steel']
          return ['frame', 'steel']
        case 'Opaque(108,196,218)': return ['imager', 'lens']
        case 'Opaque(128,137,140)': return ['control', 'vent']
        case 'Opaque(10,10,10)': return ['control', 'connector']
        case 'Opaque(255,254,246)': return ['control', 'white']
        case 'Opaque(168,125,34)': return ['control', 'brass']
        case 'Opaque(63,63,63)': return ['control', 'darkgrey']
        case 'Opaque(191,191,191)': return ['control', 'lightgrey']
        case 'Paint_-_Enamel_Glossy_(White)': return ['air', 'shield']
        case 'Aluminum_-_Cast': return ['air', 'cast']
      }
      throw new Error('unmapped ' + mat)
    },
    explode: {},
    hotspots: {
      rain: { pos: [-0.191, 0.274, -0.035], part: 'rain', yaw: 0 },
      solar: { pos: [0, 0.2155, 0.084], part: 'solar', normal: [0, 0.7071, 0.7071], yaw: 0 },
      wind: { pos: [0.075, 0.335, -0.042], part: 'wind', yaw: 0 },
      air: { pos: [0.189, 0.207, 0.003], part: 'air', yaw: 25 },
      control: { pos: [0, 0.07, -0.063], part: 'control', normal: [0, 0, 1], yaw: 0 },
      imager: { pos: [-0.151, 0.117, -0.025], part: 'imager', normal: [0, 0, 1], yaw: -10 },
      soil: { pos: [-0.052, 0.022, -0.088], part: 'control', yaw: 0 },
      frame: { pos: [0.16, 0.025, -0.1365], part: 'frame', normal: [0, 0, 1], yaw: 0 },
    },
  },
}

const cfg = CONFIGS[which]
const src = await new NodeIO().read(input)
const lin = (hex) => { const v = parseInt(hex.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }) }

// 1. weld each CAD-colour primitive by position, split into connected components, classify, bucket by part+finish
const buckets = new Map() // `${part}|${finish}` → { pos: number[], idx: number[] }
const report = []
for (const node of src.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue
  for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial().getName()
    const P = prim.getAttribute('POSITION').getArray(), I = prim.getIndices().getArray()
    const key = new Map(), remap = new Uint32Array(P.length / 3), upos = []
    for (let i = 0; i < P.length / 3; i++) {
      const k = `${P[3 * i]},${P[3 * i + 1]},${P[3 * i + 2]}`
      let v = key.get(k); if (v === undefined) { v = key.size; key.set(k, v); upos.push(P[3 * i], P[3 * i + 1], P[3 * i + 2]) }
      remap[i] = v
    }
    const par = new Int32Array(key.size).map((_, i) => i)
    const find = (a) => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a] } return a }
    for (let t = 0; t < I.length; t += 3) { const a = find(remap[I[t]]); par[find(remap[I[t + 1]])] = a; par[find(remap[I[t + 2]])] = a }
    const comps = new Map()
    for (let t = 0; t < I.length; t += 3) {
      const r = find(remap[I[t]]); let c = comps.get(r)
      if (!c) { c = { tris: [], mn: [1e9, 1e9, 1e9], mx: [-1e9, -1e9, -1e9] }; comps.set(r, c) }
      c.tris.push(t)
      for (let k = 0; k < 3; k++) { const v = remap[I[t + k]]; for (let d = 0; d < 3; d++) { const x = upos[3 * v + d] * 1000; if (x < c.mn[d]) c.mn[d] = x; if (x > c.mx[d]) c.mx[d] = x } }
    }
    for (const c of comps.values()) {
      const b = { mn: c.mn, mx: c.mx, c: c.mn.map((v, d) => (v + c.mx[d]) / 2), tris: c.tris.length }
      const [part, finish] = cfg.classify(mat, b)
      if (!cfg.finishes[finish]) throw new Error('no finish ' + finish)
      const id = `${part}|${finish}`
      let bk = buckets.get(id); if (!bk) { bk = { part, finish, map: new Map(), pos: [], idx: [] }; buckets.set(id, bk) }
      for (const t of c.tris) for (let k = 0; k < 3; k++) {
        const v = remap[I[t + k]]; let nv = bk.map.get(v)
        if (nv === undefined) { nv = bk.pos.length / 3; bk.map.set(v, nv); bk.pos.push(upos[3 * v], upos[3 * v + 1], upos[3 * v + 2]) }
        bk.idx.push(nv)
      }
      report.push([mat, part, finish, c.tris.length])
    }
    // the per-bucket vertex map is per source primitive
    for (const bk of buckets.values()) bk.map = new Map()
  }
}

// 2. build the output document
const doc = new Document(); doc.createBuffer()
const cc = doc.createExtension(KHRMaterialsClearcoat)
const scene = doc.createScene(which); const root = doc.createNode('model'); scene.addChild(root)
const mats = {}
for (const [name, f] of Object.entries(cfg.finishes)) {
  const m = doc.createMaterial(name).setBaseColorFactor([...lin(f.color), f.alpha ?? 1]).setRoughnessFactor(f.rough ?? 0.5).setMetallicFactor(f.metal ?? 0)
  if (f.alpha != null) m.setAlphaMode('BLEND').setDoubleSided(true)
  if (f.clearcoat) m.setExtension('KHR_materials_clearcoat', cc.createClearcoat().setClearcoatFactor(f.clearcoat).setClearcoatRoughnessFactor(0.25))
  mats[name] = m
}
const partNodes = {}
const partNode = (part) => {
  if (!partNodes[part]) { partNodes[part] = doc.createNode(`part_${part}`).setExtras({ part, explode: cfg.explode[part] ?? [0, 0, 0] }); root.addChild(partNodes[part]) }
  return partNodes[part]
}
let before = 0, after = 0
const perPart = {}
for (const bk of [...buckets.values()].sort((a, b) => a.part.localeCompare(b.part) || a.finish.localeCompare(b.finish))) {
  let idx = new Uint32Array(bk.idx), pos = new Float32Array(bk.pos)
  before += idx.length / 3
  if (idx.length / 3 > 300) {
    const [out] = MeshoptSimplifier.simplify(idx, pos, 3, 0, cfg.error, ['ErrorAbsolute'])
    idx = out
  }
  // creased normals, then re-index
  let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1))
  g = toCreasedNormals(g, (cfg.crease * Math.PI) / 180)
  g = mergeVertices(g, 1e-6)
  const gp = g.getAttribute('position').array, gn = g.getAttribute('normal').array, gi = g.getIndex().array
  after += gi.length / 3
  perPart[bk.part] = (perPart[bk.part] || 0) + gi.length / 3
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(gp)))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(gn)))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(gi)))
    .setMaterial(mats[bk.finish])
  partNode(bk.part).addChild(doc.createNode(`${bk.part}_${bk.finish}`).setMesh(doc.createMesh(`${bk.part}_${bk.finish}`).addPrimitive(prim)))
}
for (const [id, h] of Object.entries(cfg.hotspots)) {
  const n = doc.createNode(`hotspot_${id}`).setTranslation(h.pos).setExtras({ part: h.part, normal: h.normal ?? null, yaw: h.yaw ?? null })
  root.addChild(n)
}

// 3. compress
await doc.transform(reorder({ encoder: MeshoptEncoder, target: 'size' }), quantize({ quantizePosition: 14, quantizeNormal: 10 }))
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER })
await new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization, KHRMaterialsClearcoat]).registerDependencies({ 'meshopt.encoder': MeshoptEncoder }).write(output, doc)

const agg = {}
for (const [mat, part, finish, t] of report) { const k = `${mat} → ${part}/${finish}`; agg[k] = (agg[k] || 0) + t }
for (const [k, t] of Object.entries(agg)) console.log(String(t).padStart(7), k)
console.log('tris', before, '→', after, ' per part', JSON.stringify(perPart))
