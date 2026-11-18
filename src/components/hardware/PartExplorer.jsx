import { useEffect, useRef, useState } from 'react'
import { Img } from '../ui/primitives.jsx'
import { BASE_STATION_PARTS, BASE_STATION_WIDTHS } from '../../data/baseStationParts.js'
import { useReducedMotion } from '../../lib/motion.js'

// the render's silhouette alone (8 KB; it was the 100 KB render itself, fetched a second time for the mask, Nov 17)
const MASK = `url(${import.meta.env.BASE_URL}assets/hardware/base-station-v4-mask-800.webp)`
const ASPECT = 2400 / 1625
const REACH = 16 // how close (in % of the render's height) the pointer must be to a component to pick it
const GLIDE = 'cubic-bezier(0.65, 0, 0.35, 1)'

/**
 * PartExplorer — the base-station render with every component as a target, and an index strip underneath.
 *
 * Overview: point at the render and the nearest component lights up (spotlight + dot), with its name and one line
 * under the strip; until the visitor interacts it quietly walks through the parts on its own. Clicking the render
 * (or a name in the strip) calls `onSelect(id)`.
 *
 * Close-up (`selected` set — the home hero's detail view): the render becomes a framed card and the camera glides in
 * to that component (zoom and fx/fy from baseStationParts.js). Choosing another component pans across the hardware
 * to it. The full-size render is fetched as soon as a close-up is likely, so the zoom stays sharp.
 */
export default function PartExplorer({ selected = null, onSelect, className = '', imageSizes = '(min-width:1024px) 54vw, 92vw', eager = true, style }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(null)
  const [touched, setTouched] = useState(false)
  const [hiRes, setHiRes] = useState(false)
  const box = useRef(null)

  // Idle tour: step through the parts until the first interaction (never under reduced motion, never in a close-up).
  useEffect(() => {
    if (touched || reduced || selected) return
    let i = 0
    const t = setInterval(() => { i = (i + 1) % BASE_STATION_PARTS.length; setActive(BASE_STATION_PARTS[i].id) }, 2600)
    const first = setTimeout(() => setActive(BASE_STATION_PARTS[0].id), 1200)
    return () => { clearInterval(t); clearTimeout(first) }
  }, [touched, reduced, selected])

  const sel = BASE_STATION_PARTS.find((p) => p.id === selected) || null
  const current = sel || BASE_STATION_PARTS.find((p) => p.id === active) || null
  const enter = (id) => { setTouched(true); setActive(id) }
  const leave = () => setActive(null)
  const choose = (id) => { setTouched(true); setHiRes(true); onSelect?.(id) }

  // The whole render is the target: the component nearest the pointer, if it is within reach.
  const nearest = (e) => {
    const r = box.current.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * 100
    const py = ((e.clientY - r.top) / r.height) * 100
    let best = null, bd = Infinity
    for (const p of BASE_STATION_PARTS) {
      const d = Math.hypot((p.x - px) * ASPECT, p.y - py)
      if (d < bd) { bd = d; best = p }
    }
    return bd < REACH ? best : null
  }
  const onMove = (e) => {
    if (sel) return
    const p = nearest(e)
    if (p) { if (p.id !== active || !touched) enter(p.id) } else if (touched && active) leave()
  }
  const onClick = (e) => { if (sel) return; const p = nearest(e); if (p) choose(p.id) }

  // Close-up framing: scale about the centre, then shift so the component's focus point lands in the middle.
  const z = sel ? sel.zoom : 1
  const fx = sel ? (sel.fx ?? sel.x) : 50
  const fy = sel ? (sel.fy ?? sel.y) : 50
  const glide = (props) => (reduced ? 'none' : props.map((p) => `${p} 1.05s ${GLIDE}`).join(', '))
  // The card's clip switches rather than animates (Nov 18: Safari repaints an animated clip-path on every frame). It
  // closes the moment a close-up starts, while the render is still full size inside the frame, and opens once the
  // camera is all the way back (after the 1.05 s glide; a 0 s transition with a delay holds the old clip until then).
  // Both times nothing is cut, so the switch can't be seen, and the zoom never spills over the details or the headline.
  const frame = reduced || sel ? 'none' : 'clip-path 0s linear 1.1s'

  return (
    <div className={className} style={style}>
      <div
        ref={box}
        className="relative aspect-[2400/1625] w-full"
        style={{ cursor: !sel && active && touched ? 'pointer' : 'default' }}
        onPointerEnter={() => setHiRes(true)}
        onPointerMove={onMove}
        onPointerLeave={() => { if (!sel) leave() }}
        onClick={onClick}
      >
        {/* Agrela-blue halo, then the neutral lift; both soften in a close-up. The halo's softness is all in the gradient:
            it was a blur filter until Nov 18, which the browser had to repaint as the close-up opened (with the image's
            drop shadow, the cause of the stutter when choosing a component on the live site). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-16%] inset-y-[-18%]" style={{ background: 'radial-gradient(50% 50% at 50% 48%, rgba(26,117,224,0.40) 0%, rgba(26,117,224,0.30) 25%, rgba(26,117,224,0.19) 48%, rgba(26,117,224,0.09) 68%, rgba(26,117,224,0.03) 84%, transparent 100%)', opacity: sel ? 0.5 : 1, transition: glide(['opacity']) }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-[-12%] rounded-full bg-[radial-gradient(closest-side,rgba(244,242,236,0.10),transparent_70%)]" style={{ opacity: sel ? 0 : 1, transition: glide(['opacity']) }} />

        {/* The frame: open around the whole station, a rounded card around a close-up */}
        <div className="absolute inset-0" style={{ clipPath: sel ? 'inset(0% round 28px)' : 'inset(-40% round 0px)', transition: frame }}>
          <div aria-hidden="true" className="absolute inset-0 rounded-[28px] border border-white/10 bg-[radial-gradient(70%_70%_at_50%_45%,rgba(26,117,224,0.16),rgba(255,255,255,0.025)_70%)]" style={{ opacity: sel ? 1 : 0, transition: glide(['opacity']) }} />
          <div className="absolute inset-0" style={{ transform: `translate(${(-z * (fx - 50)).toFixed(3)}%, ${(-z * (fy - 50)).toFixed(3)}%) scale(${z})`, transition: glide(['transform']) }}>
            <Img
              name="hardware/base-station-v4" widths={BASE_STATION_WIDTHS} sizes={hiRes ? '(min-width:1024px) 140vw, 260vw' : imageSizes}
              alt="PheNode base station: aluminum sensor frame with rain gauge, solar panel, wind sensor, radiation shield, imager, control box and a soil probe."
              className="relative h-full w-full object-contain" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined}
            />
            {/* spotlight (overview): dims everything except the component under the pointer, masked to the product's own
                silhouette so the dimming never shows as a box over the glow */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-opacity duration-500" style={{ opacity: current && !sel ? 1 : 0, background: current ? `radial-gradient(circle at ${current.x}% ${current.y}%, rgba(14,16,18,0) 0, rgba(14,16,18,0) 90px, rgba(14,16,18,0.45) 210px)` : 'none', WebkitMaskImage: MASK, maskImage: MASK, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }} />
          </div>
          {/* close-up vignette: the rest of the station falls away toward the card's edges */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_62%_at_50%_50%,transparent_40%,rgba(14,16,18,0.78)_100%)]" style={{ opacity: sel ? 1 : 0, transition: glide(['opacity']) }} />
        </div>

        {/* component markers (overview). Pointer only: the strip below is the keyboard / screen-reader equivalent. */}
        {BASE_STATION_PARTS.map((p) => {
          const on = current?.id === p.id
          return (
            <div key={p.id} aria-hidden="true" className="pointer-events-none absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: sel ? 0 : 1, transition: 'opacity 0.3s' }}>
              <span className={`relative block rounded-full transition-all duration-300 ${on ? 'h-3 w-3 bg-signal' : 'h-2 w-2 bg-paper/60'}`}>
                {on && !sel && <span className="absolute inset-0 rounded-full bg-signal" style={{ animation: reduced ? 'none' : 'pulse-ring 2.2s ease-out infinite' }} />}
              </span>
              <span className={`absolute inset-0 rounded-full border transition-opacity duration-300 ${on ? 'border-signal/70 opacity-100' : 'opacity-0'}`} />
            </div>
          )
        })}
      </div>

      {/* index strip: lights up with the component under the pointer; choosing one opens its close-up */}
      <div className="mt-5">
        {/* nine components since the solar radiation sensor joined (Nov 17): 3 × 3 from sm, 2 columns on phones */}
        <ul className="mx-auto grid w-fit grid-cols-2 justify-items-start gap-x-6 gap-y-1 border-t border-white/10 pt-4 sm:grid-cols-3" aria-label="Base station components">
          {BASE_STATION_PARTS.map((p) => {
            const on = current?.id === p.id
            return (
              <li key={p.id}>
                <button
                  type="button" data-part={p.id} aria-pressed={selected === p.id}
                  onPointerEnter={() => { if (!sel) enter(p.id) }} onPointerLeave={() => { if (!sel) leave() }}
                  onFocus={() => { if (!sel) enter(p.id) }} onBlur={() => { if (!sel) leave() }}
                  onClick={() => choose(p.id)}
                  className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors duration-300 ${on ? 'text-paper' : 'text-stone hover:text-paper/80'}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${on ? 'bg-signal' : 'bg-stone/50'}`} aria-hidden="true" />
                  {p.label}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 min-h-[3.25rem] px-1.5 text-center" aria-live="polite">
          <div className="transition-opacity duration-300" style={{ opacity: current && !sel ? 1 : 0 }}>
            <p className="text-[18px] font-semibold tracking-tight text-paper">{current && !sel ? current.label : ' '}</p>
            <p className="mt-0.5 text-[14px] text-stone">{current && !sel ? current.short : ' '}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
