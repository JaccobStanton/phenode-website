import { useLayoutEffect, useRef, useState } from 'react'
import { seg, easeOut, useReducedMotion } from '../../lib/motion.js'

/* Small, hand-drawn glyphs for each stage — kept abstract on purpose. */
const Glyphs = {
  environment: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4 30 C 14 22, 26 26, 36 20" /><path d="M4 36 C 16 30, 26 34, 36 28" />
      <path d="M12 22 v-8 M12 14 c-4 0 -6 -3 -6 -6 c3 0 6 2 6 6 M12 14 c4 0 6 -3 6 -6 c-3 0 -6 2 -6 6" />
      <path d="M26 20 v-6 M26 14 c-3 0 -5 -2 -5 -5 c3 0 5 2 5 5 M26 14 c3 0 5 -2 5 -5 c-3 0 -5 2 -5 5" />
    </g>
  ),
  nodes: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      {[6, 16, 26].map((x) => (<g key={x}><rect x={x} y="12" width="8" height="6" rx="1.5" /><path d={`M${x + 1} 20 h6 M${x + 1.5} 23 h5 M${x + 2} 26 h4`} /><path d={`M${x + 4} 12 v-3`} /></g>))}
      <path d="M10 8 a6 6 0 0 1 8 0 M20 8 a6 6 0 0 1 8 0" strokeOpacity="0.6" />
    </g>
  ),
  base: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M8 14 h24 l-4 14 h-16 z" /><rect x="14" y="8" width="12" height="6" rx="1" /><path d="M20 28 v6 M14 34 h12" /><circle cx="29" cy="11" r="1.5" />
    </g>
  ),
  data: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <ellipse cx="20" cy="12" rx="11" ry="4" /><path d="M9 12 v8 c0 2.2 4.9 4 11 4 s11 -1.8 11 -4 v-8" /><path d="M9 20 v8 c0 2.2 4.9 4 11 4 s11 -1.8 11 -4 v-8" />
    </g>
  ),
  software: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="6" y="9" width="28" height="18" rx="2" /><path d="M16 31 h8 M20 27 v4" /><path d="M10 22 l5 -5 l4 3 l6 -7 l5 4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  decision: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20 h16 M18 14 l6 6 l-6 6" /><circle cx="30" cy="20" r="4" />
    </g>
  ),
}

// Stage copy is Jake's (Nov 13). Shown in home 02 "What is PheNode" and the PheNode page's "What PheNode is".
export const CHAIN_STAGES = [
  { id: 'environment', label: 'Environment', text: 'Measure Air, Soil, Light, and Precipitation as a default. Integrate new sensors as needed.', tone: 'signal' },
  { id: 'nodes', label: 'Wireless sensor nodes', text: 'Track the variation in your environment up to 1 km away.', tone: 'signal' },
  { id: 'base', label: 'Base station', text: 'Collects data from all nearby wireless nodes, runs its own sensor suite with imager, and connects to the cloud via cellular, Wi-Fi, or satellite where connectivity is challenging.', tone: 'paper' },
  { id: 'data', label: 'Data platform', text: 'Centralized collection, data cleaning preferences and customizable formatting for normalizing outputs.', tone: 'data' },
  { id: 'software', label: 'Software and API', text: 'Dashboards, robust visualization, accessible API for users and stakeholders, plus a dockerized backend for advanced users.', tone: 'data' },
  { id: 'decision', label: 'Decision support', text: 'Irrigate, replant, inform, revise the model with data-driven decisions.', tone: 'data' },
]

/**
 * Vertical system chain. `progress` 0..1 lights the stages top to bottom.
 * Renders stage copy as real text (accessible) next to the SVG spine. No step numbers under the icons (Jake, Nov 13).
 */
export default function SystemChain({ progress = 1, compact = false }) {
  const reduced = useReducedMotion()
  const n = CHAIN_STAGES.length
  const toneColor = { signal: 'var(--signal-fg, var(--color-signal))', paper: 'var(--fg)', data: 'var(--data-fg, var(--color-data))' }
  const listRef = useRef(null)
  const bubbles = useRef([])
  // The spine runs from the centre of the first bubble to the centre of the last (Decision support) — not past it.
  const [spine, setSpine] = useState(null)
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current, first = bubbles.current[0], last = bubbles.current[n - 1]
      if (!list || !first || !last) return
      // offsetTop ignores the stages' entrance translateY, so the spine never lands off-centre
      const c = (el) => el.parentElement.offsetTop + el.offsetTop + el.offsetHeight / 2
      setSpine({ start: c(first), end: c(last) })
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(listRef.current)
    return () => ro?.disconnect()
  }, [n])
  const len = spine ? spine.end - spine.start : 0
  // Packets run only once every stage is lit, and stop at Decision support; each arrival makes it pulse.
  const flowing = !reduced && spine && progress > 0.9
  return (
    <ol ref={listRef} className="relative grid gap-0" aria-label="The PheNode system">
      {spine && (
        <>
          <div aria-hidden="true" className="absolute left-[27px] w-px bg-current opacity-15 md:left-[31px]" style={{ top: spine.start, height: len }} />
          <div aria-hidden="true" className="absolute left-[27px] w-px origin-top bg-current opacity-60 md:left-[31px]" style={{ top: spine.start, height: len * Math.min(1, progress), transition: reduced ? 'none' : 'height 0.2s linear' }} />
          {flowing && (
            <div aria-hidden="true" className="pointer-events-none absolute left-[27px] w-0 md:left-[31px]" style={{ top: spine.start, height: len, '--chain-len': `${len}px` }}>
              <span className="chain-packet"><span className="amber" /><span className="cyan" /></span>
            </div>
          )}
        </>
      )}
      {CHAIN_STAGES.map((s, i) => {
        const local = easeOut(seg(progress, i / n, (i + 1) / n))
        const color = toneColor[s.tone]
        return (
          <li key={s.id} className={`relative flex items-start gap-5 ${compact ? 'py-4' : 'py-6 md:py-7'}`} style={{ transform: `translateY(${(1 - local) * 10}px)`, transition: reduced ? 'none' : 'opacity 0.3s, transform 0.3s' }}>
            <div ref={(el) => { bubbles.current[i] = el }} className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border md:h-16 md:w-16`} style={{ borderColor: local > 0.6 ? color : 'var(--rule)', color: local > 0.6 ? color : 'var(--fg-muted)', background: 'var(--surface)' }}>
              {flowing && i === n - 1 && <span className="chain-arrive" aria-hidden="true" />}
              <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">{Glyphs[s.id]}</svg>
            </div>
            <div className="pt-1">
              <h3 className="display-sm !text-[1.25rem] md:!text-[1.5rem]">{s.label}</h3>
              {!compact && <p className="mt-1.5 max-w-[44ch] text-[15.5px] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{s.text}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
