import { useMemo, useRef, useCallback, useLayoutEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container, Section, Eyebrow, Button, Tag } from '../../components/ui/primitives.jsx'
import DataJourney, { JOURNEY, JourneyList, journeyArt } from '../../components/viz/DataJourney.jsx'
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

/**
 * PheNode page, "Data platform" part (/phenode#data-platform; the header's "How It Works" leads here too). Until Nov 16
 * this was its own page, /phenode/data-platform; Jake merged the PheNode pages into one scroll page (pages/PheNode.jsx),
 * and the old address now lands here. Its "System architecture" section stays (Jake, Nov 16), unlike the PheNode
 * overview's own one, which is hidden (FEATURES.phenodeTechSections).
 */
// From lg the journey pins while its packet travels. The pinned block is only as tall as its content, so before it pins
// it sits just under the title (Jake, Nov 17: it used to start half a screen lower, centred in a screen-tall box), and
// it pins centred in the screen below the header. Progress runs exactly while it is pinned.
const LG = '(min-width: 64rem)'
const HEADER = 72
const pinTop = (el) => Math.max(HEADER + 16, Math.round(HEADER + (window.innerHeight - HEADER - el.offsetHeight) / 2))

export default function DataPlatformPart() {
  const stage = useRef(null)
  const start = useCallback(() => (stage.current && matchMedia(LG).matches ? `top ${pinTop(stage.current)}px` : 'top top'), [])
  const end = useCallback(() => (stage.current && matchMedia(LG).matches ? `bottom ${pinTop(stage.current) + stage.current.offsetHeight}px` : 'bottom bottom'), [])
  const [ref, raw] = useScrollProgress({ start, end })
  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const place = () => { el.style.top = `${pinTop(el)}px` }
    place()
    window.addEventListener('resize', place)
    // the web fonts change the block's height once they load; ScrollTrigger re-reads start/end on refresh. (The "Now"
    // note reserves three lines, so the height doesn't change from stop to stop while it is pinned.)
    let live = true
    document.fonts?.ready.then(() => { if (live) { place(); ScrollTrigger.refresh() } })
    return () => { live = false; window.removeEventListener('resize', place) }
  }, [])
  const p = easeInOut(seg(raw, 0.02, 0.98))
  const active = Math.round(p * (JOURNEY.length - 1))
  const series = useMemo(() => [
    { name: 'Raw', data: soilMoistureSeries({ seed: 41, days: 7, noise: 1.6 }), color: 'var(--color-stone)' },
    { name: 'Cleaned (your preferences)', data: soilMoistureSeries({ seed: 41, days: 7, noise: 0.1 }), color: 'var(--color-data)' },
  ], [])
  return (
    <>
      {/* "How it works" on home 04's night navy (Jake, Nov 17): the title, the lede and the journey share one
          theme-midnight section, which fades in from the black part above and back out into the black "Normalized
          output" below, so the journey no longer cuts from black to white. */}
      <Section theme="ink" className="theme-midnight border-t border-white/10 lg:pb-48" padded={false}>
        <div className="pt-24 pb-6 md:pt-36 lg:pt-44">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="eyebrow">Data platform · how it works</p>
                <h2 className="display-xl mt-4">From measurement to meaningful data.</h2>
              </div>
              {/* home 04's Download / API drawing, with its blue backlight, fills the open space above the lede
                  (Jake, Nov 17). Two columns only from lg; on narrower screens the lede sits under the title. */}
              <div className="lg:col-span-5 lg:flex lg:flex-col lg:self-stretch">
                <div className="journey-glow hidden min-h-[140px] flex-1 lg:-mt-10 lg:block" aria-hidden="true">
                  <img src={journeyArt('export')} alt="" loading="lazy" decoding="async" draggable="false" className="absolute inset-0 h-full w-full object-contain" />
                </div>
                <p className="lede lg:mt-6">Environmental readings leave the hardware as a signal and arrive in your workflow as structured datasets, normalized to the preferences you set.</p>
              </div>
            </div>
          </Container>
        </div>

        {/* about 1.4 screens of pinned scrolling, as before; the bottom padding keeps the fade to black below the journey */}
        <div ref={ref} className="relative lg:h-[calc(140vh_+_26rem)]">
          <div ref={stage} className="lg:sticky">
            <Container className="py-20 lg:pb-0 lg:pt-10">
              <div className="hidden text-paper md:block"><DataJourney progress={raw} /></div>
              <div className="text-paper md:hidden"><JourneyList progress={raw} /></div>
              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <div className="hidden md:block lg:col-span-5"><p className="eyebrow">Now</p><p className="mt-2 text-[22px] font-semibold tracking-tight">{JOURNEY[active].label}</p><p className="mt-2 min-h-[4.875em] max-w-[44ch] text-[15.5px] leading-relaxed text-[color:var(--fg-muted)]">{JOURNEY[active].note}</p></div>
                <p className="max-w-[52ch] text-[15px] leading-relaxed text-[color:var(--fg-muted)] lg:col-span-7">Scroll to follow one reading through the system. The amber pulse is a physical measurement; it becomes a cyan packet the moment it reaches the control box and is on its way to the backend.</p>
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
              <h3 className="display-md mt-4 max-w-[16ch]">Same columns, every site, every season.</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-paper/75">Every device and node writes to the same schema. Downloads carry the same headers whether the data came from a growth chamber or a highway shoulder, so analyses move between projects without re-mapping.</p>
              <ul className="mt-6 flex flex-col gap-2 text-[14.5px] text-paper/80">
                {['Per-device and per-node CSV downloads', 'Cleaning preferences for gaps and outliers, applied on export', 'Time stamps in UTC with field-local options', 'Images alongside measurements'].map((i) => <li key={i} className="flex gap-3"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-data" aria-hidden="true" />{i}</li>)}
              </ul>
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
          {/* the Downloads capture, full width under the copy and the mock data (Jake, Nov 17; it sat under the list) */}
          <ScreenCard id="data-downloads" caption="Downloads — a date range, a PheNode and its nodes" tone="ink" sizes="(min-width:1440px) 1360px, 96vw" className="screen-fit mt-16" />
          <div className="mt-24 border-t border-white/10 pt-12">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6"><Eyebrow>Compare</Eyebrow><h3 className="display-md mt-4 max-w-[18ch]">Because the data shares one schema, it lines up.</h3></div>
              <p className="max-w-[48ch] text-[15px] leading-relaxed text-paper/75 lg:col-span-6">Overlay one measurement from many nodes, or put two measurements on a shared timeline. Same schema underneath, so comparisons need no re-mapping.</p>
            </div>
            {/* stacked, full width, so the charts can be read (Jake, Nov 17; they were side by side) */}
            <div className="mt-10 flex flex-col gap-14">
              <ScreenCard id="multi-sensor-overlay" caption="Multi-sensor overlay — one measurement, many nodes" tone="ink" sizes="(min-width:1440px) 1360px, 96vw" className="screen-fit" />
              <ScreenCard id="dual-comparison" caption="Dual comparison — two measurements, one timeline" tone="ink" sizes="(min-width:1440px) 1360px, 96vw" className="screen-fit" />
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>System architecture</Eyebrow>
              <h3 className="display-md mt-4 max-w-[14ch]">Every layer, in order.</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/75">From sensors to external tools. Design your field program, data analysis pipeline, and who has access to it.</p>
              <ul className="mt-6 flex flex-col gap-2 border-t hairline pt-5 text-[14px] text-ink/80">{SOFTWARE.dataPlan.map((d) => <li key={d} className="flex gap-3"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-data" />{d}</li>)}</ul>
              <div className="mt-8 flex flex-wrap gap-3"><Button to="/phenode#software" variant="primary-ink">The software</Button><Button to="/contact" variant="ghost-ink">Ask about the API</Button></div>
            </div>
            <div className="lg:col-span-8"><ArchitectureDiagram /></div>
          </div>
        </Container>
      </Section>
    </>
  )
}
