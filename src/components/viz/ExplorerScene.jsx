import { useMemo } from 'react'
import { SCENES, BaseStationGlyph, NodeGlyph, Link, VB, SceneLegend } from './scenes.jsx'
import { useReducedMotion } from '../../lib/motion.js'
import { nodeLayout } from '../../lib/demoData.js'

/**
 * Application scene: environment + base station + nodes + links. `kind` picks the landscape;
 * `count` nodes; `heat` reveals variation; `pulse` animates links. `formatValue(i)` labels node i with a reading
 * (`showValues` alone gives air temperatures). `crop` trims that many viewBox units off the top and bottom, where
 * every scene is empty margin, for a shorter picture.
 */
export default function ExplorerScene({ kind = 'field', count = 8, heat = 0.8, pulse = true, seed = 3, className = '', showValues = false, formatValue, crop = 0, label, legend = true }) {
  const reduced = useReducedMotion()
  const Scene = SCENES[kind] || SCENES.field
  const pts = useMemo(() => nodeLayout(kind === 'greenhouse' || kind === 'chamber' ? 'field' : kind, count, seed), [kind, count, seed])
  const base = kind === 'corridor' ? { x: 500, y: 300 } : kind === 'city' ? { x: 500, y: 300 } : { x: 500, y: 320 }
  return (
    <div className={className}>
      <svg viewBox={`0 ${crop} ${VB.w} ${VB.h - crop * 2}`} className="h-auto w-full" role="img" aria-label={label || `A ${kind} instrumented with a PheNode base station and ${count} wireless nodes; readings travel to the base station and leave as data`}>
        <Scene heat={heat} />
        {pts.map((p, i) => <Link key={`l${i}`} from={{ x: p.x * VB.w, y: p.y * VB.h }} to={base} pulse={pulse && !reduced} delay={i * 0.4} />)}
        <BaseStationGlyph x={base.x} y={base.y} s={1.1} label="BASE STATION" reduced={reduced} />
        {pts.map((p, i) => <NodeGlyph key={`n${i}`} x={p.x * VB.w} y={p.y * VB.h} delay={i * 0.25} value={formatValue ? formatValue(i) : showValues ? `${(21 + ((i * 37) % 60) / 10).toFixed(1)}°` : undefined} />)}
      </svg>
      {legend && <SceneLegend />}
    </div>
  )
}
