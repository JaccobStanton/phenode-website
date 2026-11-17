import { useMemo } from 'react'
import { SCENES, BaseStationGlyph, NodeGlyph, Link, VB, SceneLegend } from './scenes.jsx'
import { nodeLayout } from '../../lib/demoData.js'

/**
 * The same PheNode hardware stays fixed while the environment behind it changes.
 * `stages` = [{ id, kind, label }], `progress` 0..1 scrubs through them.
 */
export default function EnvironmentTransition({ stages, progress = 0, count = 6, className = '' }) {
  const n = stages.length
  const f = progress * (n - 1)
  const pts = useMemo(() => nodeLayout('field', count, 8), [count])
  const base = { x: 500, y: 330 }
  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-auto w-full text-paper" role="img" aria-label={`The same PheNode system shown in ${stages.map((s) => s.label).join(', ')}.`}>
        {stages.map((s, i) => {
          const Scene = SCENES[s.kind]
          const w = 1 - Math.min(1, Math.abs(f - i))
          return (
            <g key={s.id} style={{ opacity: w, transition: 'opacity 0.2s' }}>
              <Scene heat={0.6} />
            </g>
          )
        })}
        {pts.map((p, i) => <Link key={i} from={{ x: p.x * VB.w, y: p.y * VB.h }} to={base} pulse delay={i * 0.5} />)}
        <BaseStationGlyph x={base.x} y={base.y} s={1.2} label="BASE STATION" />
        {pts.map((p, i) => <NodeGlyph key={i} x={p.x * VB.w} y={p.y * VB.h} delay={i * 0.3} />)}
      </svg>
      <SceneLegend />
      <ol className="pointer-events-none absolute inset-x-4 bottom-14 flex justify-between gap-2 sm:inset-x-6 sm:bottom-16" aria-hidden="true">
        {stages.map((s, i) => {
          const w = 1 - Math.min(1, Math.abs(f - i))
          return <li key={s.id} className="rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase backdrop-blur-sm" style={{ borderColor: w > 0.5 ? 'var(--color-paper)' : 'rgba(255,255,255,0.15)', color: w > 0.5 ? 'var(--color-paper)' : 'var(--color-stone)', background: 'rgba(14,16,18,0.6)' }}>{s.label}</li>
        })}
      </ol>
    </div>
  )
}

