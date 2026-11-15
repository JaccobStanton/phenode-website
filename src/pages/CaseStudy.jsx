import { useMemo, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Tag, AssetPlaceholder, Button } from '../components/ui/primitives.jsx'
import { ScreenCard } from '../components/media/media.jsx'
import ExplorerScene from '../components/viz/ExplorerScene.jsx'
import MiniChart, { Legend } from '../components/viz/MiniChart.jsx'
import { CASE_STUDY_BY_SLUG, CASE_STUDIES } from '../data/caseStudies.js'
import { APPLICATION_BY_ID } from '../data/applications.js'
import { soilMoistureSeries, diurnalSeries } from '../lib/demoData.js'

export default function CaseStudy() {
  const { slug } = useParams()
  const c = CASE_STUDY_BY_SLUG[slug]
  const [year, setYear] = useState(0)
  const series = useMemo(() => [
    { name: 'Soil VWC %', data: soilMoistureSeries({ seed: 60 + year, days: 14, start: 24 + year * 3, dryRate: 0.04 - year * 0.008 }), color: 'var(--color-data)' },
    { name: 'Air temp °C', data: diurnalSeries({ seed: 70 + year, days: 14, base: 22, amp: 7 }), color: 'var(--color-signal)' },
  ], [year])
  if (!c) return <Navigate to="/case-studies" replace />
  const app = APPLICATION_BY_ID[c.application]
  const others = CASE_STUDIES.filter((o) => o.slug !== slug).slice(0, 2)
  const sections = [['Challenge', c.challenge], ['PheNode deployment', c.deployment], ['Result / insight', c.result]]
  return (
    <Page title={c.project} description={c.summary}>
      <section className="theme-ink pt-28 pb-10 md:pt-40">
        <Container>
          <p className="eyebrow"><Link to="/case-studies" className="hover:text-paper">Case studies</Link><span className="mx-2 opacity-40">/</span>{app?.kicker}</p>
          <h1 className="display-lg mt-4 max-w-[20ch]">{c.project}</h1>
          {c.placeholder && <div className="mt-4"><Tag tone="signal">Placeholder · content pending partner approval</Tag></div>}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 md:grid-cols-5">
            {[['Project', app?.headline], ['Location', c.location], ['Partner', c.partner], ['Deployment', c.year], ['Measurements', c.data.length + ' streams']].map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-stone">{k}</dt><dd className="mt-1 text-[14.5px] text-paper">{v}</dd></div>
            ))}
          </dl>
          <AssetPlaceholder label={`Opening photograph · ${c.partner.split(' · ')[0]} · 2400×1200 WebP`} ratio="2 / 1" className="mt-10 text-paper/60" />
        </Container>
      </section>

      <Section theme="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="lede max-w-[60ch]">{c.summary}</p>
              {sections.map(([k, v]) => (
                <div key={k} className="mt-10 border-t border-ink/10 pt-6">
                  <Eyebrow>{k}</Eyebrow>
                  <p className="mt-3 max-w-[62ch] text-[16.5px] leading-relaxed text-ink/85">{v}</p>
                </div>
              ))}
              <div className="mt-10 border-t border-ink/10 pt-6">
                <Eyebrow>Data collected</Eyebrow>
                <ul className="mt-3 flex flex-wrap gap-2">{c.data.map((d) => <li key={d} className="chip border-ink/15 text-ink/85">{d}</li>)}</ul>
              </div>
            </div>
            <aside className="lg:col-span-5">
              <div className="overflow-hidden rounded-xl border border-ink/10 bg-ink text-paper">
                <ExplorerScene kind={app?.environment || 'field'} count={app?.environment === 'corridor' ? 10 : 8} heat={0.6} className="text-paper" />
                <p className="border-t border-white/10 px-4 py-2 font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone">Schematic — not actual sensor locations</p>
              </div>
              {c.screen
                ? <ScreenCard id={c.screen.id} caption={c.screen.caption} tone="paper" sizes="(min-width:1024px) 38vw, 92vw" className="mt-6" />
                : <AssetPlaceholder label="Deployment imagery · 1600×1200" ratio="4 / 3" className="mt-4 text-ink/50" />}
            </aside>
          </div>
        </Container>
      </Section>

      {c.timeline.length > 0 && (
        <Section theme="ink">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Eyebrow>Over time</Eyebrow>
                <h2 className="display-md mt-3 max-w-[14ch]">Monitoring as it happens.</h2>
                <ol className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
                  {c.timeline.map((t, i) => (
                    <li key={t.year}>
                      <button type="button" aria-pressed={year === i} onClick={() => setYear(i)} className={`flex w-full items-start gap-4 py-4 text-left ${year === i ? 'text-paper' : 'text-stone hover:text-paper'}`}>
                        <span className="font-mono text-[12px] tracking-[0.1em]">{t.year}</span>
                        <span><span className="block text-[15px] font-semibold">{t.label}</span><span className="block text-[13.5px] opacity-90">{t.text}</span></span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="lg:col-span-8">
                <div className="rounded-xl border border-white/10 bg-ink-2 p-5">
                  <div className="flex items-center justify-between gap-4"><Legend series={series} /><Tag>Demo data</Tag></div>
                  <MiniChart series={series} height={220} className="mt-3 text-paper" ticks={['Wk 1', 'Wk 2']} />
                  <p className="mt-2 text-[13px] text-stone">Charts animate alongside photography once partner data is approved. Shown: illustrative series for {c.timeline[year].year} — {c.timeline[year].label.toLowerCase()}.</p>
                </div>
                <AssetPlaceholder label={`Photography · ${c.timeline[year].year} ${c.timeline[year].label} · 1600×900`} ratio="16 / 9" className="mt-4 text-paper/60" />
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section theme="paper">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><Eyebrow>More deployments</Eyebrow><h2 className="display-md mt-3">Continue reading.</h2></div><Button to="/contact" variant="primary-ink">Talk to Agrela</Button></div>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 md:grid-cols-2">
            {others.map((o) => <li key={o.slug} className="bg-phenode-white"><Link to={`/case-studies/${o.slug}`} className="block p-6 hover:bg-phenode-white-2"><span className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone-2">{o.location}</span><span className="mt-2 block text-[18px] font-semibold tracking-tight">{o.project}</span><span className="mt-1 block text-[14px] text-ink/70">{o.partner}</span></Link></li>)}
          </ul>
        </Container>
      </Section>
    </Page>
  )
}
