import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Lightformer, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * ProductModel3D — one CAD-derived GLB from public/models/ on a studio stage, with hotspots.
 *
 * The GLB carries the structure (built by the model pipeline described in docs/asset-manifest.md):
 *   part_<id>     meshes that highlight and explode together (extras.explode = exploded-view offset, metres)
 *   hotspot_<id>  empties where each callout sits (extras.part, extras.normal = hide when facing away,
 *                 extras.yaw = degrees to turn the model so the part faces the camera)
 * `hotspots` supplies the copy ({ id, label }); anchors with no copy are ignored, copy with no anchor gets no dot.
 *
 * Idle motion is 'spin' (slow turntable) or 'sway' (rocks gently about the front view). It pauses while a part
 * is selected or the visitor drags, and is off entirely when `motion` is false (reduced motion).
 * Loaded with meshopt decoding only (no Draco), so nothing is fetched from a third-party CDN.
 */

const SIGNAL = new THREE.Color('#E08A2E')
const TAU = Math.PI * 2
const wrapAngle = (a) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI

const DOT = {
  dark: { on: 'border-signal bg-signal text-ink', off: 'border-white/70 bg-ink/70 text-paper hover:border-signal', label: 'border-white/10 bg-ink/80 text-paper' },
  light: { on: 'border-signal bg-signal text-ink', off: 'border-ink/50 bg-phenode-white/90 text-ink hover:border-signal', label: 'border-ink/10 bg-phenode-white text-ink shadow-sm' },
}

function Model({ url, hotspots, activeId, onSelect, exploded, idle, motion, tone, resetKey, azimuth, polar, onReady }) {
  const { scene } = useGLTF(url, false, true)
  const camera = useThree((s) => s.camera)
  const clock = useThree((s) => s.clock)

  const { root, parts, anchors, fit } = useMemo(() => {
    const root = scene.clone(true)
    root.updateMatrixWorld(true)
    const parts = {}
    const anchors = {}
    root.traverse((o) => {
      if (o.name.startsWith('part_')) {
        const mats = []
        o.traverse((m) => {
          if (!m.isMesh) return
          m.material = m.material.clone()
          m.material.emissive = SIGNAL.clone()
          m.material.emissiveIntensity = 0
          mats.push(m.material)
          m.castShadow = true
          m.receiveShadow = true
        })
        const e = o.userData.explode || [0, 0, 0]
        parts[o.userData.part || o.name.slice(5)] = { node: o, mats, explode: new THREE.Vector3(e[0], e[1], e[2]), glow: 0 }
      } else if (o.name.startsWith('hotspot_')) {
        const d = o.userData
        anchors[o.name.slice(8)] = {
          pos: o.position.clone(),
          part: d.part,
          normal: d.normal ? new THREE.Vector3(d.normal[0], d.normal[1], d.normal[2]) : null,
          yaw: d.yaw == null ? null : (d.yaw * Math.PI) / 180,
        }
      }
    })
    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    const centre = box.getCenter(new THREE.Vector3())
    const s = 2 / size.length()
    // exploded bounds: shrink and recentre while exploding so the parts stay in frame and above the floor
    const boxEx = new THREE.Box3()
    for (const p of Object.values(parts)) { const b = new THREE.Box3().setFromObject(p.node); if (!b.isEmpty()) boxEx.union(b.translate(p.explode)) }
    const sizeEx = boxEx.isEmpty() ? size : boxEx.getSize(new THREE.Vector3())
    const kEx = Math.min(1, size.y / sizeEx.y, size.length() / sizeEx.length())
    return { root, parts, anchors, fit: { s, centre, centreEx: boxEx.isEmpty() ? centre.clone() : boxEx.getCenter(new THREE.Vector3()), kEx, floor: -(size.y * s) / 2 } }
  }, [scene])

  const spin = useRef()
  const framing = useRef()
  const controls = useRef()
  const ex = useRef(0)
  const dragging = useRef(false)
  const lastTouch = useRef(-10)
  const baseDist = useRef(0)
  const dots = useRef({})
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), n: new THREE.Vector3(), c: new THREE.Vector3(), o: new THREE.Vector3() }), [])

  useEffect(() => { if (resetKey) controls.current?.reset() }, [resetKey])
  useEffect(() => { onReady() }, [onReady])

  const shown = hotspots.filter((h) => anchors[h.id])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const t = state.clock.elapsedTime
    const k = (rate) => Math.min(1, dt * rate)

    // keep the whole model in frame on narrow canvases: back the camera off below a 5:4 aspect
    const cam = state.camera
    if (!baseDist.current) baseDist.current = cam.position.length()
    const want = baseDist.current * Math.max(1, 1.25 / (state.size.width / Math.max(1, state.size.height)))
    const cur = cam.position.length()
    if (Math.abs(cur - want) > 1e-4) cam.position.multiplyScalar(want / cur)

    ex.current += ((exploded ? 1 : 0) - ex.current) * k(4)
    for (const p of Object.values(parts)) p.node.position.copy(p.explode).multiplyScalar(ex.current)
    if (framing.current) {
      const sc = fit.s * (1 + (fit.kEx - 1) * ex.current)
      framing.current.scale.setScalar(sc)
      framing.current.position.copy(tmp.o.lerpVectors(fit.centre, fit.centreEx, ex.current)).multiplyScalar(-sc)
    }

    const a = activeId ? anchors[activeId] : null
    for (const [id, p] of Object.entries(parts)) {
      p.glow += ((a && a.part === id ? 1 : 0) - p.glow) * k(6)
      for (const m of p.mats) m.emissiveIntensity = p.glow * 0.5
    }

    const g = spin.current
    if (g) {
      if (a && a.yaw != null) {
        const camAz = Math.atan2(camera.position.x, camera.position.z)
        g.rotation.y += wrapAngle(camAz - a.yaw - g.rotation.y) * k(2.5)
      } else if (motion && !a && !dragging.current && t - lastTouch.current > 2.5) {
        if (idle === 'spin') g.rotation.y += dt * 0.22
        else g.rotation.y += wrapAngle(0.36 * Math.sin(t * 0.3) - g.rotation.y) * k(1.2)
      }
      g.updateMatrixWorld()
    }

    for (const h of shown) {
      const d = dots.current[h.id]
      const an = anchors[h.id]
      if (!d?.group) continue
      d.group.position.copy(an.pos)
      const p = parts[an.part]
      if (p) d.group.position.addScaledVector(p.explode, ex.current)
      if (!an.normal || !d.el || !g) continue
      d.group.getWorldPosition(tmp.p)
      tmp.n.copy(an.normal).applyQuaternion(g.quaternion)
      const facing = tmp.n.dot(tmp.c.copy(camera.position).sub(tmp.p).normalize()) > -0.05
      if (facing !== d.facing) {
        d.facing = facing
        d.el.style.opacity = facing ? '1' : '0'
        d.el.style.pointerEvents = facing ? 'auto' : 'none'
        d.el.inert = !facing
      }
    }
  })

  const pick = (e) => {
    if (e.delta > 6) return
    e.stopPropagation()
    let o = e.object
    while (o && !o.name.startsWith('part_')) o = o.parent
    const part = o?.userData.part
    const h = part && shown.find((x) => anchors[x.id].part === part)
    if (h) onSelect(h.id === activeId ? null : h.id)
  }

  const c = DOT[tone] || DOT.dark
  return (
    <>
      <group ref={spin}>
        <group ref={framing} scale={fit.s} position={[-fit.centre.x * fit.s, -fit.centre.y * fit.s, -fit.centre.z * fit.s]}>
          <primitive object={root} onClick={pick} />
          {shown.map((h) => (
            <group key={h.id} ref={(el) => { dots.current[h.id] = { ...dots.current[h.id], group: el } }} position={anchors[h.id].pos}>
              <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
                <div ref={(el) => { dots.current[h.id] = { ...dots.current[h.id], el } }} className="transition-opacity duration-300" style={{ pointerEvents: 'auto' }}>
                  <button
                    type="button"
                    aria-label={h.label}
                    aria-pressed={activeId === h.id}
                    onClick={(e) => { e.stopPropagation(); onSelect(activeId === h.id ? null : h.id) }}
                    className={`group relative flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${activeId === h.id ? c.on : c.off}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {activeId !== h.id && <span className={`pointer-events-none absolute left-8 whitespace-nowrap rounded-md border px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${c.label}`}>{h.label}</span>}
                  </button>
                </div>
              </Html>
            </group>
          ))}
        </group>
      </group>
      <ContactShadows position={[0, fit.floor - 0.002, 0]} opacity={tone === 'light' ? 0.38 : 0.5} scale={4} blur={2.4} far={1.6} frames={1} />
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={false}
        enableDamping
        minPolarAngle={polar[0]}
        maxPolarAngle={polar[1]}
        minAzimuthAngle={azimuth ? -azimuth : -Infinity}
        maxAzimuthAngle={azimuth ? azimuth : Infinity}
        onStart={() => { dragging.current = true }}
        onEnd={() => { dragging.current = false; lastTouch.current = clock.elapsedTime }}
        makeDefault
      />
    </>
  )
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <group>
        <Lightformer intensity={2.2} rotation-x={Math.PI / 2} position={[0, 5, -2]} scale={[8, 8, 1]} />
        <Lightformer intensity={1.6} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[6, 3, 1]} color="#dfe7ee" />
        <Lightformer intensity={1.2} rotation-y={-Math.PI / 2} position={[5, 0.5, 1]} scale={[6, 3, 1]} color="#f6efe4" />
        <Lightformer intensity={0.6} rotation-y={Math.PI} position={[0, 0, 6]} scale={[10, 4, 1]} />
      </group>
    </Environment>
  )
}

export default function ProductModel3D({
  url, hotspots, activeId = null, onSelect = () => {}, exploded = false, idle = 'spin', motion = true, active = true,
  tone = 'dark', resetKey = 0, camera = [2.3, 1.1, 2.6], fov = 30, azimuth = null, polar = [Math.PI / 4, Math.PI / 1.9],
  exposure = 1.05, className = '',
}) {
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        // OrbitControls sets an inline touch-action: none on the canvas; this keeps vertical page scrolling on touch screens.
        className="[&_canvas]:!touch-pan-y"
        shadows="percentage"
        dpr={[1, 1.75]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: camera, fov }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = exposure }}
      >
        <Studio />
        <directionalLight position={[3, 5, 2.5]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} shadow-normalBias={0.02} />
        <ambientLight intensity={0.18} />
        {/* No drei <Html> as the fallback: its portal root and the Suspense swap race on unmount under React 19. */}
        <Suspense fallback={null}>
          <Model url={url} hotspots={hotspots} activeId={activeId} onSelect={onSelect} exploded={exploded} idle={idle} motion={motion} tone={tone} resetKey={resetKey} azimuth={azimuth} polar={polar} onReady={onReady} />
        </Suspense>
      </Canvas>
      {!ready && <p className={`pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-[0.2em] uppercase ${tone === 'light' ? 'text-stone-2' : 'text-stone'}`}>Loading model</p>}
    </div>
  )
}
