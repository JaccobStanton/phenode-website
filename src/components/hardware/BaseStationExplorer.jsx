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
 * callout on every component, and the component index beside it. A toggle above the frame lets the visitor switch
 * between the 3D model and the annotated render (Jake's PM, Nov 16); both fill the same frame, so switching doesn't
 * move the page, and the selected component carries over. Without WebGL, or if the model fails to load, the
 * annotated render is all there is and the toggle goes.
 */
export default function BaseStationExplorer({ className = '' }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [gl, setGl] = useState(webglOk)
  const [view, setView] = useState('3d') // '3d' | 'annotated'
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
  const show3d = gl && view === '3d'

  return (
    <div ref={wrap} className={`grid gap-6 lg:grid-cols-12 ${className}`}>
      <div className="relative lg:col-span-8">
        {/* the controls sit above the frame, so the annotated render can fill it */}
        <div className="mb-3 flex min-h-9 items-center justify-between gap-3">
          {gl ? <ViewToggle view={view} onChange={setView} /> : <Tag>Base station · annotated</Tag>}
          {show3d && <button type="button" onClick={() => { setActive(null); setResetKey((k) => k + 1) }} className="chip !py-1.5 border-ink/20 text-ink/80 hover:border-ink/50"><RotateCcw size={13} /> Reset</button>}
        </div>
        <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-[radial-gradient(80%_75%_at_50%_40%,#FFFFFF,#ECE9E1_80%)]">
          <div className="relative aspect-[4/3] w-full sm:aspect-[3/2] lg:aspect-auto lg:h-[540px]">
            {show3d ? (near && (
              <ModelBoundary onError={() => setGl(false)}>
                <Suspense fallback={<div className="flex h-full items-center justify-center font-mono text-[11px] tracking-[0.2em] uppercase text-stone-2">Loading model</div>}>
                  <ProductModel3D url={modelUrl('base-station.glb')} hotspots={BASE_STATION_PARTS} activeId={active} onSelect={setActive} idle="sway" motion={!reduced} active={visible} tone="light" resetKey={resetKey} camera={[0, 0.4, 2.6]} azimuth={1.05} polar={[Math.PI / 3.1, Math.PI / 1.95]} />
                </Suspense>
              </ModelBoundary>
            )) : (
              // the render, as large as the frame allows at its own ratio (a size container: cqw/cqh are its content box)
              <div className="absolute inset-0 flex items-center justify-center p-4 [container-type:size] sm:p-6">
                <BaseStationHotspots active={active} onSelect={setActive} className="w-[min(100cqw,calc(100cqh*2400/1625))]" />
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] uppercase text-stone-2">{show3d ? 'Drag to rotate · tap a point to learn more' : 'Tap a point to learn more'}</p>
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

/** "3D model | Annotated": the two ways to explore the base station. */
function ViewToggle({ view, onChange }) {
  return (
    <div role="group" aria-label="Base station view" className="inline-flex rounded-full border border-ink/15 bg-phenode-white/90 p-0.5 shadow-sm backdrop-blur-sm">
      {[['3d', '3D model'], ['annotated', 'Annotated']].map(([id, label]) => (
        <button
          key={id} type="button" aria-pressed={view === id} onClick={() => onChange(id)}
          className={`rounded-full px-3.5 py-1.5 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors ${view === id ? 'bg-ink text-paper' : 'text-ink/75 hover:text-ink'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
