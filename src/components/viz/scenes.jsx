/**
 * Procedural environment scenes (SVG, 1000×600 viewBox). Hardware stays persistent while these change.
 * Each scene draws its landscape; `NodeLayer` and `BaseStationGlyph` are overlaid by the caller.
 * Colors use CSS variables so scenes work on ink and paper.
 */
import { fieldGrid, mulberry32 } from '../../lib/demoData.js'

export const VB = { w: 1000, h: 600 }

/** amber ↔ cyan sequential ramp (0 = cool/wet, 1 = hot/dry) */
export function rampColor(t, alpha = 1) {
  // cyan → pale sand → amber: the light mid-stop keeps cells luminous instead of muddy
  const stops = [[95, 183, 201], [222, 206, 160], [224, 138, 46]]
  const x = Math.max(0, Math.min(1, t)) * 2
  const i = Math.min(1, Math.floor(x)); const f = x - i
  const a = stops[i], b = stops[i + 1]
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f))
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`
}

export function FieldScene({ heat = 0, cols = 12, rows = 8, seed = 11, tint = 0.9 }) {
  const grid = fieldGrid({ seed, cols, rows })
  const x0 = 60, y0 = 60, w = 880, h = 480
  const cw = w / cols, ch = h / rows
  return (
    <g>
      {/* ground */}
      <rect x={x0} y={y0} width={w} height={h} fill="currentColor" opacity="0.04" />
      {/* plot cells with variation */}
      {grid.map((row, r) => row.map((v, c) => (
        <rect key={`${r}-${c}`} x={x0 + c * cw + 2} y={y0 + r * ch + 2} width={cw - 4} height={ch - 4} fill={rampColor(v, 0.7 * tint)} style={{ opacity: heat, transition: 'opacity 0.5s' }} />
      )))}
      {/* row lines (crop rows) */}
      {Array.from({ length: rows + 1 }).map((_, r) => <line key={r} x1={x0} x2={x0 + w} y1={y0 + r * ch} y2={y0 + r * ch} stroke="currentColor" strokeOpacity="0.14" />)}
      {Array.from({ length: cols + 1 }).map((_, c) => <line key={c} x1={x0 + c * cw} x2={x0 + c * cw} y1={y0} y2={y0 + h} stroke="currentColor" strokeOpacity="0.14" />)}
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="currentColor" strokeOpacity="0.35" />
    </g>
  )
}

export function CorridorScene({ heat = 0 }) {
  const road = 'M-20 330 C 200 300, 300 380, 520 330 S 850 270, 1020 320'
  const rnd = mulberry32(21)
  const trees = Array.from({ length: 40 }, (_, i) => ({ x: 20 + i * 25 + rnd() * 10, y: 120 + rnd() * 120, r: 6 + rnd() * 10 }))
  const trees2 = Array.from({ length: 40 }, (_, i) => ({ x: 10 + i * 25 + rnd() * 10, y: 420 + rnd() * 120, r: 6 + rnd() * 10 }))
  return (
    <g>
      {/* terrain bands */}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M-20 ${60 + i * 60} C 250 ${40 + i * 62}, 500 ${90 + i * 58}, 1020 ${50 + i * 60}`} fill="none" stroke="currentColor" strokeOpacity="0.1" />)}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M-20 ${420 + i * 50} C 250 ${400 + i * 52}, 500 ${450 + i * 48}, 1020 ${410 + i * 50}`} fill="none" stroke="currentColor" strokeOpacity="0.1" />)}
      {/* vegetation */}
      {trees.map((t, i) => <circle key={`a${i}`} cx={t.x} cy={t.y} r={t.r} fill="var(--color-sage)" opacity={0.18 + heat * 0.2} />)}
      {trees2.map((t, i) => <circle key={`b${i}`} cx={t.x} cy={t.y} r={t.r} fill="var(--color-sage)" opacity={0.18 + heat * 0.2} />)}
      {/* right-of-way band */}
      <path d={road} fill="none" stroke="var(--color-sage)" strokeOpacity="0.22" strokeWidth="110" />
      {/* roadway */}
      <path d={road} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="26" />
      <path d={road} fill="none" stroke="var(--color-paper)" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="14 12" />
      <path d={road} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="26" transform="translate(0,-2)" style={{ display: 'none' }} />
    </g>
  )
}

export function CityScene({ heat = 0, seed = 4 }) {
  const rnd = mulberry32(seed)
  const blocks = []
  for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) {
    const kind = rnd()
    blocks.push({ x: 50 + c * 90, y: 50 + r * 85, w: 76, h: 70, kind: kind < 0.18 ? 'park' : kind < 0.3 ? 'lot' : kind < 0.42 ? 'industrial' : 'res', t: 0.3 + rnd() * 0.7 })
  }
  const heatOf = (b) => (b.kind === 'park' ? 0.12 : b.kind === 'lot' ? 0.92 : b.kind === 'industrial' ? 0.8 : 0.35 + b.t * 0.35)
  return (
    <g>
      {/* streets grid */}
      {Array.from({ length: 11 }).map((_, c) => <line key={`c${c}`} x1={43 + c * 90} x2={43 + c * 90} y1={40} y2={560} stroke="currentColor" strokeOpacity="0.2" strokeWidth="6" />)}
      {Array.from({ length: 7 }).map((_, r) => <line key={`r${r}`} x1={40} x2={960} y1={43 + r * 85} y2={43 + r * 85} stroke="currentColor" strokeOpacity="0.2" strokeWidth="6" />)}
      {/* corridor */}
      <path d="M-20 300 L 1020 260" stroke="currentColor" strokeOpacity="0.45" strokeWidth="14" fill="none" />
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.kind === 'park' ? 'var(--color-sage)' : 'currentColor'} opacity={b.kind === 'park' ? 0.35 : 0.08 + b.t * 0.08} />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={rampColor(heatOf(b), 0.6)} style={{ opacity: heat, transition: 'opacity 0.5s' }} />
          {b.kind === 'res' && Array.from({ length: 3 }).map((_, k) => <rect key={k} x={b.x + 8 + k * 22} y={b.y + 10} width="14" height="50" fill="currentColor" opacity="0.12" />)}
          {b.kind === 'industrial' && <rect x={b.x + 8} y={b.y + 8} width={b.w - 16} height={b.h - 16} fill="currentColor" opacity="0.14" />}
          {b.kind === 'lot' && Array.from({ length: 5 }).map((_, k) => <line key={k} x1={b.x + 8} x2={b.x + b.w - 8} y1={b.y + 12 + k * 12} y2={b.y + 12 + k * 12} stroke="currentColor" strokeOpacity="0.18" />)}
        </g>
      ))}
    </g>
  )
}

export function EcosystemScene({ heat = 0, seed = 9 }) {
  const rnd = mulberry32(seed)
  const contours = Array.from({ length: 7 }, (_, i) => i)
  const stems = Array.from({ length: 70 }, () => ({ x: 40 + rnd() * 920, y: 120 + rnd() * 440, h: 10 + rnd() * 26, s: rnd() }))
  const water = 'M 620 420 C 700 380, 820 400, 900 440 S 980 520, 940 560 L 600 560 C 560 500, 580 450, 620 420 Z'
  return (
    <g>
      {contours.map((i) => <path key={i} d={`M-20 ${500 - i * 60} C 150 ${470 - i * 55 - (i % 2) * 20}, 350 ${540 - i * 65}, 560 ${480 - i * 58} S 900 ${520 - i * 60}, 1020 ${470 - i * 62}`} fill="none" stroke="currentColor" strokeOpacity={0.12 + i * 0.015} />)}
      <path d={water} fill="var(--color-data)" opacity="0.12" />
      <path d={water} fill="none" stroke="var(--color-data)" strokeOpacity="0.4" />
      {stems.map((s, i) => (
        <g key={i} opacity={0.35 + s.s * 0.4}>
          <line x1={s.x} y1={s.y} x2={s.x} y2={s.y - s.h} stroke="var(--color-sage)" strokeWidth="1.2" />
          <path d={`M${s.x} ${s.y - s.h} c -4 -2 -6 -6 -5 -9 c 4 1 6 4 5 9 M${s.x} ${s.y - s.h + 4} c 4 -2 6 -6 5 -9 c -4 1 -6 4 -5 9`} fill="none" stroke="var(--color-sage)" strokeWidth="1" />
        </g>
      ))}
      {/* microclimate patches */}
      {[[200, 300, 120], [520, 220, 90], [760, 300, 70], [380, 450, 100]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={rampColor(i % 2 ? 0.25 : 0.75, 0.35)} style={{ opacity: heat, transition: 'opacity 0.5s' }} />
      ))}
    </g>
  )
}

export function GreenhouseScene({ heat = 0 }) {
  return (
    <g>
      {/* glass structure */}
      <path d="M120 540 V 220 L 500 90 L 880 220 V 540 Z" fill="var(--color-data)" opacity="0.05" />
      <path d="M120 540 V 220 L 500 90 L 880 220 V 540" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
      {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={120 + i * 108} x2={120 + i * 108} y1={220 - (i < 4 ? i : 7 - i) * 32} y2={540} stroke="currentColor" strokeOpacity="0.14" />)}
      {[1, 2, 3].map((i) => <line key={i} x1={120} x2={880} y1={220 + i * 80} y2={220 + i * 80} stroke="currentColor" strokeOpacity="0.12" />)}
      {/* benches with pots */}
      {[300, 400, 500].map((y, r) => (
        <g key={y}>
          <line x1={180} x2={820} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
          {Array.from({ length: 12 }).map((_, c) => (
            <g key={c}>
              <rect x={190 + c * 54} y={y - 18} width="18" height="16" rx="2" fill="currentColor" opacity="0.14" />
              <rect x={190 + c * 54} y={y - 18} width="18" height="16" rx="2" fill={rampColor(((c * 7 + r * 3) % 10) / 10, 0.6)} style={{ opacity: heat, transition: 'opacity 0.5s' }} />
              <path d={`M${199 + c * 54} ${y - 18} v-10 M${199 + c * 54} ${y - 24} c-4 -1 -6 -4 -5 -7 c3 1 5 3 5 7`} fill="none" stroke="var(--color-sage)" strokeWidth="1.2" />
            </g>
          ))}
        </g>
      ))}
    </g>
  )
}

export function ChamberScene({ heat = 0 }) {
  return (
    <g>
      <rect x="200" y="80" width="600" height="460" rx="8" fill="currentColor" opacity="0.05" />
      <rect x="200" y="80" width="600" height="460" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" />
      {/* light bank */}
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={230 + i * 56} y={100} width="40" height="6" rx="2" fill="var(--color-signal-2)" opacity="0.55" />)}
      <rect x="220" y="110" width="560" height="60" fill="url(#chamberLight)" opacity="0.5" />
      {/* shelves */}
      {[250, 350, 450].map((y, r) => (
        <g key={y}>
          <line x1={230} x2={770} y1={y + 40} y2={y + 40} stroke="currentColor" strokeOpacity="0.35" strokeWidth="3" />
          {Array.from({ length: 10 }).map((_, c) => (
            <g key={c}>
              <rect x={240 + c * 54} y={y + 22} width="16" height="16" rx="2" fill="currentColor" opacity="0.16" />
              <rect x={240 + c * 54} y={y + 22} width="16" height="16" rx="2" fill={rampColor(((c * 3 + r * 5) % 10) / 10, 0.6)} style={{ opacity: heat, transition: 'opacity 0.5s' }} />
              <path d={`M${248 + c * 54} ${y + 22} v-8 M${248 + c * 54} ${y + 17} c-3 -1 -5 -3 -4 -6 c3 1 4 3 4 6`} fill="none" stroke="var(--color-sage)" strokeWidth="1.2" />
            </g>
          ))}
        </g>
      ))}
      <defs><linearGradient id="chamberLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--color-signal-2)" stopOpacity="0.5" /><stop offset="1" stopColor="var(--color-signal-2)" stopOpacity="0" /></linearGradient></defs>
    </g>
  )
}

export const SCENES = { field: FieldScene, corridor: CorridorScene, city: CityScene, ecosystem: EcosystemScene, greenhouse: GreenhouseScene, chamber: ChamberScene }

/** Base-station glyph (frame silhouette) drawn at x,y with a given scale. */
export function BaseStationGlyph({ x, y, s = 1, active = true, label, uplink = true, reduced = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* data uplink: readings leave the base station as data (cyan), rising toward the cloud */}
      {active && uplink && (
        <g>
          <path d="M0 -24 V -66" stroke="var(--color-data)" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="2 4" fill="none" />
          <circle cy="-66" r="4" fill="none" stroke="var(--color-data)" strokeOpacity="0.8" strokeWidth="1" />
          <path d="M-3 -63 l3 -5 l3 5" fill="none" stroke="var(--color-data)" strokeOpacity="0.8" strokeWidth="1" />
          {!reduced && (
            <circle r="2.6" fill="var(--color-data)" opacity="0">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M0 -24 V -66" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="2.2s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      )}
      <g fill="none" stroke={active ? 'var(--color-paper)' : 'currentColor'} strokeWidth="2" strokeLinejoin="round" opacity={active ? 1 : 0.5}>
        <path d="M-24 -10 h48 l-6 18 h-36 z" fill="var(--color-ink)" fillOpacity="0.5" />
        <rect x="-10" y="-20" width="20" height="10" rx="1.5" fill="var(--color-ink)" />
        <path d="M0 8 v18 M-10 26 h20" />
        <circle cx="19" cy="-16" r="3" />
      </g>
      {active && <circle r="7" cy="-2" fill="var(--color-data)" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite" /></circle>}
      {label && <text y="44" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.5">{label}</text>}
    </g>
  )
}

/**
 * SceneLegend — the key every scene diagram shares, so the symbols never have to be guessed:
 * base station, wireless node, LoRaWAN link, readings sent hourly (amber), data uplink (cyan). Nodes measure every
 * 15 minutes and send the readings hourly (Jake, Nov 17).
 */
export function SceneLegend({ className = '', nodes = true, uplink = true }) {
  const item = 'flex items-center gap-2 whitespace-nowrap'
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/10 px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-stone ${className}`} aria-label="Diagram key">
      <span className={item}>
        <svg viewBox="-26 -22 52 50" className="h-4 w-4" aria-hidden="true"><g fill="none" stroke="var(--color-paper)" strokeWidth="3" strokeLinejoin="round"><path d="M-24 -10 h48 l-6 18 h-36 z" /><rect x="-10" y="-20" width="20" height="10" rx="1.5" /><path d="M0 8 v18 M-10 26 h20" /></g></svg>
        Base station
      </span>
      {nodes && (
        <span className={item}>
          <svg viewBox="-10 -12 20 22" className="h-4 w-4" aria-hidden="true"><rect x="-6" y="-7" width="12" height="8" rx="1.5" fill="var(--color-ink)" stroke="var(--color-paper)" strokeOpacity="0.9" /><path d="M-4 3 h8 M-3 6 h6" stroke="var(--color-paper)" strokeOpacity="0.7" /><circle r="2.2" cy="-3" fill="var(--color-signal)" /></svg>
          Wireless node
        </span>
      )}
      {nodes && (
        <span className={item}>
          <svg viewBox="0 0 28 8" className="h-2 w-7" aria-hidden="true"><path d="M1 4 H27" stroke="var(--color-signal)" strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="3 3" /></svg>
          LoRaWAN link
        </span>
      )}
      <span className={item}><span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />Readings · sent hourly</span>
      {uplink && <span className={item}><span className="h-2 w-2 rounded-full bg-data" aria-hidden="true" />Data uplink · cellular / Wi‑Fi / satellite</span>}
    </div>
  )
}

/** Wireless node glyph. */
export function NodeGlyph({ x, y, s = 1, color = 'var(--color-signal)', value, active = true, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={active ? 1 : 0.35}>
      <circle r="12" fill={color} opacity="0.18">{active && <animate attributeName="r" values="8;18;8" dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />}</circle>
      <rect x="-6" y="-7" width="12" height="8" rx="1.5" fill="var(--color-ink)" stroke="var(--color-paper)" strokeOpacity="0.8" />
      <path d="M-4 3 h8 M-3 6 h6" stroke="var(--color-paper)" strokeOpacity="0.7" />
      <circle r="2.2" cy="-3" fill={color} />
      {value != null && <text y="-14" textAnchor="middle" fill="var(--color-paper)" fontFamily="var(--font-mono)" fontSize="10" opacity="0.9">{value}</text>}
    </g>
  )
}

/** Link from node to base station: a faint line plus optional travelling pulse. */
export function Link({ from, to, pulse = false, delay = 0, color = 'var(--color-signal)', opacity = 0.35 }) {
  const d = `M${from.x} ${from.y} L${to.x} ${to.y}`
  return (
    <g>
      <path d={d} stroke={color} strokeOpacity={opacity} strokeWidth="1" strokeDasharray="3 4" fill="none" />
      {pulse && (
        <circle r="2.6" fill={color} opacity="0">
          <animateMotion dur="2.6s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
          <animate attributeName="opacity" to="1" dur="0.01s" begin={`${delay}s`} fill="freeze" />
        </circle>
      )}
    </g>
  )
}
