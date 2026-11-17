import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Page from '../../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button, Tag } from '../../components/ui/primitives.jsx'
import { Photo } from '../../components/media/media.jsx'
import ExplorerScene from '../../components/viz/ExplorerScene.jsx'
import EnvironmentTransition from '../../components/viz/EnvironmentTransition.jsx'
import MiniChart, { Legend } from '../../components/viz/MiniChart.jsx'
import { APPLICATION_BY_ID } from '../../data/applications.js'
import { PACKAGES, SENSOR_BY_ID } from '../../data/sensors.js'
import { CASE_STUDIES } from '../../data/caseStudies.js'
import { seg } from '../../lib/motion.js'
import { useScrollProgress } from '../../lib/scroll.js'
import { diurnalSeries, soilMoistureSeries } from '../../lib/demoData.js'
import { Link } from 'react-router-dom'

const PACKAGE_FOR = { transportation: 'fire-weather', agriculture: 'research', ecology: 'restoration', urban: 'fire-weather' }
const PIPELINE = [{ id: 'chamber', kind: 'chamber', label: 'Growth chamber' }, { id: 'greenhouse', kind: 'greenhouse', label: 'Greenhouse' }, { id: 'field', kind: 'field', label: 'Field experiment' }]

export default function ApplicationPage() {
  const { id } = useParams()
  const app = APPLICATION_BY_ID[id]
  const [pipeRef, pp] = useScrollProgress({ start: 'top 70%', end: 'bottom 40%' })
  const series = useMemo(() => (id === 'agriculture' || id === 'ecology'
    ? [{ name: 'Soil VWC % — plot A', data: soilMoistureSeries({ seed: 51, days: 14 }), color: 'var(--color-data)' }, { name: 'Soil VWC % — plot B', data: soilMoistureSeries({ seed: 52, days: 14, start: 26, dryRate: 0.045 }), color: 'var(--color-signal)' }]
    : [{ name: 'Air temp °C — site 1', data: diurnalSeries({ seed: 53, base: 27, amp: 7 }), color: 'var(--color-signal)' }, { name: 'Air temp °C — site 2', data: diurnalSeries({ seed: 54, base: 23.5, amp: 5 }), color: 'var(--color-data)' }]), [id])
  if (!app) return <Navigate to="/applications" replace />
  const pkg = PACKAGES.find((p) => p.id === PACKAGE_FOR[id])
  const cases = CASE_STUDIES.filter((c) => c.application === id)
  const count = app.environment === 'corridor' ? 10 : app.environment === 'city' ? 14 : 8
  return (
    <Page title={app.kicker} description={app.summary}>
      <section className="theme-ink pt-28 pb-10 md:pt-40">
        <Container>
          <p className="eyebrow">{app.kicker}</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">{app.title}</h1>
            <p className="lede lg:col-span-5">{app.summary}</p>
          </div>
          <div className="relative mt-12 overflow-hidden rounded-xl border border-white/10 bg-ink-2">
            <ExplorerScene kind={app.environment} count={count} heat={0.8} className="text-paper" showValues />
            <div className="absolute left-4 top-4 flex gap-2"><Tag>Demo data</Tag></div>
          </div>
          {/* Environmental photo: shown only once an application has one. The dashed placeholder is hidden for now (Jake, Nov 17). */}
          {app.photo && <Photo name={app.photo.name} alt={app.photo.alt} position={app.photo.position} ratio="21 / 9" sizes="(min-width:1440px) 1360px, 96vw" className="mt-4 rounded-xl border border-white/10" />}
        </Container>
      </section>

      <Section theme="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>What PheNode measures here</Eyebrow>
              <ul className="mt-5 flex flex-wrap gap-2">{app.measurements.map((m) => <li key={m} className="chip border-ink/15 text-ink/85">{m}</li>)}</ul>
              {app.benefits && <p className="mt-6 text-[15px] leading-relaxed text-ink/75">Roadside environmental projects are designed to improve {app.benefits.join(', ').toLowerCase()}. Monitoring shows whether they do.</p>}
              {app.supports && <><p className="mt-6 text-[15px] leading-relaxed text-ink/75">High-resolution environmental observations that may support:</p><ul className="mt-3 flex flex-wrap gap-2">{app.supports.map((s) => <li key={s} className="chip border-ink/15 text-ink/85">{s}</li>)}</ul></>}
              {app.caveat && <p className="mt-5 border-l-2 border-data pl-4 text-[14px] leading-relaxed text-stone-2">{app.caveat}</p>}
              {app.sub && (
                <div className="mt-8 rounded-lg border border-signal/30 bg-signal/5 p-5">
                  <p className="eyebrow text-signal">{app.sub.kicker}</p>
                  <h3 className="display-sm mt-2">{app.sub.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink/75">{app.sub.summary}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">{app.sub.measurements.map((m) => <li key={m} className="chip border-signal/40 text-ink/85">{m}</li>)}</ul>
                </div>
              )}
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-ink/10 bg-white p-5">
                <div className="flex items-center justify-between gap-4"><Legend series={series} /><Tag>Demo data</Tag></div>
                <MiniChart series={series} height={180} className="mt-3 text-ink" ticks={['Wk 1', 'Wk 2']} />
              </div>
              {pkg && (
                <div className="mt-6 rounded-xl border border-ink/10 p-5">
                  <p className="eyebrow">Example configuration · {pkg.name}</p>
                  <p className="mt-2 text-[14.5px] text-ink/75">{pkg.for}.</p>
                  <ul className="mt-3 grid gap-1.5 text-[14px] sm:grid-cols-2">
                    <li className="flex gap-2"><span className="font-mono text-[11px] text-stone-2 pt-1">NODE</span><span>Wireless sensor node + {pkg.node.length ? pkg.node.map((s) => SENSOR_BY_ID[s].short).join(' + ') : 'built-in light sensor'}</span></li>
                    <li className="flex gap-2"><span className="font-mono text-[11px] text-stone-2 pt-1">BASE</span><span>Base station{pkg.base.length ? ' + ' + pkg.base.map((s) => SENSOR_BY_ID[s].short).join(' + ') : ''}</span></li>
                  </ul>
                  <p className="mt-3 text-[12.5px] text-stone-2">Example packages are starting points, not fixed SKUs.</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {app.pipeline && (
        <Section theme="ink">
          <Container>
            <div ref={pipeRef}>
              <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-6"><Eyebrow>Complete research pipeline</Eyebrow><h2 className="display-md mt-3 max-w-[18ch]">{app.pipeline.title}</h2></div>
                <p className="max-w-[46ch] text-[15.5px] leading-relaxed text-paper/75 lg:col-span-6">{app.pipeline.text}</p>
              </div>
              <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-ink-2"><EnvironmentTransition stages={PIPELINE} progress={seg(pp, 0.05, 0.95)} count={6} /></div>
            </div>
          </Container>
        </Section>
      )}

      <Section theme={app.pipeline ? 'paper' : 'ink'}>
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div><Eyebrow>Deployments</Eyebrow><h2 className="display-md mt-3">Case studies in this application.</h2></div>
            <Button to="/case-studies" variant={app.pipeline ? 'ghost-ink' : 'ghost'}>All case studies</Button>
          </div>
          <ul className={`mt-8 flex flex-col divide-y border-y ${app.pipeline ? 'divide-ink/10 border-ink/10' : 'divide-white/10 border-white/10'}`}>
            {cases.length ? cases.map((c) => (
              <li key={c.slug}>{(() => {
                const inner = <><span className="font-mono text-[11px] tracking-[0.14em] uppercase opacity-60">{c.location} · {c.year}{c.placeholder ? ' · placeholder' : ''}{c.press?.length ? ' · press release' : ''}</span><span className="text-[18px] font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{c.project}</span><span className="text-[14px] opacity-70">{c.partner}</span></>
                // its first press release (the case study pages were deleted on Nov 17), or the Case Studies page
                return c.press?.length
                  ? <a href={c.press[0].href} target="_blank" rel="noreferrer" className="group flex flex-col gap-1 py-5">{inner}</a>
                  : <Link to="/case-studies" className="group flex flex-col gap-1 py-5">{inner}</Link>
              })()}</li>
            )) : <li className="py-5 text-[14px] opacity-70">Case studies for this application are pending customer permission.</li>}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3"><Button to="/contact" variant={app.pipeline ? 'primary-ink' : 'primary'}>Talk to Agrela</Button></div>
        </Container>
      </Section>
    </Page>
  )
}
