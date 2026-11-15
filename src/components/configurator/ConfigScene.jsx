import { useMemo } from 'react'
import { SCENES, BaseStationGlyph, NodeGlyph, Link, VB, SceneLegend } from '../viz/scenes.jsx'
import { nodeLayout } from '../../lib/demoData.js'
import { nodeProbes } from './configModel.js'
import { useReducedMotion } from '../../lib/motion.js'

const BASE_POSITIONS = {
  1: [{ x: 500, y: 320 }],
  2: [{ x: 330, y: 320 }, { x: 670, y: 320 }],
  3: [{ x: 180, y: 320 }, { x: 500, y: 300 }, { x: 820, y: 320 }],
  4: [{ x: 250, y: 200 }, { x: 750, y: 200 }, { x: 250, y: 430 }, { x: 750, y: 430 }],
}

/**
 * Configurator stage. Shows the chosen environment, base stations (after step 3), nodes (after step 4),
 * per-node soil probes, and a zoom toward the selected node in step 5.
 */
export default function ConfigScene({ config, step, selected, onSelect, className = '' }) {
  const reduced = useReducedMotion()
  const kind = config.scale ? (config.scale === 'single' ? 'field' : { plot: 'field', field: 'field', corridor: 'corridor', restoration: 'ecosystem', campus: 'city', urban: 'city', custom: 'field' }[config.scale]) : 'field'
  const Scene = SCENES[kind] || SCENES.field
  const showBase = step >= 2
  const showNodes = step >= 3
  const bases = useMemo(() => (BASE_POSITIONS[Math.min(4, config.base.count)] || BASE_POSITIONS[1]).slice(0, config.base.count), [config.base.count])
  const pts = useMemo(() => nodeLayout(config.scale === 'single' ? 'single' : kind, config.nodes, 7), [kind, config.nodes, config.scale])
  const nearestBase = (p) => bases.reduce((best, b) => (Math.hypot(b.x - p.x, b.y - p.y) < Math.hypot(best.x - p.x, best.y - p.y) ? b : best), bases[0])
  const sel = selected != null && showNodes ? pts[selected] : null
  const zoom = step === 4 && sel ? 2.2 : 1
  const origin = sel ? `${sel.x * 100}% ${sel.y * 100}%` : '50% 50%'
  const heat = step >= 5 ? 0.6 : 0.25
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: origin, transition: reduced ? 'none' : 'transform 0.8s var(--ease-out-quint), transform-origin 0.8s var(--ease-out-quint)' }}>
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-auto w-full text-paper" role="img" aria-label={`Configured deployment: ${config.base.count} base station(s), ${showNodes ? config.nodes : 0} wireless nodes`}>
          <Scene heat={heat} />
          {showBase && showNodes && pts.map((p, i) => {
            const b = nearestBase({ x: p.x * VB.w, y: p.y * VB.h })
            return <Link key={`l${i}`} from={{ x: p.x * VB.w, y: p.y * VB.h }} to={b} pulse={step >= 5 && !reduced && i % 3 === 0} delay={i * 0.3} opacity={selected === i ? 0.8 : 0.3} />
          })}
          {showBase && bases.map((b, i) => (
            <g key={i} style={{ transformOrigin: `${b.x}px ${b.y}px`, animation: reduced ? 'none' : 'bloom 0.9s var(--ease-out-quint) both' }}>
              <BaseStationGlyph x={b.x} y={b.y} s={config.base.tower ? 1.35 : 1.15} label={config.base.count > 1 ? `BASE STATION ${i + 1}` : 'BASE STATION'} reduced={reduced} />
            </g>
          ))}
          {showNodes && pts.map((p, i) => {
            const x = p.x * VB.w, y = p.y * VB.h
            const probes = nodeProbes(config, i)
            const isSel = selected === i
            return (
              <g key={`n${i}`} onClick={() => onSelect && onSelect(i)} style={{ cursor: onSelect ? 'pointer' : 'default' }} role={onSelect ? 'button' : undefined} aria-label={onSelect ? `Node ${i + 1}, ${probes} soil probes` : undefined} tabIndex={onSelect ? 0 : undefined} onKeyDown={(e) => { if (onSelect && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSelect(i) } }}>
                {isSel && <circle cx={x} cy={y} r="22" fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="3 3" />}
                <NodeGlyph x={x} y={y} delay={i * 0.17} color={isSel ? 'var(--color-signal-2)' : 'var(--color-signal)'} />
                {Array.from({ length: probes }).map((_, k) => (
                  <g key={k}>
                    <path d={`M${x - 3 + k * 6} ${y + 6} q ${k ? 4 : -4} 8 ${k ? 6 : -6} 14`} fill="none" stroke="var(--color-clay)" strokeWidth="1.2" />
                    <path d={`M${x - 3 + k * 6 + (k ? 6 : -6)} ${y + 20} l -3 5 m 3 -5 l 0 6 m 0 -6 l 3 5`} stroke="var(--color-clay)" strokeWidth="1" fill="none" />
                  </g>
                ))}
                {step >= 3 && config.nodes <= 24 && <text x={x} y={y - 14} textAnchor="middle" fill="var(--color-paper)" fontFamily="var(--font-mono)" fontSize="9" opacity="0.7">{String(i + 1).padStart(2, '0')}</text>}
              </g>
            )
          })}
        </svg>
      </div>
      {showBase && <SceneLegend nodes={showNodes} />}
      <style>{`@keyframes bloom { from { transform: scale(0.2); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  )
}
