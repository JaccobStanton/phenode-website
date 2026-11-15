// Model pipeline, step 1 of 2 — pull the product mesh out of a Blender GLB export.
// usage: node scripts/models/extract-glb.mjs "<export>.glb" "<node name>" <raw>.glb
//   PheNode for web.glb → node "PheNode Complete for web";  WS for web.glb → node "WS for web"
// One-time setup (not a site dependency): npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer

// Pull one node's mesh out of a Blender export, drop the node rotation (mesh data is already Y-up, +Z front, cm),
// convert to metres, centre on X/Z with the base at y = 0, and colour materials from their CAD names.
import { NodeIO, Document } from '@gltf-transform/core'
const [input, nodeName, output] = process.argv.slice(2)
const src = await new NodeIO().read(input)
const node = src.getRoot().listNodes().find((n) => n.getName() === nodeName)
const mesh = node.getMesh()
let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
for (const p of mesh.listPrimitives()) { const a = p.getAttribute('POSITION'); const mn = a.getMin([]), mx = a.getMax([]); for (let i = 0; i < 3; i++) { min[i] = Math.min(min[i], mn[i]); max[i] = Math.max(max[i], mx[i]) } }
const c = [(min[0] + max[0]) / 2, min[1], (min[2] + max[2]) / 2]
const doc = new Document(); doc.createBuffer()
const scene = doc.createScene(nodeName); const root = doc.createNode('model'); scene.addChild(root)
const srgb = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
for (const p of mesh.listPrimitives()) {
  const P = p.getAttribute('POSITION').getArray(), N = p.getAttribute('NORMAL').getArray()
  const pos = new Float32Array(P.length)
  for (let i = 0; i < P.length; i += 3) { pos[i] = (P[i] - c[0]) / 100; pos[i + 1] = (P[i + 1] - c[1]) / 100; pos[i + 2] = (P[i + 2] - c[2]) / 100 }
  const name = p.getMaterial().getName()
  const m = name.match(/Opaque\((\d+),(\d+),(\d+)\)/)
  const col = m ? [srgb(+m[1]), srgb(+m[2]), srgb(+m[3]), 1] : p.getMaterial().getBaseColorFactor()
  const mat = doc.createMaterial(name).setBaseColorFactor(col).setRoughnessFactor(0.6).setMetallicFactor(0)
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(N)))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(p.getIndices().getArray())))
    .setMaterial(mat)
  root.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(prim)))
}
await new NodeIO().write(output, doc)
console.log(nodeName, 'size (m)', max.map((v, i) => +((v - min[i]) / 100).toFixed(3)), 'centre (cm)', c.map((v) => +v.toFixed(2)))
