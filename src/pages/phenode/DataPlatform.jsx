import { useMemo } from 'react'
import Page from '../../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button, Tag } from '../../components/ui/primitives.jsx'
import DataJourney, { JOURNEY, JourneyList } from '../../components/viz/DataJourney.jsx'
import ArchitectureDiagram from '../../components/viz/ArchitectureDiagram.jsx'
import MiniChart, { Legend } from '../../components/viz/MiniChart.jsx'
import { SOFTWARE } from '../../data/specs.js'
import { ScreenCard } from '../../components/media/media.jsx'
import { useScrollProgress, seg, easeInOut } from '../../lib/motion.js'
import { soilMoistureSeries } from '../../lib/demoData.js'

const CSV = `timestamp_utc,device,node,air_temp_c,rh_pct,pressure_hpa,soil_vwc_probe1,soil_temp_c_probe1,soil_ec_ds_m_probe1
2026-06-14T12:00:00Z,PheNode_0001,WS-04,23.4,54.1,996.2,0.312,19.8,0.42
2026-06-14T13:00:00Z,PheNode_0001,WS-04,24.1,51.7,995.9,0.309,20.1,0.42
2026-06-14T14:00:00Z,PheNode_0001,WS-04,24.9,49.8,995.4,0.306,20.5,0.41`

export default function DataPlatformPage() {
  const [ref, raw] = useScrollProgress({ start: 'top top', end: 'bottom bottom' })
  const p = easeInOut(seg(raw, 0.02, 0.98))
  const active = Math.round(p * (JOURNEY.length - 1))
  const series = useMemo(() => [
    { name: 'Raw', data: soilMoistureSeries({ seed: 41, days: 7, noise: 1.6 }), color: 'var(--color-stone)' },
    { name: 'Cleaned (your preferences)', data: soilMoistureSeries({ seed: 41, days: 7, noise: 0.1 }), color: 'var(--color-data)' },
  ], [])
  return (
    <Page title="Data platform" description="How PheNode turns measurements into cleaned, normalized, downloadable data — with an API and a dockerized backend for advanced users.">
      <section className="theme-ink pt-28 pb-6 md:pt-40">
        <Container>
          <p className="eyebrow">Data platform · how it works</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">From measurement to meaningful data.</h1>
            <p className="lede lg:col-span-5">Environmental readings leave the hardware as a signal and arrive in your workflow as structured datasets, normalized to the preferences you set.</p>
          </div>
        </Container>
      </section>

      <Section theme="paper" padded={false}>
        <div ref={ref} className="relative lg:h-[240vh]">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-16">
            <Container className="py-20 lg:py-0">
              <div className="hidden text-ink md:block"><DataJourney progress={raw} /></div>
              <div className="text-ink md:hidden"><JourneyList progress={raw} /></div>
              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <div className="hidden md:block lg:col-span-5"><p className="eyebrow">Now</p><p className="mt-2 text-[22px] font-semibold tracking-tight">{JOURNEY[active].label}</p><p className="mt-2 max-w-[44ch] text-[15.5px] leading-relaxed text-ink/75">{JOURNEY[active].note}</p></div>
                <p className="max-w-[52ch] text-[15px] leading-relaxed text-ink/70 lg:col-span-7">Scroll to follow one reading through the system. The amber pulse is a physical measurement; it becomes a cyan packet the moment it reaches the control box and is on its way to the backend.</p>
              </div>
            </Container>
          </div>
        </div>
      </Section>

      <Section theme="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <Eyebrow>Normalized output</Eyebrow>
              <h2 className="display-md mt-4 max-w-[16ch]">Same columns, every site, every season.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-paper/75">Every device and node writes to the same schema. Downloads carry the same headers whether the data came from a growth chamber or a highway shoulder, so analyses move between projects without re-mapping.</p>
              <ul className="mt-6 flex flex-col gap-2 text-[14.5px] text-paper/80">
                {['Per-device and per-node CSV downloads', 'Cleaning preferences for gaps and outliers, applied on export', 'Time stamps in UTC with field-local options', 'Images alongside measurements'].map((i) => <li key={i} className="flex gap-3"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-data" aria-hidden="true" />{i}</li>)}
              </ul>
              <ScreenCard id="data-downloads" caption="Downloads — a date range, a PheNode and its nodes" tone="ink" sizes="(min-width:1024px) 34vw, 92vw" className="mt-10" />
            </div>
            <div className="min-w-0 lg:col-span-7">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-2">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5"><span className="font-mono text-[11px] tracking-[0.12em] uppercase text-stone">phenode_sensor_data.csv</span><Tag>Illustrative</Tag></div>
                <pre tabIndex={0} className="scroll-thin overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed text-paper/85">{CSV}</pre>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-ink-2 p-5">
                <div className="flex items-center justify-between gap-4"><Legend series={series} /><Tag>Demo data</Tag></div>
                <MiniChart series={series} height={150} className="mt-3 text-paper" unit="%" area={false} />
                <p className="mt-2 text-[13px] text-stone">Cleaning preferences are yours to set — and the raw data is always retained.</p>
              </div>
            </div>
          </div>
          <div className="mt-24 border-t border-white/10 pt-12">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6"><Eyebrow>Compare</Eyebrow><h2 className="display-md mt-4 max-w-[18ch]">Because the data shares one schema, it lines up.</h2></div>
              <p className="max-w-[48ch] text-[15px] leading-relaxed text-paper/75 lg:col-span-6">Overlay one measurement from many nodes, or put two measurements on a shared timeline. Same schema underneath, so comparisons need no re-mapping.</p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <ScreenCard id="multi-sensor-overlay" caption="Multi-sensor overlay — one measurement, many nodes" tone="ink" sizes="(min-width:768px) 46vw, 92vw" />
              <ScreenCard id="dual-comparison" caption="Dual comparison — two measurements, one timeline" tone="ink" sizes="(min-width:768px) 46vw, 92vw" />
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>System architecture</Eyebrow>
              <h2 className="display-md mt-4 max-w-[14ch]">Every layer, in order.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/75">Sensors to external tools. Expand for connectivity, data plan and backend details.</p>
              <ul className="mt-6 flex flex-col gap-2 border-t hairline pt-5 text-[14px] text-ink/80">{SOFTWARE.dataPlan.map((d) => <li key={d} className="flex gap-3"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-data" />{d}</li>)}</ul>
              <div className="mt-8 flex flex-wrap gap-3"><Button to="/phenode/software" variant="primary-ink">The software</Button><Button to="/contact" variant="ghost-ink">Ask about the API</Button></div>
            </div>
            <div className="lg:col-span-8"><ArchitectureDiagram /></div>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
