import { useState } from 'react'
import { Check } from 'lucide-react'
import { Eyebrow, Section, Container, Button, Tag } from '../../components/ui/primitives.jsx'
import DeviceFrame from '../../components/software/DeviceFrame.jsx'
import { LoopVideo, ScreenCard } from '../../components/media/media.jsx'
import DataPulse from '../../components/viz/DataPulse.jsx'
import { NodeGlyph } from '../../components/viz/scenes.jsx'
import { SOFTWARE } from '../../data/specs.js'
import { SOFTWARE_MODULES } from '../../data/sensors.js'
import { useScrollProgress, useReveal, seg, easeOut, lerp } from '../../lib/motion.js'
import { FEATURES } from '../../data/features.js'
import { homeNo } from '../../data/homeSections.js'

// What the Precipitation page adds, beyond the three screens shown.
const PRECIPITATION = [
  { name: 'Storms, and how rare', text: 'Every storm this month with its peak intensity, how far the soil rose and how often rain like it comes (NOAA Atlas 14).' },
  { name: 'Storms your PheNode missed', text: 'When radar saw far more rain than the gauge caught, the software says so and lists the storms it missed.' },
  { name: 'Season, drought and outlook', text: 'Rain since April and since January against the 1991–2020 normal, the county’s drought category and NOAA outlooks.' },
  { name: 'A fair gauge check', text: 'Each gauge is compared every month with the three nearest official gauges, and the middle result counts.' },
]

export default function Software() {
  const [ref, p] = useScrollProgress({ start: 'top 70%', end: 'bottom 70%' })
  const reveal = useReveal()
  const scale = lerp(0.86, 1, easeOut(seg(p, 0.1, 0.6)))
  const [modules, setModules] = useState(() => new Set(SOFTWARE_MODULES.filter((m) => m.default).map((m) => m.id)))
  const toggle = (id) => setModules((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <Section id="software" theme="ink" className="overflow-hidden border-t border-white/10">
      <Container>
        <div ref={reveal}>
          <Eyebrow index={homeNo('software')} className="reveal">Software</Eyebrow>
          <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 className="display-lg reveal max-w-[14ch] lg:col-span-7">The hardware is configurable. The software is too.</h2>
            <p className="lede reveal max-w-[44ch] lg:col-span-5">One browser-based platform for the whole fleet: status, wireless networks, measurements, imaging, downloads, remote control — and an API underneath all of it.</p>
          </div>
        </div>

        {/* Field → screen */}
        <div ref={ref} className="relative mt-16">
          <div className="grid items-center gap-8 lg:grid-cols-[120px_1fr]">
            <div className="relative hidden h-[140px] lg:block" aria-hidden="true">
              <svg viewBox="0 0 120 140" className="absolute inset-0 h-full w-full overflow-visible text-paper/40">
                <NodeGlyph x={30} y={70} s={1.6} />
                <DataPulse d="M46 70 C 80 70, 100 70, 140 70" color="var(--color-signal)" toColor="var(--color-data)" dur={2.6} r={3} pathOpacity={0.3} />
                <DataPulse d="M46 70 C 80 70, 100 70, 140 70" color="var(--color-signal)" toColor="var(--color-data)" dur={2.6} delay={1.3} r={3} showPath={false} />
              </svg>
              <p className="absolute -bottom-6 left-0 font-mono text-[10px] tracking-[0.14em] uppercase text-stone">Field</p>
            </div>
            <div className="origin-center will-change-transform" style={{ transform: `scale(${scale})`, transition: 'transform 0.2s linear' }}>
              <DeviceFrame kind="monitor" aspect="8 / 5">
                <LoopVideo name="software-tour-1920" poster="software-tour-poster.webp" label="Recording of the PheNode software: the fleet overview, then a base station's live readings scrolling down to seven days of charts, the wireless sensors on a satellite map, and the latest image from a site." />
              </DeviceFrame>
            </div>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"><Tag tone="data">PheNode software</Tag><span className="font-mono text-[11px] tracking-[0.1em] text-stone">Fleet · base station · wireless network · imaging</span></p>
        </div>

        {/* real views from the software (the recording above covers fleet, base station, map and imaging) */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <ScreenCard id="system-diagnostics" caption="Diagnostics — signal, battery, every sensor’s status" sizes="(min-width:768px) 31vw, 92vw" />
          <ScreenCard id="wireless-sensor-measurements" caption="Wireless node — two soil probes, seven days" sizes="(min-width:768px) 31vw, 92vw" />
          <ScreenCard id="multi-sensor-overlay" caption="Compare — one measurement across nodes" sizes="(min-width:768px) 31vw, 92vw" />
        </div>

        {/* Precipitation: rainfall, season and the monthly rain gauge check */}
        <div className="mt-24">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="flex flex-wrap items-center gap-3"><span className="eyebrow">Precipitation</span><Tag tone="signal">New</Tag></p>
              <h3 className="display-sm mt-3 max-w-[24ch]">Know how much rain fell — and whether your gauge caught it.</h3>
            </div>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-paper/70 lg:col-span-5">Each PheNode’s rain gauge, read beside the National Weather Service forecast, radar, 30-year normals, the US Drought Monitor and the official gauges nearby.</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <ScreenCard id="precipitation-overview" caption="Today’s rain and the next seven days" sizes="(min-width:768px) 31vw, 92vw" />
            <ScreenCard id="precipitation-season" caption="The season against normal, and drought" sizes="(min-width:768px) 31vw, 92vw" />
            <ScreenCard id="precipitation-unit-check" caption="Monthly rain gauge check" sizes="(min-width:768px) 31vw, 92vw" />
          </div>
          <ul className="mt-10 grid gap-x-10 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRECIPITATION.map((f) => (
              <li key={f.name}>
                <p className="text-[15px] font-medium text-paper">{f.name}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-paper/70">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* capabilities + modules */}
        <div className="mt-24 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">What the software does today</p>
            <ul className="mt-6 flex flex-col divide-y divide-white/10 border-y border-white/10">
              {SOFTWARE.capabilities.map((c) => (
                <li key={c.id} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <span className="text-[15px] font-medium text-paper">{c.name}</span>
                  <span className="text-[14px] leading-relaxed text-paper/70">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow">Configurable software</p>
            <h3 className="display-sm mt-2">Add capabilities as the project needs them.</h3>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">Toggle modules to see how a software configuration takes shape. Everything shown is a current PheNode offering; custom integrations are scoped with Agrela.</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2" aria-label="Software modules">
              {SOFTWARE_MODULES.map((m) => {
                const on = modules.has(m.id)
                return (
                  <li key={m.id}>
                    <button type="button" role="switch" aria-checked={on} onClick={() => toggle(m.id)} className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${on ? 'border-data/60 bg-data/10' : 'border-white/10 hover:border-white/30'}`}>
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${on ? 'border-data bg-data text-ink' : 'border-white/30'}`}>{on && <Check size={12} strokeWidth={3} />}</span>
                      <span><span className="block text-[14.5px] font-medium text-paper">{m.name}</span><span className="block text-[13px] text-paper/65">{m.text}</span></span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.14em] uppercase text-stone">
              <span className="text-paper">{modules.size} modules</span>
              <span>{modules.has('api') || modules.has('backend') ? 'Advanced data access enabled' : 'Dashboard + downloads'}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/phenode/software" variant="primary">Explore the software</Button>
              {FEATURES.designSystem && <Button to="/design-your-system" variant="ghost">Build a system with these modules</Button>}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
