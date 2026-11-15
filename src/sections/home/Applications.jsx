import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Eyebrow, Section, Container, Button, Tag } from '../../components/ui/primitives.jsx'
import ExplorerScene from '../../components/viz/ExplorerScene.jsx'
import EnvironmentTransition from '../../components/viz/EnvironmentTransition.jsx'
import { CityScene, VB, NodeGlyph, BaseStationGlyph, rampColor } from '../../components/viz/scenes.jsx'
import MiniChart, { Legend } from '../../components/viz/MiniChart.jsx'
import { usePersonalization } from '../../context/PersonalizationContext.jsx'
import { useScrollProgress, useReveal, seg, easeOut } from '../../lib/motion.js'
import { diurnalSeries, soilMoistureSeries, nodeLayout } from '../../lib/demoData.js'

const ease = [0.22, 1, 0.36, 1]

export default function Applications() {
  const { applications, role } = usePersonalization()
  return (
    <Section id="applications" theme="ink" padded={false} className="border-t border-white/10">
      <Container className="pt-24 md:pt-36">
        <Eyebrow index="06">Application experiences</Eyebrow>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display-lg max-w-[16ch]">One platform. Wherever the research goes.</h2>
          <p className="lede max-w-[44ch]">{role?.plural ? `Ordered for ${role.plural}. ` : ''}The same hardware, communications and data system — reconfigured for very different monitoring questions.</p>
        </div>
      </Container>
      <motion.div layout className="mt-16 flex flex-col [overflow-anchor:none]">
        {applications.map((app, i) => (
          <motion.div key={app.id} layout transition={{ duration: 0.6, ease }}>
            <Chapter app={app} index={i} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

function Chapter({ app, index }) {
  switch (app.id) {
    case 'transportation': return <Transportation app={app} index={index} />
    case 'agriculture': return <Agriculture app={app} index={index} />
    case 'ecology': return <Ecology app={app} index={index} />
    case 'urban': return <Urban app={app} index={index} />
    default: return null
  }
}

function ChapterHeader({ app, index, className = '' }) {
  return (
    <div className={className}>
      <p className="eyebrow"><span className="opacity-90">{String(index + 1).padStart(2, '0')}</span> <span className="mx-2 opacity-40">/</span> {app.kicker}</p>
      <h3 className="display-lg mt-4 max-w-[16ch]">{app.title}</h3>
      <p className="lede mt-5 max-w-[48ch]">{app.summary}</p>
    </div>
  )
}

function Measurements({ items, tone = 'signal' }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Measurements">
      {items.map((m) => <li key={m} className={`chip ${tone === 'signal' ? 'border-signal/40 text-signal-2' : 'border-data/40 text-data-2'}`}>{m}</li>)}
    </ul>
  )
}

/* ---------------- Transportation + fire weather ---------------- */
function Transportation({ app, index }) {
  const [ref, p] = useScrollProgress({ start: 'top 70%', end: 'bottom 50%' })
  const reveal = useReveal()
  const soil = useMemo(() => [
    { name: 'Soil VWC % — section 3', data: soilMoistureSeries({ seed: 5, days: 14, start: 30 }), color: 'var(--color-data)' },
    { name: 'Soil VWC % — section 9', data: soilMoistureSeries({ seed: 12, days: 14, start: 22, dryRate: 0.05 }), color: 'var(--color-signal)' },
  ], [])
  const fire = useMemo(() => [
    { name: 'RH % — mile 4', data: diurnalSeries({ seed: 3, base: 48, amp: 18, phase: 4, drift: -12 }), color: 'var(--color-data)' },
    { name: 'Wind m/s — mile 4', data: diurnalSeries({ seed: 4, base: 4, amp: 2.5, phase: 15, drift: 3 }), color: 'var(--color-signal)' },
  ], [])
  const phase = p < 0.35 ? 0 : p < 0.7 ? 1 : 2
  return (
    <article ref={reveal} className="border-t border-white/10 py-24 md:py-32" aria-labelledby={`ch-${app.id}`}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ChapterHeader app={app} index={index} className="reveal" />
            <Measurements items={app.measurements} />
            <p className="reveal mt-6 text-[15px] leading-relaxed text-paper/70">Roadside environmental projects are designed to improve {app.benefits.join(', ').toLowerCase()}. PheNode measures whether they are — section by section, season over season.</p>
            <div className="reveal mt-8 flex gap-3"><Button to={app.route} variant="primary">{app.cta}</Button></div>
          </div>
          <div ref={ref} className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-2">
              <ExplorerScene kind="corridor" count={10} heat={easeOut(seg(p, 0.2, 0.7))} className="text-paper" showValues={p > 0.5} />
              <div className="absolute left-4 top-4 flex gap-2"><Tag>Demo data</Tag></div>
              {/* before / monitoring / after */}
              <ol className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10" aria-label="Restoration timeline">
                {[['Before', 'Bare slope, no baseline'], ['Monitoring', 'Nodes at intervals; soil + microclimate'], ['After', 'Establishment measured, not assumed']].map(([k, v], i) => (
                  <li key={k} className={`p-4 transition-colors duration-500 ${phase === i ? 'bg-white/5' : ''}`}>
                    <p className={`font-mono text-[11px] tracking-[0.16em] uppercase ${phase === i ? 'text-signal-2' : 'text-stone'}`}>{k}</p>
                    <p className="mt-1 text-[13.5px] leading-snug text-paper/80">{v}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-ink-2 p-5">
              <div className="flex items-center justify-between gap-4"><Legend series={soil} /><Tag>Demo data</Tag></div>
              <MiniChart series={soil} height={140} className="mt-3 text-paper" unit="%" ticks={['Wk 1', 'Wk 2']} />
              <p className="mt-2 text-[13px] text-stone">Two roadside sections, same rain events, different retention. The kind of difference one station can't see.</p>
            </div>
          </div>
        </div>

        {/* Fire weather */}
        <div className="mt-20 grid gap-10 rounded-xl border border-signal/25 bg-[radial-gradient(70%_80%_at_80%_0%,rgba(224,138,46,0.12),transparent_60%)] p-6 md:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-signal">{app.sub.kicker}</p>
            <h4 className="display-md mt-3 max-w-[18ch]">{app.sub.title}</h4>
            <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-paper/75">{app.sub.summary}</p>
            <Measurements items={app.sub.measurements} />
            <p className="mt-5 font-mono text-[11px] leading-relaxed tracking-[0.06em] text-stone">PheNode monitors conditions. It does not predict wildfires.</p>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-white/10 bg-ink/60 p-5">
              <div className="flex items-center justify-between gap-4"><Legend series={fire} /><Tag>Demo data</Tag></div>
              <MiniChart series={fire} height={170} className="mt-3 text-paper" />
              <p className="mt-2 text-[13px] text-stone">Falling humidity and rising wind at one mile marker — hourly, from the corridor itself.</p>
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}

/* ---------------- Agriculture + research pipeline ---------------- */
const PIPELINE = [
  { id: 'chamber', kind: 'chamber', label: 'Growth chamber' },
  { id: 'greenhouse', kind: 'greenhouse', label: 'Greenhouse' },
  { id: 'field', kind: 'field', label: 'Field experiment' },
]
function Agriculture({ app, index }) {
  const [ref, p] = useScrollProgress({ start: 'top 65%', end: 'bottom 45%' })
  const [pipeRef, pp] = useScrollProgress({ start: 'top 70%', end: 'bottom 40%' })
  const reveal = useReveal()
  return (
    <article ref={reveal} className="border-t border-white/10 py-24 md:py-32" aria-labelledby={`ch-${app.id}`}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div ref={ref} className="order-2 lg:order-1 lg:col-span-7">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-2">
              <ExplorerScene kind="field" count={Math.max(1, Math.round(easeOut(seg(p, 0.1, 0.9)) * 12))} heat={easeOut(seg(p, 0, 0.5))} className="text-paper" showValues />
              <div className="absolute left-4 top-4 flex gap-2"><Tag>Demo data</Tag><Tag tone="signal">{Math.max(1, Math.round(easeOut(seg(p, 0.1, 0.9)) * 12))} plots instrumented</Tag></div>
            </div>
            <ul className="mt-4 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
              {[['Plot-level', 'One node per plot where the question demands it'], ['Replicated', 'Same sensors, same cadence, every replicate'], ['Normalized', 'Your data preferences, applied across breeding trials and agronomy']].map(([k, v]) => (
                <li key={k} className="bg-ink p-4"><p className="font-mono text-[11px] tracking-[0.16em] uppercase text-data">{k}</p><p className="mt-1 text-[13.5px] leading-snug text-paper/80">{v}</p></li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <ChapterHeader app={app} index={index} className="reveal" />
            <Measurements items={app.measurements} tone="data" />
            <div className="reveal mt-8 flex gap-3"><Button to={app.route} variant="primary">{app.cta}</Button></div>
          </div>
        </div>

        {/* Research pipeline */}
        <div ref={pipeRef} className="mt-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow">Complete research pipeline</p>
              <h4 className="display-md mt-3 max-w-[18ch]">{app.pipeline.title}</h4>
            </div>
            <p className="max-w-[46ch] text-[15.5px] leading-relaxed text-paper/75 lg:col-span-6">{app.pipeline.text}</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-ink-2">
            <EnvironmentTransition stages={PIPELINE} progress={seg(pp, 0.05, 0.95)} count={6} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] tracking-[0.16em] uppercase text-stone">
            <span className="text-paper">Personalized standardization</span><span>Same hardware</span><span>Same cadence</span><span>Same columns</span><span>Same cleaning rules</span>
          </div>
        </div>
      </Container>
    </article>
  )
}

/* ---------------- Ecology ---------------- */
function Ecology({ app, index }) {
  const [ref, p] = useScrollProgress({ start: 'top 70%', end: 'bottom 50%' })
  const reveal = useReveal()
  const series = useMemo(() => [
    { name: 'Canopy air °C', data: diurnalSeries({ seed: 21, base: 19, amp: 5 }), color: 'var(--color-sage)' },
    { name: 'Open prairie air °C', data: diurnalSeries({ seed: 22, base: 22, amp: 9 }), color: 'var(--color-signal)' },
  ], [])
  return (
    <article ref={reveal} className="border-t border-white/10 py-24 md:py-32" aria-labelledby={`ch-${app.id}`}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ChapterHeader app={app} index={index} className="reveal" />
            <Measurements items={app.measurements} />
            <p className="reveal mt-6 text-[15px] leading-relaxed text-paper/70">Phenology, environmental change, microclimate, the conditions affecting organisms, ecosystem health and restoration outcomes — with imaging alongside the numbers.</p>
            <div className="reveal mt-8 flex gap-3"><Button to={app.route} variant="primary">{app.cta}</Button></div>
          </div>
          <div ref={ref} className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-2">
              <ExplorerScene kind="ecosystem" count={8} heat={easeOut(seg(p, 0.1, 0.6))} className="text-paper" showValues={p > 0.4} seed={6} />
              <div className="absolute left-4 top-4 flex gap-2"><Tag>Demo data</Tag></div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-ink-2 p-5">
              <div className="flex items-center justify-between gap-4"><Legend series={series} /><Tag>Demo data</Tag></div>
              <MiniChart series={series} height={140} className="mt-3 text-paper" unit="°" />
              <p className="mt-2 text-[13px] text-stone">Under canopy and in the open, 90 m apart: a different environment for everything living there.</p>
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}

/* ---------------- Urban heat ---------------- */
function Urban({ app, index }) {
  const [ref, p] = useScrollProgress({ start: 'top 70%', end: 'bottom 45%' })
  const reveal = useReveal()
  const heat = easeOut(seg(p, 0.25, 0.6))
  const nodes = easeOut(seg(p, 0.55, 0.95))
  const pts = useMemo(() => nodeLayout('city', 14, 4), [])
  const single = 1 - easeOut(seg(p, 0.2, 0.45))
  const scaleLabels = ['Regional weather', 'City', 'Neighborhood', 'Street level']
  const scaleIdx = Math.min(3, Math.floor(seg(p, 0.1, 0.95) * 4))
  return (
    <article ref={reveal} className="border-t border-white/10 py-24 md:py-32" aria-labelledby={`ch-${app.id}`}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div ref={ref} className="order-2 lg:order-1 lg:col-span-7">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-2">
              <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-auto w-full text-paper" role="img" aria-label="A city block map: one regional reading, then hyperlocal readings varying across downtown, residential, parks, parking and industrial areas.">
                <CityScene heat={heat} />
                <g style={{ opacity: single, transition: 'opacity 0.3s' }}>
                  <rect x="40" y="40" width="920" height="520" fill={rampColor(0.6, 0.15)} />
                  <text x="500" y="300" textAnchor="middle" fill="var(--color-paper)" fontFamily="var(--font-sans)" fontWeight="600" fontSize="96" letterSpacing="-4">92 °F</text>
                  <text x="500" y="332" textAnchor="middle" fill="var(--color-stone)" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="2">ONE REGIONAL READING</text>
                </g>
                <g style={{ opacity: nodes, transition: 'opacity 0.3s' }}>
                  <BaseStationGlyph x={500} y={300} s={1.1} />
                  {pts.map((pt, i) => {
                    const x = pt.x * VB.w, y = pt.y * VB.h
                    const v = 84 + Math.round(((i * 53) % 17))
                    return <NodeGlyph key={i} x={x} y={y} value={`${v}°`} delay={i * 0.2} color={v > 94 ? 'var(--color-signal)' : 'var(--color-data)'} />
                  })}
                </g>
              </svg>
              <div className="absolute left-4 top-4 flex gap-2"><Tag>Demo data</Tag></div>
              <ol className="grid grid-cols-4 divide-x divide-white/10 border-t border-white/10" aria-label="Scale">
                {scaleLabels.map((l, i) => <li key={l} className={`p-3 text-center font-mono text-[10px] tracking-[0.14em] uppercase transition-colors ${i === scaleIdx ? 'bg-white/5 text-signal-2' : 'text-stone'}`}>{l}</li>)}
              </ol>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <ChapterHeader app={app} index={index} className="reveal" />
            <h4 className="reveal mt-8 text-[20px] font-semibold tracking-tight">Heat risk can change from one neighborhood to the next.</h4>
            <p className="reveal mt-3 text-[15px] leading-relaxed text-paper/70">Extreme heat can pose serious health risks, particularly in urban environments. Distributed monitoring can help organizations understand where and when extreme heat conditions develop. PheNode networks provide high-resolution observations that may support:</p>
            <ul className="reveal mt-4 flex flex-wrap gap-2">{app.supports.map((s) => <li key={s} className="chip border-white/15 text-paper/80">{s}</li>)}</ul>
            <p className="reveal mt-5 rounded-md border-l-2 border-data pl-4 text-[14px] leading-relaxed text-stone">{app.caveat}</p>
            <div className="reveal mt-8 flex gap-3"><Button to={app.route} variant="primary">{app.cta}</Button></div>
          </div>
        </div>
      </Container>
    </article>
  )
}
