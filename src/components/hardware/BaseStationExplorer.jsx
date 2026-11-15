import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Img, Tag } from '../ui/primitives.jsx'
import BaseStationHotspots from './BaseStationHotspots.jsx'
import { BASE_STATION_PARTS } from '../../data/baseStationParts.js'
import { useReducedMotion } from '../../lib/motion.js'
import { webglOk, modelUrl, ModelBoundary } from '../../lib/webgl.js'

const ProductModel3D = lazy(() => import('../three/ProductModel3D.jsx'))

/**
 * Base station explorer: the 3D model (public/models/base-station.glb, mounted only when near the viewport) with a
 * callout on every component, and the component index beside it. Without WebGL it shows the annotated 2D render.
 */
export default function BaseStationExplorer({ className = '' }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(null)
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

  const current = BASE_STATION_PARTS.find((h) => h.id === active)

  return (
    <div ref={wrap} className={`grid gap-6 lg:grid-cols-12 ${className}`}>
      <div className="relative lg:col-span-8">
        {gl ? (
          <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-[radial-gradient(80%_75%_at_50%_40%,#FFFFFF,#ECE9E1_80%)]">
            <div className="absolute left-4 top-4 z-10 hidden gap-2 sm:flex"><Tag>Interactive</Tag></div>
            <div className="absolute right-4 top-4 z-10">
              <button type="button" onClick={() => { setActive(null); setResetKey((k) => k + 1) }} className="chip !py-1.5 border-ink/20 text-ink/80 hover:border-ink/50"><RotateCcw size={13} /> Reset</button>
            </div>
            <div className="aspect-[4/3] w-full sm:aspect-[3/2] lg:aspect-auto lg:h-[540px]">
              {near && (
                <ModelBoundary onError={() => setGl(false)}>
                  <Suspense fallback={<div className="flex h-full items-center justify-center font-mono text-[11px] tracking-[0.2em] uppercase text-stone-2">Loading model</div>}>
                    <ProductModel3D url={modelUrl('base-station.glb')} hotspots={BASE_STATION_PARTS} activeId={active} onSelect={setActive} idle="sway" motion={!reduced} active={visible} tone="light" resetKey={resetKey} camera={[0, 0.4, 2.6]} azimuth={1.05} polar={[Math.PI / 3.1, Math.PI / 1.95]} />
                  </Suspense>
                </ModelBoundary>
              )}
            </div>
            <p className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.16em] uppercase text-stone-2">Drag to rotate · tap a point to learn more</p>
          </div>
        ) : (
          <>
            <BaseStationHotspots active={active} onSelect={setActive} />
            <div className="absolute left-0 top-0 flex gap-2"><Tag>Base station · annotated</Tag></div>
          </>
        )}
      </div>
      <div className="lg:col-span-4">
        <p className="eyebrow">PheNode base station</p>
        <h3 className="display-sm mt-2">Control box, sensor frame, standard sensor suite, imager.</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-ink/75">The base station communicates with every wireless node, runs its own sensors, coordinates the network and connects the deployment to the data platform over cellular or Wi-Fi, with satellite backup.</p>
        <div className="mt-5 min-h-[88px] rounded-lg border border-ink/10 bg-white p-4" aria-live="polite">
          {current ? (
            <div className="flex items-start gap-4">
              {current.photo && <Img name={current.photo.name} widths={current.photo.widths} sizes="96px" alt={current.photo.alt} className="h-20 w-auto shrink-0 object-contain" />}
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-signal">{current.label}</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/85">{current.text}</p>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-stone-2">Select a point on the hardware.</p>
          )}
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13.5px] text-ink/80" aria-label="Components">
          {BASE_STATION_PARTS.map((h) => (
            <li key={h.id}><button type="button" aria-pressed={active === h.id} onClick={() => setActive(active === h.id ? null : h.id)} className={`text-left hover:text-ink ${active === h.id ? 'text-ink underline underline-offset-4' : ''}`}>{h.label}</button></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
