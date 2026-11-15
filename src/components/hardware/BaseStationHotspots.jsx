import { Img } from '../ui/primitives.jsx'
import { BASE_STATION_PARTS } from '../../data/baseStationParts.js'

/**
 * The annotated 2D base-station render (hardware/base-station-v4) — what BaseStationExplorer shows when WebGL
 * is unavailable. Positions and copy are shared with the hero's PartExplorer.
 */
export default function BaseStationHotspots({ active = null, onSelect = () => {}, className = '' }) {
  return (
    <div className={`relative aspect-[2400/1625] w-full ${className}`}>
      <Img name="hardware/base-station-v4" widths={[600, 1000, 1600, 2400]} sizes="(min-width:1024px) 60vw, 92vw" alt="PheNode base station with each component annotated." className="h-full w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.18)]" />
      {BASE_STATION_PARTS.map((h) => (
        <button
          key={h.id} type="button" aria-label={h.label} aria-pressed={active === h.id}
          onClick={() => onSelect(active === h.id ? null : h.id)}
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span className={`relative flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${active === h.id ? 'border-signal bg-signal' : 'border-ink/60 bg-phenode-white/90 group-hover:border-signal'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            {active !== h.id && <span className="absolute inset-0 rounded-full border border-ink/30" style={{ animation: 'pulse-ring 3s ease-out infinite' }} />}
          </span>
          <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-ink/10 bg-phenode-white px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase text-ink shadow-sm transition-opacity ${h.side === 'left' ? 'right-8' : 'left-8'} ${active === h.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{h.label}</span>
        </button>
      ))}
    </div>
  )
}
