import { useLayoutEffect, useRef, useState } from 'react'
import { Tag } from '../ui/primitives.jsx'
import { seg, easeOut, useReducedMotion } from '../../lib/motion.js'

/**
 * Home 03 — a PheNode network at field scale.
 *
 * Jake (Nov 13): the old graphic (a fleet-map capture from the software) covered a ~20 km region, which reads as
 * regional, not hyperlocal. This is an illustration in the style of the software's dark map, zoomed in to one farm:
 * the PheNode in the middle with its info card coming up the way it does in the software, a 1 km LoRaWAN range ring,
 * and 12 wireless nodes in different micro-environments (creek bottom, tree line, ridge, center pivot, farmstead,
 * roadside…) pulsing and sending their readings in (nodes measure every 15 minutes and send hourly). Pointing at a node (or tapping it) shows that node's latest
 * reading in the card, so the variation across one site is right there. Readings are illustrative: tagged Demo data.
 *
 * Geometry is in viewBox units (1400 × 1018, the old capture's shape, so the layout around it doesn't move); 1 km = 400.
 * Readings travel as SVG dots drawn under the card (those from the north slip beneath it into the PheNode); the pulsing
 * rings are HTML overlays. Both animate transform/opacity only.
 */
const W = 1400
const H = 1018
const KM = 400
const P = { x: 700, y: 610 }

const PHENODE_INFO = {
  title: 'Research Field 02', tag: 'PheNode',
  rows: [['Temperature', '72.4°F'], ['Rainfall', '0.12 in'], ['Wind', '6.2 mph'], ['Battery', '98.6%']],
  foot: '12 wireless nodes · hourly',
}

// Each node sits somewhere conditions differ; its demo reading follows (cool and wet by the creek, hot and dry by the farmstead).
// None sits under the card (which covers the ring's north arc), so all twelve stay in view.
const NODES = [
  { x: 945, y: 310, place: 'North field', t: 73.4, rh: 55, vwc: 0.22, bat: 91 },
  { x: 1010, y: 400, place: 'Ridge top', t: 76.4, rh: 46, vwc: 0.13, bat: 95 },
  { x: 1080, y: 560, place: 'Ridge slope', t: 75.2, rh: 49, vwc: 0.16, bat: 89 },
  { x: 1050, y: 760, place: 'East field', t: 74.1, rh: 53, vwc: 0.2, bat: 92 },
  { x: 900, y: 700, place: 'Farmstead', t: 77.9, rh: 47, vwc: 0.12, bat: 99 },
  { x: 960, y: 880, place: 'Roadside', t: 75.6, rh: 50, vwc: 0.18, bat: 86 },
  { x: 720, y: 960, place: 'South field', t: 73.8, rh: 54, vwc: 0.21, bat: 90 },
  { x: 560, y: 860, place: 'Center pivot', t: 71.2, rh: 63, vwc: 0.34, bat: 97 },
  { x: 350, y: 770, place: 'Creek bottom', t: 69.9, rh: 66, vwc: 0.36, bat: 93 },
  { x: 430, y: 610, place: 'Tree line', t: 70.4, rh: 64, vwc: 0.31, bat: 88 },
  { x: 390, y: 420, place: 'Creek bottom', t: 69.6, rh: 68, vwc: 0.38, bat: 96 },
  { x: 455, y: 310, place: 'North field', t: 72.9, rh: 57, vwc: 0.24, bat: 94 },
].map((n, i) => ({ ...n, id: i, km: (Math.hypot(n.x - P.x, n.y - P.y) / KM).toFixed(2) }))
// (listed clockwise from north, which is also the order they connect in as the section scrolls in)

const nodeInfo = (n) => ({
  title: `Node ${String(n.id + 1).padStart(2, '0')}`, tag: 'Wireless',
  rows: [['Temperature', `${n.t.toFixed(1)}°F`], ['Humidity', `${n.rh}%`], ['Soil moisture', `${n.vwc.toFixed(2)} m³/m³`], ['Battery', `${n.bat}%`]],
  foot: `${n.place} · ${n.km} km away`,
})

const temps = NODES.map((n) => n.t)
const LABEL = `Illustration with demo data: a PheNode in the middle of a farm, with 12 wireless sensor nodes within 1 km of it — in the north fields, on a ridge, by the farmstead and the county road, under a center pivot, and along a creek and its tree line — each sending hourly readings to it over LoRaWAN. Air temperature across the nodes ranges from ${Math.min(...temps)} to ${Math.max(...temps)} °F.`

const pct = (p) => ({ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` })

export default function HyperlocalMap({ progress = 1 }) {
  const reduced = useReducedMotion()
  const boxRef = useRef(null)
  const [scale, setScale] = useState(0) // rendered px per viewBox unit (only to know the map has a size)
  const [active, setActive] = useState(null) // the node being pointed at
  useLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setScale(el.clientWidth / W)
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el)
    return () => ro?.disconnect()
  }, [])
  const live = !reduced && scale > 0
  const reveal = (i) => easeOut(seg(progress, 0.05 + i * 0.04, 0.25 + i * 0.04))
  const cardShown = progress > 0.62
  const info = active != null && cardShown ? nodeInfo(NODES[active]) : PHENODE_INFO
  const point = (i) => (e) => { if (e.pointerType !== 'touch') setActive(i) }
  const unpoint = (e) => { if (e.pointerType !== 'touch') setActive(null) }

  return (
    <figure className="@container/hl">
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 className="text-[20px] font-semibold tracking-tight text-paper md:text-[22px]">PheNode Network</h3>
        <span className="flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.14em] uppercase text-stone">
          <span className="hidden [@media(hover:hover)]:inline">Point at a node</span>
          <span className="[@media(hover:hover)]:hidden">Tap a node</span>
          <Tag>Demo data</Tag>
        </span>
      </figcaption>

      <div ref={boxRef} role="img" aria-label={LABEL} className="@container relative overflow-hidden rounded-xl border border-white/10 bg-[#061127]" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <Landscape onBackground={() => setActive(null)} />

          {/* LoRaWAN links (static dashes; the one being pointed at brightens) */}
          {NODES.map((n, i) => {
            const on = active === i
            return <path key={n.id} d={`M${n.x} ${n.y} L${P.x} ${P.y}`} stroke={on ? 'var(--color-signal-2)' : 'var(--color-signal)'} strokeWidth={on ? 2.4 : 1.6} strokeDasharray="7 9" fill="none" vectorEffect="non-scaling-stroke" style={{ opacity: reveal(i) * (active == null ? 0.7 : on ? 1 : 0.3), transition: 'opacity 0.3s' }} />
          })}

          {/* readings travelling in (sent hourly), under the card */}
          {live && NODES.map((n, i) => reveal(i) > 0.9 && (
            <g key={n.id} className="hl-spacket" style={{ '--dx': `${P.x - n.x}px`, '--dy': `${P.y - n.y}px`, animationDelay: `${(i * 0.43) % 2.6}s` }}>
              <circle cx={n.x} cy={n.y} r="12" fill="var(--color-signal)" opacity="0.22" />
              <circle cx={n.x} cy={n.y} r="5.5" fill="var(--color-signal)" />
            </g>
          ))}

          {/* the PheNode */}
          <g style={{ opacity: easeOut(seg(progress, 0, 0.15)) }}>
            <circle cx={P.x} cy={P.y} r="38" fill="#1A75E0" opacity="0.2" />
            <circle cx={P.x} cy={P.y} r="20" fill="#1A75E0" stroke="var(--color-data-2)" strokeWidth="5" />
          </g>

          {/* wireless nodes, with a generous invisible target for pointing / tapping */}
          {NODES.map((n, i) => {
            const r = reveal(i)
            return (
              <g key={n.id} style={{ opacity: r }}>
                {active === i && <circle cx={n.x} cy={n.y} r="20" fill="none" stroke="var(--color-signal-2)" strokeWidth="3" />}
                <circle cx={n.x} cy={n.y} r="10" fill="var(--color-data-2)" stroke="#061127" strokeWidth="4" />
                {r > 0.5 && <circle cx={n.x} cy={n.y} r="36" fill="transparent" pointerEvents="all" onPointerEnter={point(i)} onPointerLeave={unpoint} onClick={() => setActive(i)} />}
              </g>
            )
          })}
        </svg>

        {/* pulses: the PheNode's uplink, and each node as it reports */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {live && progress > 0.4 && [0, 1.4].map((d) => <span key={d} className="hl-ring hl-ring--data" style={{ ...pct(P), animationDelay: `${d}s` }} />)}
          {NODES.map((n, i) => (
            <span key={n.id} className={`hl-ring hl-ring--signal ${live ? '' : 'hl-static'}`} style={{ ...pct(n), animationDelay: `${(i * 0.43) % 2.6}s`, opacity: live ? undefined : 0.6 * reveal(i), visibility: reveal(i) > 0.05 ? 'visible' : 'hidden' }} />
          ))}
        </div>

        {/* the info card, as in the software: above the PheNode once the map is wide enough to hold it, under the
            map on narrower ones (phones, small laptops) so its text stays readable */}
        <InfoCard info={info} shown={cardShown} reduced={reduced} className="pointer-events-none absolute hidden w-[clamp(170px,32cqw,225px)] @min-[560px]/hl:block" style={pct(P)} anchored />
      </div>
      <InfoCard info={info} shown={cardShown} reduced={reduced} className="mx-auto mt-3 max-w-[360px] @min-[560px]/hl:hidden" />

      <MapKey />
    </figure>
  )
}

/** The software's map popup: name and type, four readings, and a footer line. */
function InfoCard({ info, shown, reduced, anchored = false, className = '', style }) {
  const lift = anchored ? (shown ? 'translate(-50%, calc(-100% - 18px))' : 'translate(-50%, calc(-100% - 4px))') : shown ? 'none' : 'translateY(8px)'
  return (
    <div aria-hidden="true" className={className} style={{ ...style, opacity: shown ? 1 : 0, transform: lift, transition: reduced ? 'none' : 'opacity 0.6s var(--ease-out-quint), transform 0.6s var(--ease-out-quint)' }}>
      <div className="relative rounded-xl border border-white/10 bg-[#0A1631]/95 px-[clamp(10px,1.8cqw,14px)] py-[clamp(8px,1.5cqw,12px)] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-[clamp(5px,0.95cqw,8px)]">
          <span className="truncate text-[clamp(11.5px,1.95cqw,14px)] font-semibold text-[#9D82F5]">{info.title}</span>
          <span className="shrink-0 font-mono text-[clamp(9px,1.4cqw,10.5px)] tracking-[0.06em] text-[#5B97F6]">{info.tag}</span>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-[clamp(1px,0.35cqw,3px)] py-[clamp(5px,0.95cqw,8px)] text-[clamp(10.5px,1.65cqw,12.5px)]">
          {info.rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-[#4F8DF6]">{k}:</dt>
              {/* as in the app's map card: the value in --green, bold, with its soft blue glow */}
              <dd className="text-right font-bold tabular-nums text-phenode-green [text-shadow:0_1px_9px_#1a75e0c9]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-white/10 pt-[clamp(5px,0.95cqw,8px)] text-center font-mono text-[clamp(9px,1.35cqw,10px)] font-semibold tracking-[0.04em] text-phenode-green [text-shadow:0_1px_9px_#1a75e0c9]">{info.foot}</p>
        {anchored && <span aria-hidden="true" className="absolute left-1/2 top-full -mt-[5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#0A1631]" />}
      </div>
    </div>
  )
}

/** One farm, about 1.75 km across, drawn in the software map's style. Decorative. */
function Landscape({ onBackground }) {
  const field = { stroke: '#5896FF', strokeOpacity: 0.16, strokeWidth: 2 }
  const label = { fill: '#8FC0FF', fillOpacity: 0.62, fontSize: 21, letterSpacing: 3.2, fontWeight: 500, style: { fontFamily: 'var(--font-sans)' } }
  // canopy along both banks of the creek: [x, y, r]
  const trees = [
    [404, 96, 26], [432, 140, 30], [446, 196, 27], [440, 250, 31], [418, 300, 25], [430, 352, 22], [398, 470, 24], [404, 520, 28], [420, 566, 23],
    [452, 640, 27], [430, 690, 25], [404, 736, 22], [388, 820, 26], [372, 878, 23], [392, 934, 27], [372, 990, 24],
    [300, 150, 22], [286, 236, 26], [268, 420, 24], [262, 820, 23], [282, 930, 26],
  ]
  return (
    <g>
      <defs>
        <pattern id="hl-rows-a" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)"><path d="M0 9 H18" stroke="#4A86F0" strokeOpacity="0.11" strokeWidth="2" /></pattern>
        <pattern id="hl-rows-b" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(86)"><path d="M0 9 H18" stroke="#4A86F0" strokeOpacity="0.1" strokeWidth="2" /></pattern>
        <pattern id="hl-rows-c" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><path d="M0 10 H20" stroke="#4A86F0" strokeOpacity="0.09" strokeWidth="2" /></pattern>
        <radialGradient id="hl-range" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3FD0C8" stopOpacity="0.09" /><stop offset="100%" stopColor="#3FD0C8" stopOpacity="0.03" /></radialGradient>
        <radialGradient id="hl-vignette" cx="50%" cy="56%" r="72%"><stop offset="62%" stopColor="#030914" stopOpacity="0" /><stop offset="100%" stopColor="#030914" stopOpacity="0.7" /></radialGradient>
      </defs>

      <rect width={W} height={H} fill="#061127" onClick={onBackground} />
      {/* pasture west of the creek, then the fields (crop rows run differently in each) */}
      <path d="M0 0 H362 L330 330 L392 600 L300 860 L340 1018 H0 Z" fill="#081733" pointerEvents="none" />
      <g pointerEvents="none">
        {[
          ['M372 0 H705 L695 272 L396 300 Z', '#0A1A39', 'a'],
          ['M705 0 H1050 L1020 262 L695 272 Z', '#0B1C3E', 'b'],
          ['M1020 262 L1400 170 V520 L1060 600 Z', '#0A1936', null],
          ['M396 300 L695 272 L705 560 L420 640 Z', '#0B1B3B', 'c'],
          ['M695 272 L1020 262 L1060 600 L705 560 Z', '#0A1834', 'a'],
          ['M705 560 L1060 600 L1400 520 V1018 H760 Z', '#0B1C3D', 'b'],
          ['M392 640 L705 560 L760 1018 H340 L362 860 Z', '#0A1937', null],
        ].map(([d, fill, rows]) => (
          <g key={d}>
            <path d={d} fill={fill} {...field} />
            {rows && <path d={d} fill={`url(#hl-rows-${rows})`} />}
          </g>
        ))}

        {/* the ridge: contour lines around a low hilltop to the north-east */}
        <g fill="none" stroke="#6FA8FF" strokeOpacity="0.17" strokeWidth="2" transform="rotate(-18 1230 215)">
          {[[90, 55], [170, 110], [250, 165], [330, 220]].map(([rx, ry]) => <ellipse key={rx} cx="1230" cy="215" rx={rx} ry={ry} />)}
        </g>

        {/* center pivot (irrigated) to the south-west */}
        <circle cx="530" cy="880" r="165" fill="#0C2550" fillOpacity="0.85" stroke="#3D86F0" strokeOpacity="0.38" strokeWidth="2.5" />
        {[120, 75, 30].map((r) => <circle key={r} cx="530" cy="880" r={r} fill="none" stroke="#3D86F0" strokeOpacity="0.15" strokeWidth="2" />)}
        <path d="M530 880 L665 785" stroke="#8EC5FF" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
        <circle cx="530" cy="880" r="6" fill="#8EC5FF" fillOpacity="0.8" />

        {/* the creek and its tree line */}
        <path d="M352 -20 C318 110 420 210 368 330 S296 520 384 610 S330 770 304 860 S372 990 344 1040" fill="none" stroke="#0F3166" strokeWidth="20" strokeLinecap="round" />
        <path d="M352 -20 C318 110 420 210 368 330 S296 520 384 610 S330 770 304 860 S372 990 344 1040" fill="none" stroke="#2F86E8" strokeOpacity="0.16" strokeWidth="11" />
        <path d="M352 -20 C318 110 420 210 368 330 S296 520 384 610 S330 770 304 860 S372 990 344 1040" fill="none" stroke="#3F95F2" strokeOpacity="0.8" strokeWidth="4" />
        {trees.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#0B2A36" fillOpacity="0.92" stroke="#3FBFB0" strokeOpacity="0.16" strokeWidth="1.5" />)}

        {/* county road, the farm lane and the farmstead */}
        <path d="M540 1060 L1440 456" stroke="#17459A" strokeWidth="16" strokeLinecap="round" />
        <path d="M540 1060 L1440 456" stroke="#3B7AE6" strokeOpacity="0.65" strokeWidth="3" />
        <path d="M905 816 Q885 765 862 724 T832 690" fill="none" stroke="#143B85" strokeWidth="8" strokeLinecap="round" />
        <path d="M790 650 L880 640 L890 712 L800 720 Z" fill="#10264F" stroke="#78AAFF" strokeOpacity="0.2" strokeWidth="1.5" />
        <g fill="#1A3466" stroke="#4A86E8" strokeOpacity="0.45" strokeWidth="1.5">
          <rect x="804" y="656" width="46" height="28" rx="2" transform="rotate(-6 827 670)" />
          <rect x="856" y="664" width="22" height="34" rx="2" transform="rotate(-6 867 681)" />
          <rect x="812" y="692" width="30" height="17" rx="2" transform="rotate(-6 827 700)" />
        </g>

        {/* 1 km: how far a wireless node can be from its PheNode (line of sight) */}
        <circle cx={P.x} cy={P.y} r={KM} fill="url(#hl-range)" stroke="#3FD0C8" strokeOpacity="0.75" strokeWidth="2.5" />
        {/* its label sits on the ring's west side (the card covers the north arc) */}
        <rect x={P.x - KM - 34} y={P.y - 15} width="68" height="30" rx="15" fill="#061127" stroke="#3FD0C8" strokeOpacity="0.6" strokeWidth="1.5" />
        <text x={P.x - KM} y={P.y + 6} textAnchor="middle" fill="#7FE6DE" fontSize="17" letterSpacing="2" style={{ fontFamily: 'var(--font-mono)' }}>1 KM</text>

        {/* places (each one a reason conditions differ) */}
        <text x="700" y="118" textAnchor="middle" {...label}>NORTH FIELD</text>
        <text x="1232" y="222" textAnchor="middle" {...label}>RIDGE</text>
        <text x="160" y="540" textAnchor="middle" {...label}>CREEK BOTTOM</text>
        <text x="528" y="200" textAnchor="middle" {...label}>TREE LINE</text>
        <text x="572" y="985" textAnchor="middle" {...label}>CENTER PIVOT</text>
        <text x="838" y="758" textAnchor="middle" {...label}>FARMSTEAD</text>
        <text x="1214" y="584" textAnchor="middle" transform="rotate(-33.9 1214 584)" {...label}>COUNTY ROAD</text>

        {/* scale: 250 m */}
        <g stroke="#8FC0FF" strokeOpacity="0.7" strokeWidth="2.5">
          <path d="M40 978 H140" /><path d="M40 970 V986" /><path d="M140 970 V986" />
        </g>
        <text x="152" y="985" fill="#8FC0FF" fillOpacity="0.75" fontSize="18" letterSpacing="1.5" style={{ fontFamily: 'var(--font-mono)' }}>250 M</text>

        <rect width={W} height={H} fill="url(#hl-vignette)" />
      </g>
    </g>
  )
}

function MapKey() {
  const items = [
    [<span key="i" className="relative block h-3 w-3 rounded-full border-2 border-data-2 bg-phenode-blue" />, 'PheNode'],
    [<span key="i" className="block h-2.5 w-2.5 rounded-full bg-data-2" />, 'Wireless sensor'],
    [<svg key="i" viewBox="0 0 28 8" className="h-2 w-7"><path d="M1 4 H27" stroke="var(--color-signal)" strokeOpacity="0.8" strokeWidth="1.4" strokeDasharray="3 3" /></svg>, 'LoRaWAN link'],
    [<span key="i" className="block h-2 w-2 rounded-full bg-signal" />, 'Readings · sent hourly'],
    [<span key="i" className="block h-2.5 w-2.5 rounded-full border-2 border-data" />, 'Data uplink · cellular / Wi‑Fi / satellite'],
  ]
  return (
    // Sized to the map (the figure is the container): two equal columns on a narrow map, then a centered grid that
    // fits the labels, four across once the map is wide enough. The long uplink entry always takes a row of its own.
    <ul className="mx-auto mt-5 grid w-full grid-cols-2 justify-items-start gap-x-6 gap-y-3 font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone @min-[460px]/hl:w-fit @min-[460px]/hl:grid-cols-[repeat(2,auto)] @min-[460px]/hl:gap-x-8 @min-[460px]/hl:gap-y-2.5 @min-[630px]/hl:grid-cols-[repeat(4,auto)]" aria-label="Map key">
      {items.map(([icon, label], i) => (
        <li key={label} className={`flex items-center gap-2 whitespace-nowrap ${i === items.length - 1 ? 'col-span-full' : ''}`}><span className="flex w-7 shrink-0 justify-center" aria-hidden="true">{icon}</span>{label}</li>
      ))}
    </ul>
  )
}
