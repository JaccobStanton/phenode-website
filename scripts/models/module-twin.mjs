// A model's twin for hosted previews that can't serve .glb (the Claude preview): GLB → JS module,
// `export default '<base64 GLB>'`, with EXT_meshopt_compression taken out so loading it needs no WebAssembly.
// ProductModel3D loads twins with import() when the build sets VITE_MODEL_SUFFIX=.js (src/lib/webgl.js).
// usage: node scripts/models/module-twin.mjs public/models/base-station.glb dist-preview/models/base-station.glb.js
// One-time setup (not a site dependency): npm i --no-save @gltf-transform/core @gltf-transform/extensions meshoptimizer
import { writeFileSync } from 'node:fs'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'

const [input, output] = process.argv.slice(2)
await MeshoptDecoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder })
const doc = await io.read(input)
// decoded on read; without the extension the geometry is written out plain (still quantized: KHR_mesh_quantization)
for (const ext of doc.getRoot().listExtensionsUsed()) if (ext.extensionName === 'EXT_meshopt_compression') ext.dispose()
const glb = await io.writeBinary(doc)
writeFileSync(output, `export default '${Buffer.from(glb).toString('base64')}'\n`)
console.log(`${output}: ${glb.byteLength} bytes of GLB`)
