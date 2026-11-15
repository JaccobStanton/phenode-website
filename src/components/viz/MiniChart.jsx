import { useId, useMemo } from 'react'
import { toPath } from '../../lib/demoData.js'

/**
 * Small SVG time-series chart. `series` = [{ name, data: [{t, v}], color }]. Axes in mono.
 * Deterministic demo data only; callers add the "Demo data" tag. `width` is the drawing's own width (viewBox units):
 * a narrower one keeps the axis labels readable where the chart is shown small, as on phones.
 */
export default function MiniChart({ series, height = 160, width = 600, yLabel, unit = '', className = '', grid = 4, area = true, ticks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }) {
  const id = useId().replace(/:/g, '')
  const W = width, H = height, pad = { l: 40, r: 10, t: 12, b: 24 }
  const all = series.flatMap((s) => s.data.map((p) => p.v))
  const lo = Math.floor(Math.min(...all) - 0.5), hi = Math.ceil(Math.max(...all) + 0.5)
  const paths = useMemo(() => series.map((s) => toPath(s.data, W - pad.l - pad.r, H - pad.t - pad.b, 0, lo, hi)), [series, lo, hi, W, H, pad.l, pad.r, pad.t, pad.b])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-auto w-full ${className}`} role="img" aria-label={`${yLabel || 'Series'} over time (demo data)`}>
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`${id}-g${i}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={s.color} stopOpacity="0.28" /><stop offset="1" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {Array.from({ length: grid + 1 }).map((_, i) => {
        const y = pad.t + (i / grid) * (H - pad.t - pad.b)
        const v = hi - (i / grid) * (hi - lo)
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.12" />
            <text x={pad.l - 6} y={y + 4} textAnchor="end" fill="currentColor" opacity="0.6" fontFamily="var(--font-mono)" fontSize="10">{v.toFixed(0)}{unit}</text>
          </g>
        )
      })}
      {ticks.map((t, i) => (
        <text key={t + i} x={pad.l + (i / (ticks.length - 1)) * (W - pad.l - pad.r)} y={H - 6} textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'} fill="currentColor" opacity="0.6" fontFamily="var(--font-mono)" fontSize="10">{t}</text>
      ))}
      <g transform={`translate(${pad.l} ${pad.t})`}>
        {series.map((s, i) => (
          <g key={s.name}>
            {area && <path d={`${paths[i]} L ${W - pad.l - pad.r} ${H - pad.t - pad.b} L 0 ${H - pad.t - pad.b} Z`} fill={`url(#${id}-g${i})`} />}
            <path d={paths[i]} fill="none" stroke={s.color} strokeWidth="1.8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export function Legend({ series, className = '' }) {
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] tracking-[0.1em] uppercase ${className}`}>
      {series.map((s) => <li key={s.name} className="flex items-center gap-2 opacity-80"><span className="h-[2px] w-4" style={{ background: s.color }} aria-hidden="true" />{s.name}</li>)}
    </ul>
  )
}
