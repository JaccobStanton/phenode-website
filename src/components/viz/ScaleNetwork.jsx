import { useMemo } from 'react'
import { mulberry32 } from '../../lib/demoData.js'
import { seg, easeOut } from '../../lib/motion.js'
import { BaseStationGlyph, VB } from './scenes.jsx'

/**
 * Network bloom: a single PheNode with one node grows to a regional network of several PheNodes,
 * each commanding its own cluster. `progress` 0..1.
 */
export const STAGES = [
  { at: 0.0, nodes: 1, bases: 1, label: 'One experiment', sub: '1 base station · 1 node' },
  { at: 0.18, nodes: 5, bases: 1, label: 'A research plot', sub: '1 base station · 5 nodes' },
  { at: 0.38, nodes: 20, bases: 1, label: 'A field', sub: '1 base station · 20 nodes' },
  { at: 0.58, nodes: 50, bases: 1, label: 'Hundreds of acres', sub: '1 base station · 50+ nodes' },
  { at: 0.76, nodes: 50, bases: 4, label: 'A corridor', sub: '4 base stations · 100+ nodes' },
  { at: 0.9, nodes: 50, bases: 9, label: 'A regional network', sub: '9 base stations · 300+ nodes' },
]

export function stageFor(progress) {
  let s = STAGES[0]
  for (const st of STAGES) if (progress >= st.at) s = st
  return s
}

export default function ScaleNetwork({ progress = 0 }) {
  const basesPos = useMemo(() => [
    { x: 500, y: 300 }, { x: 180, y: 160 }, { x: 820, y: 170 }, { x: 170, y: 450 },
    { x: 830, y: 440 }, { x: 500, y: 90 }, { x: 500, y: 520 }, { x: 320, y: 300 }, { x: 690, y: 300 },
  ], [])
  const clusters = useMemo(() => basesPos.map((b, bi) => {
    const rnd = mulberry32(100 + bi)
    return Array.from({ length: 50 }, (_, i) => {
      const a = rnd() * Math.PI * 2
      const r = (bi === 0 ? 40 : 20) + Math.sqrt(rnd()) * (bi === 0 ? 250 : 110) * (i < 5 ? 0.45 : 1)
      return { x: b.x + Math.cos(a) * r, y: b.y + Math.sin(a) * r * 0.75, o: 0.5 + rnd() * 0.5 }
    })
  }), [basesPos])

  const st = stageFor(progress)
  const nodeCount = (bi) => {
    if (bi === 0) {
      // smooth growth up to 50 then hold
      const n = progress < 0.58 ? Math.round(1 + easeOut(seg(progress, 0, 0.58)) * 49) : 50
      return n
    }
    const order = bi // later bases bloom later
    const start = 0.7 + (order - 1) * 0.03
    return Math.round(easeOut(seg(progress, start, start + 0.14)) * 40)
  }
  const activeBases = st.bases

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-auto w-full text-paper" role="img" aria-label={`Network scale: ${st.sub}`}>
      <defs>
        <radialGradient id="scaleGlow"><stop offset="0" stopColor="var(--color-data)" stopOpacity="0.25" /><stop offset="1" stopColor="var(--color-data)" stopOpacity="0" /></radialGradient>
      </defs>
      {/* region hint */}
      <g opacity={easeOut(seg(progress, 0.7, 0.95)) * 0.5}>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-20 ${80 + i * 110} C 250 ${60 + i * 112}, 500 ${110 + i * 108}, 1020 ${70 + i * 110}`} fill="none" stroke="currentColor" strokeOpacity="0.12" />)}
      </g>
      {basesPos.map((b, bi) => {
        const n = nodeCount(bi)
        if (bi > 0 && bi >= activeBases && n === 0) return null
        const pts = clusters[bi].slice(0, bi === 0 ? n : Math.min(40, n))
        const baseOn = bi === 0 || n > 0
        const cluster = <g key={bi} style={{ opacity: baseOn ? 1 : 0 }}>
          <circle cx={b.x} cy={b.y} r={bi === 0 ? 260 : 120} fill="url(#scaleGlow)" opacity={Math.min(1, pts.length / 20)} />
          {pts.map((p, i) => (
            <g key={i}>
              <line x1={b.x} y1={b.y} x2={p.x} y2={p.y} stroke="var(--color-signal)" strokeOpacity={0.18 * p.o} strokeWidth="0.8" />
              <circle cx={p.x} cy={p.y} r={bi === 0 && pts.length <= 5 ? 5 : 3} fill="var(--color-signal)" opacity={0.55 + 0.45 * p.o} />
            </g>
          ))}
          <BaseStationGlyph x={b.x} y={b.y} s={bi === 0 ? 1.2 : 0.9} active={baseOn} uplink={bi === 0} label={bi === 0 && pts.length <= 5 ? 'BASE STATION' : undefined} />
        </g>
        return cluster
      })}
      {/* inter-base backhaul (cloud) */}
      <g opacity={easeOut(seg(progress, 0.78, 0.98))}>
        {basesPos.slice(1, activeBases).map((b, i) => <line key={i} x1={b.x} y1={b.y - 20} x2={500} y2={280} stroke="var(--color-data)" strokeOpacity="0.35" strokeDasharray="2 6" />)}
      </g>
    </svg>
  )
}
