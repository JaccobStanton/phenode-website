import { useLayoutEffect, useRef, useState } from 'react'
import { seg, easeInOut, lerp } from '../../lib/motion.js'

export const JOURNEY = [
  { id: 'sensors', label: 'Sensors', state: '23.4 °C · 54 % RH', tone: 'signal', note: 'Air, soil, light, rain, wind — onboard and add-on sensors, SDI-12 / RS-485 for third-party.' },
  { id: 'node', label: 'Wireless node', state: 'LoRaWAN · hourly', tone: 'signal', note: 'Battery + solar. Transmits to the nearest PheNode up to 1 km away.' },
  { id: 'base', label: 'Base station', state: 'Cellular / Wi-Fi / satellite uplink', tone: 'paper', note: 'Collects every node, adds its own sensor suite and imager, coordinates the network.' },
  { id: 'backend', label: 'Backend', state: 'Ingest API', tone: 'data', note: 'Centralized data collection. Dockerized, so advanced users can run their own.' },
  { id: 'processing', label: 'Processing', state: 'Cleaning preferences', tone: 'data', note: 'Your rules for gaps and outliers, applied consistently on export.' },
  { id: 'database', label: 'Database', state: '{ ts, device, temp… }', tone: 'data', note: 'Structured, time-stamped rows for every device and node in the fleet.' },
  { id: 'dashboard', label: 'Dashboard', state: 'Time series · map · images', tone: 'data', note: 'Fleet status, wireless network, visualization, imaging, remote control.' },
  { id: 'export', label: 'Download / API', state: '.csv · JSON', tone: 'data', note: 'Datasets you own. Structured access for your own tools, including Grafana.' },
]

/**
 * Illustration for each stop (public/assets/journey). Sensors, node and base station are the PheNode app's own
 * diagrams (soil probe, wireless sensor, PheNode wireframe); the digital stops are drawn to match them
 * (scripts/gen-journey-art.py).
 */
export const journeyArt = (id) => `${import.meta.env.BASE_URL}assets/journey/${id}.svg`

const W = 1600, H = 260, Y = 140
const xs = JOURNEY.map((_, i) => 100 + (i * (W - 200)) / (JOURNEY.length - 1))

const Icon = ({ id }) => {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (id) {
    case 'sensors': return <g {...s}><path d="M-10 8 l6 -14 l6 10 l4 -6 l4 10" /><circle cx="-12" cy="10" r="2" /></g>
    case 'node': return <g {...s}><rect x="-9" y="-6" width="18" height="10" rx="2" /><path d="M-6 8 h12 M-4 12 h8" /><path d="M-6 -12 a8 8 0 0 1 12 0" /></g>
    case 'base': return <g {...s}><path d="M-14 -4 h28 l-4 10 h-20 z" /><rect x="-6" y="-10" width="12" height="6" rx="1" /><path d="M0 6 v10" /></g>
    case 'backend': return <g {...s}><rect x="-12" y="-10" width="24" height="20" rx="3" /><path d="M-6 -3 h12 M-6 3 h8" /></g>
    case 'processing': return <g {...s}><circle r="9" /><path d="M-4 0 l3 3 l6 -6" /></g>
    case 'database': return <g {...s}><ellipse rx="10" ry="4" cy="-6" /><path d="M-10 -6 v12 c0 2.2 4.5 4 10 4 s10 -1.8 10 -4 v-12" /></g>
    case 'dashboard': return <g {...s}><rect x="-12" y="-9" width="24" height="16" rx="2" /><path d="M-8 2 l4 -4 l4 2 l4 -5 l4 3" /></g>
    case 'export': return <g {...s}><path d="M0 -10 v14 M-5 0 l5 5 l5 -5" /><path d="M-10 8 v4 h20 v-4" /></g>
    default: return null
  }
}

/** Scale factor for the SVG's text so stop labels stay legible (~11.5px+) when the track is drawn narrow (tablets). */
function useTextScale(minPx = 11.5, basePx = 15) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setScale(Math.round(Math.min(1.7, Math.max(1, minPx / (basePx * (w / W)))) * 20) / 20)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [minPx, basePx])
  return [ref, scale]
}

/**
 * Horizontal data journey. `progress` 0..1 drives the packet along the track and highlights the active stop.
 * The caller handles pinning; this component only draws. `crop` trims the empty band above and below the track.
 */
export default function DataJourney({ progress = 0, crop = false }) {
  const [wrap, fs] = useTextScale()
  const n = JOURNEY.length
  const p = easeInOut(seg(progress, 0.02, 0.98))
  const fIndex = p * (n - 1)
  const active = Math.round(fIndex)
  const i0 = Math.floor(fIndex), i1 = Math.min(n - 1, i0 + 1)
  const px = lerp(xs[i0], xs[i1], fIndex - i0)
  const digital = fIndex >= 2.5
  const color = digital ? 'var(--data-fg, var(--color-data))' : fIndex >= 1.5 ? 'var(--fg)' : 'var(--signal-fg, var(--color-signal))'
  const toneColor = { signal: 'var(--signal-fg, var(--color-signal))', paper: 'var(--fg)', data: 'var(--data-fg, var(--color-data))' }
  const gs = 1 + (fs - 1) * 0.5 // stops and icons grow a little with the text
  const top = crop ? 44 : 0
  const height = crop ? Math.round(184 + (fs - 1) * 30) : H
  return (
    <div ref={wrap} className="w-full">
      <svg viewBox={`0 ${top} ${W} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label="A measurement travels from sensors through the wireless node, base station, backend, processing and database to the dashboard and downloads.">
        {/* track */}
        <line x1={xs[0]} x2={xs[n - 1]} y1={Y} y2={Y} stroke="currentColor" strokeOpacity="0.15" strokeWidth={2 * gs} />
        <line x1={xs[0]} x2={px} y1={Y} y2={Y} stroke={color} strokeOpacity="0.9" strokeWidth={2 * gs} />
        {/* the physical → digital threshold at the base station */}
        <line x1={xs[2]} x2={xs[2]} y1={Y - 70} y2={Y + 70} stroke="currentColor" strokeOpacity="0.2" strokeDasharray="4 6" />
        <text x={xs[2] - 10} y={Y - 80} textAnchor="end" fill="var(--signal-fg, var(--color-signal))" fontFamily="var(--font-mono)" fontSize={12 * fs} letterSpacing="2">PHYSICAL</text>
        <text x={xs[2] + 10} y={Y - 80} fill="var(--data-fg, var(--color-data))" fontFamily="var(--font-mono)" fontSize={12 * fs} letterSpacing="2">DIGITAL</text>
        {JOURNEY.map((s, i) => {
          const on = i <= fIndex + 0.5
          const isActive = i === active
          return (
            <g key={s.id} transform={`translate(${xs[i]} ${Y})`} style={{ color: on ? toneColor[s.tone] : 'var(--fg-muted)', transition: 'color 0.3s' }}>
              <circle r={(isActive ? 30 : 24) * gs} fill="var(--surface)" stroke="currentColor" strokeOpacity={on ? 0.9 : 0.35} strokeWidth={isActive ? 2 : 1.2} style={{ transition: 'r 0.3s' }} />
              <g transform={gs !== 1 ? `scale(${gs})` : undefined}><Icon id={s.id} /></g>
              <text y={56 + (fs - 1) * 16} textAnchor="middle" fill="var(--fg)" fontFamily="var(--font-sans)" fontWeight="600" fontSize={15 * fs} opacity={on ? 1 : 0.5}>{s.label}</text>
              <text y={78 + (fs - 1) * 30} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize={11 * fs} letterSpacing="1" opacity={isActive ? 1 : 0}>{s.state}</text>
            </g>
          )
        })}
        {/* packet */}
        <g transform={`translate(${px} ${Y})`}>
          <circle r={12 * gs} fill={color} opacity="0.22" />
          <circle r={5 * gs} fill={color} />
        </g>
      </svg>
    </div>
  )
}

/**
 * Vertical variant for narrow screens: the same stops as a list. With `art`, each stop carries its illustration;
 * the active one is in full colour, the rest stay muted (fixed size, so nothing shifts while scrolling).
 */
export function JourneyList({ progress = 0, className = '', art = false }) {
  const n = JOURNEY.length
  const p = easeInOut(seg(progress, 0.02, 0.98))
  const active = Math.round(p * (n - 1))
  const toneColor = { signal: 'var(--signal-fg, var(--color-signal))', paper: 'var(--fg)', data: 'var(--data-fg, var(--color-data))' }
  return (
    <ol className={`relative flex flex-col ${className}`} aria-label="The data path">
      <span aria-hidden="true" className="absolute left-[19px] top-5 bottom-5 w-px bg-current opacity-15" />
      {JOURNEY.map((s, i) => {
        const on = i <= active
        return (
          <li key={s.id} className={`relative grid gap-3 py-2.5 ${art ? 'grid-cols-[40px_1fr_76px]' : 'grid-cols-[40px_1fr]'}`} style={{ color: on ? toneColor[s.tone] : 'var(--fg-muted)' }}>
            <span className="z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--surface)]" style={{ borderColor: on ? 'currentColor' : 'var(--rule)' }}>
              <svg viewBox="-16 -16 32 32" className="h-6 w-6"><Icon id={s.id} /></svg>
            </span>
            <span className="pt-1">
              <span className="block text-[15px] font-semibold" style={{ color: 'var(--fg)', opacity: on ? 1 : 0.75 }}>{s.label}</span>
              <span className="block font-mono text-[11px] tracking-[0.08em]">{s.state}</span>
              {i === active && <span className="mt-1 block text-[13.5px] leading-snug" style={{ color: 'var(--fg-muted)' }}>{s.note}</span>}
            </span>
            {art && (
              <img src={journeyArt(s.id)} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable="false"
                className="journey-thumb h-14 w-[76px] object-contain" data-on={i === active ? '' : undefined} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
