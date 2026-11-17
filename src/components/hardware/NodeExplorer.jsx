import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Layers, RotateCcw } from 'lucide-react'
import { HOTSPOTS, NODE_MODEL } from '../three/nodeHotspots.js'
import { Img, Tag } from '../ui/primitives.jsx'
import { useReducedMotion } from '../../lib/motion.js'
import { webglOk, modelUrl, ModelBoundary } from '../../lib/webgl.js'
import { FEATURES } from '../../data/features.js'

const ProductModel3D = lazy(() => import('../three/ProductModel3D.jsx'))

/**
 * Interactive wireless node: 3D canvas (mounted only when near the viewport), hotspot list with progressive disclosure,
 * exploded view, and a rendered-image fallback when WebGL is unavailable.
 */
export default function NodeExplorer({ className = '' }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(null)
  const [exploded, setExploded] = useState(false)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [gl, setGl] = useState(webglOk)
  const wrap = useRef(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const e = entries[0]
      if (e.isIntersecting) setNear(true)
      setVisible(e.isIntersecting)
    }, { rootMargin: '200px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const current = HOTSPOTS.find((h) => h.id === active)

  return (
    <div ref={wrap} className={`grid gap-6 lg:grid-cols-12 ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(80%_70%_at_50%_30%,#2a3036,#0E1012_75%)] lg:col-span-8" style={{ minHeight: 420 }}>
        <div className="absolute left-4 top-4 z-10 hidden gap-2 sm:flex"><Tag>Interactive</Tag>{!gl && <Tag tone="signal">3D unavailable — showing render</Tag>}</div>
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button type="button" onClick={() => setExploded((v) => !v)} aria-pressed={exploded} className={`chip !py-1.5 border-white/20 text-paper/90 hover:border-white/50 ${exploded ? '!border-signal !text-signal-2' : ''}`}><Layers size={13} /> Exploded view</button>
          <button type="button" onClick={() => { setExploded(false); setActive(null); setResetKey((k) => k + 1) }} className="chip !py-1.5 border-white/20 text-paper/90 hover:border-white/50"><RotateCcw size={13} /> Reset</button>
        </div>
        <div className="aspect-square w-full sm:aspect-[4/3] lg:aspect-auto lg:h-[560px]">
          {gl && near ? (
            <ModelBoundary onError={() => setGl(false)}>
              <Suspense fallback={<div className="flex h-full items-center justify-center font-mono text-[11px] tracking-[0.2em] uppercase text-stone">Loading model</div>}>
                <ProductModel3D url={modelUrl(NODE_MODEL)} hotspots={HOTSPOTS} activeId={active} onSelect={setActive} exploded={exploded} idle="spin" motion={!reduced && !exploded} active={visible} resetKey={resetKey} camera={[1.6, 0.92, 2.5]} polar={[Math.PI / 4.2, Math.PI / 1.85]} />
              </Suspense>
            </ModelBoundary>
          ) : (
            <div className="flex h-full items-center justify-center p-10">
              <Img name="hardware/wireless-node-2026" widths={[320, 600, 880]} sizes="(min-width:1024px) 40vw, 80vw" alt="Agrela wireless sensor node: white enclosure with a solar panel on top, a light sensor window on the front, an antenna, and a mounting bracket with two agnostic sensor ports below." className="max-h-[420px] w-auto object-contain" />
            </div>
          )}
        </div>
        <p className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.16em] uppercase text-stone/80">Drag to rotate · tap a point to learn more</p>
      </div>
      <div className="flex flex-col lg:col-span-4">
        <p className="eyebrow">Wireless sensor node</p>
        <h3 className="display-sm mt-2">Everything the node carries.</h3>
        <ul className="mt-5 flex flex-col divide-y divide-white/10 border-y border-white/10" aria-label="Node components">
          {HOTSPOTS.map((h, i) => (
            <li key={h.id}>
              <button type="button" aria-expanded={active === h.id} onClick={() => setActive(active === h.id ? null : h.id)} className="flex w-full items-start gap-3 py-3 text-left">
                <span className={`mt-[3px] font-mono text-[11px] tracking-[0.12em] ${active === h.id ? 'text-signal' : 'text-stone'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">
                  <span className={`block text-[15px] font-medium ${active === h.id ? 'text-paper' : 'text-paper/80'}`}>{h.label}</span>
                  {active === h.id && <span className="mt-1.5 block text-[14px] leading-relaxed text-paper/70">{h.text}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {/* with a component selected, the note credits the Buyer's Guide, which is hidden for now (data/features.js) */}
        {(!current || FEATURES.buyersGuide) && <p className="mt-4 text-[13px] leading-relaxed text-stone">{current ? 'Specifications from the PheNode Summer 2025 Buyer\'s Guide.' : 'Select a component for a short technical note. Full specifications are on the wireless node page.'}</p>}
      </div>
    </div>
  )
}
