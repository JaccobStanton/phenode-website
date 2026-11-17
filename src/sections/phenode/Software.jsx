import { Container, Section, Eyebrow, Button, Tag } from '../../components/ui/primitives.jsx'
import { useState, useRef, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DeviceFrame from '../../components/software/DeviceFrame.jsx'
import { Screen, SCREENS, SCREEN_RATIO, PhoneScreen, PHONE_SCREENS, PHONE_RATIO } from '../../components/media/media.jsx'
import { TestimonialSlot } from '../../sections/home/Proof.jsx'
import { SOFTWARE_MODULES } from '../../data/sensors.js'
import { prefersReducedMotion } from '../../lib/motion.js'
import { FEATURES } from '../../data/features.js'

// Views with a real screenshot (`shot`) are selectable; the rest are listed without one.
const VIEWS = [
  { id: 'fleet', name: 'Fleet', text: 'Every PheNode you own: health status, latest temperature, rainfall, wind and battery, site by site.', shot: 'fleet-overview' },
  { id: 'base', name: 'Base station', text: 'Live air temperature, rainfall and wind at a glance, then every sensor on the frame charted over time.', shot: 'base-station' },
  { id: 'measurements', name: 'Measurements by category', text: 'Filter a base station’s charts by category — environment, light, soil, power and device — over any time range.', shot: 'measurement-categories' },
  { id: 'precipitation', name: 'Precipitation', text: 'Today’s rain from the PheNode’s own gauge, hour by hour, beside the National Weather Service forecast for the next seven days and the next 48 hours.', shot: 'precipitation-overview' },
  { id: 'storms', name: 'Storm events and fleet rainfall', text: 'Every storm this month with its peak intensity, how far the soil rose and how rare it was; every PheNode’s rain side by side; and live radar.', shot: 'precipitation-storms' },
  { id: 'season', name: 'Season, normals and drought', text: 'Rain since April against the 1991–2020 normal, month by month, with the county’s US Drought Monitor category, the year to date and NOAA outlooks.', shot: 'precipitation-season' },
  { id: 'gauge-check', name: 'Rain gauge check', text: 'Each rain gauge compared every month with the three nearest official gauges, the middle result counting, with what to check when it reads low.', shot: 'precipitation-unit-check' },
  { id: 'imaging', name: 'Imaging', text: 'The images PheNode captured, by day, for remote visual monitoring.', shot: 'imaging' },
  { id: 'diagnostics', name: 'System diagnostics', text: 'Each base station’s health: wireless sensors connected, cellular and Wi‑Fi signal, battery, internal temperature and the status of every sensor.', shot: 'system-diagnostics' },
  { id: 'wireless-fleet', name: 'Wireless fleet', text: 'Every wireless node on a PheNode, with its health, soil moisture, soil temperature, signal strength and battery.', shot: 'wireless-fleet-overview' },
  { id: 'network', name: 'Wireless network map', text: 'Nodes placed on a street or satellite map with the PheNode they report to, and each node’s latest readings, battery and probes.', shot: 'sensor-map' },
  { id: 'node', name: 'Wireless sensor measurements', text: 'One node in detail: sensor information, then its measurements over time — including both soil probes.', shot: 'wireless-sensor-measurements' },
  { id: 'overlay', name: 'Multi-sensor overlay', text: 'The same measurement from many nodes on one chart, to see where conditions diverge.', shot: 'multi-sensor-overlay' },
  { id: 'dual', name: 'Dual measurement comparison', text: 'Two measurements on shared time, left and right axes — temperature against humidity, for example.', shot: 'dual-comparison' },
  { id: 'downloads', name: 'Downloads', text: 'Choose a date range and what to export — environmental, wireless sensor or diagnostics data, or images — for a PheNode and any of its nodes.', shot: 'data-downloads' },
  { id: 'settings', name: 'Settings & remote control', text: 'Adjust deployed hardware and manage sub-accounts without a site visit.' },
]

/**
 * PheNode page, "Software" part (/phenode#software). Until Nov 16 this was its own page, /phenode/software; Jake merged
 * the PheNode pages into one scroll page (pages/PheNode.jsx), and the old address now lands here. Like every part it
 * opens on ink under a hairline, with its title as an h2 (so the sections inside it are h3).
 */
export default function SoftwarePart() {
  return (
    <>
      <section className="theme-ink border-t border-white/10 pt-24 pb-12 md:pt-36 lg:pt-44">
        <Container>
          <p className="eyebrow">Software</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h2 className="display-xl lg:col-span-7">Everything the fleet knows, in one place.</h2>
            <p className="lede lg:col-span-5">Browser-based. Fleet, wireless networks, sensor measurements, imaging, bespoke downloads, remote control — and an accessible API underneath to control the data flow.</p>
          </div>
          <div className="mt-12"><DeviceFrame kind="monitor" aspect={SCREEN_RATIO}><Screen id="fleet-overview" sizes="(min-width:1440px) 1360px, 96vw" /></DeviceFrame></div>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"><Tag tone="data">PheNode software</Tag><span className="font-mono text-[11px] tracking-[0.1em] text-stone">Fleet overview</span></p>
        </Container>
      </section>

      <Section theme="paper">
        <Container>
          <ViewExplorer />
          <OnAPhone />
        </Container>
      </Section>

      {/* The "Capabilities" list ("What the software does today") that sat on the left here is removed (Jake, Nov 17);
          the configurable modules take the section, title on the left as in the other sections. Hidden for now too
          (FEATURES.softwareModules, Jake, Nov 17). */}
      {FEATURES.softwareModules && <Section theme="ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>Configurable modules</Eyebrow>
              <h3 className="display-md mt-4 max-w-[16ch]">The hardware is configurable. The software is too.</h3>
              <div className="mt-8 flex flex-wrap gap-3">{FEATURES.designSystem && <Button to="/design-your-system" variant="primary">Choose software for your system</Button>}<Button to="/contact?intent=demo" variant={FEATURES.designSystem ? 'ghost' : 'primary'}>Request a demo</Button></div>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid gap-2 sm:grid-cols-2">
                {SOFTWARE_MODULES.map((m) => <li key={m.id} className={`rounded-lg border p-4 ${m.default ? 'border-data/40 bg-data/5' : 'border-white/10'}`}><p className="text-[14.5px] font-medium">{m.name}</p><p className="mt-0.5 text-[13px] text-paper/65">{m.text}</p><p className={`mt-2 font-mono text-[10px] tracking-[0.12em] uppercase ${m.default ? 'text-data' : 'text-stone'}`}>{m.default ? 'Included' : 'Optional'}</p></li>)}
              </ul>
              <TestimonialSlot context="Access to data" className="mt-8" />
            </div>
          </div>
        </Container>
      </Section>}
    </>
  )
}

const LG = '(min-width: 64rem)'
// From lg the list follows the scroll (Jake, Nov 17): the view whose row crosses this line (share of the screen height,
// level with the middle of the sticky screen) is highlighted and its screen shown.
const LINE = 0.42

/** Views list on the left; the highlighted view's real screen on the right (sticky). */
function ViewExplorer() {
  const [active, setActive] = useState(VIEWS[0].id)
  const list = useRef(null)
  const current = VIEWS.find((v) => v.id === active)
  useEffect(() => {
    const mq = matchMedia(LG)
    let triggers = []
    const build = () => {
      triggers.forEach((t) => t.kill())
      triggers = []
      if (!mq.matches || !list.current) return
      // one trigger per view with a screen; the "Settings" row has none, so the last screen stays while it passes
      list.current.querySelectorAll('li[data-view]').forEach((li) => {
        triggers.push(ScrollTrigger.create({ trigger: li, start: `top ${LINE * 100}%`, end: `bottom ${LINE * 100}%`, onToggle: (self) => self.isActive && setActive(li.dataset.view) }))
      })
    }
    build()
    mq.addEventListener('change', build)
    return () => { mq.removeEventListener('change', build); triggers.forEach((t) => t.kill()) }
  }, [])
  // A click shows the view at once and, from lg, brings its row to the line so the scroll and the highlight agree.
  const choose = (id, el) => {
    setActive(id)
    if (!matchMedia(LG).matches) return
    const r = el.getBoundingClientRect()
    window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight * LINE, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Eyebrow>Views</Eyebrow>
        <h3 className="display-md mt-4 max-w-[14ch]">Built around how field teams actually work.</h3>
        <ol ref={list} className="mt-8 flex flex-col divide-y divide-ink/10 border-y border-ink/10" aria-label="Software views">
          {VIEWS.map((v, i) => {
            const on = v.id === active
            const inner = (
              <>
                <span className={`font-mono text-[11px] ${on ? 'text-data' : 'text-stone-2'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block text-[16px] font-semibold tracking-tight">{v.name}</span>
                  <span className={`mt-1 block text-[14px] leading-relaxed ${on ? 'text-ink/80' : 'text-ink/60'}`}>{v.text}</span>
                </span>
              </>
            )
            return (
              <li key={v.id} data-view={v.shot ? v.id : undefined}>
                {v.shot ? (
                  <button type="button" aria-pressed={on} onClick={(e) => choose(v.id, e.currentTarget)} className={`relative grid w-full grid-cols-[32px_1fr] gap-3 py-4 pl-3 text-left transition-colors ${on ? 'bg-phenode-white-2' : 'hover:bg-phenode-white-2/60'}`}>
                    <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[2px] transition-colors ${on ? 'bg-data' : 'bg-transparent'}`} />
                    {inner}
                  </button>
                ) : (
                  <div className="grid grid-cols-[32px_1fr] gap-3 py-4 pl-3">{inner}</div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
      <div className="lg:col-span-8">
        <div className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-xl border border-ink/15 bg-[#061127] shadow-[0_30px_60px_rgba(14,16,18,0.18)]">
            <div className="relative" style={{ aspectRatio: SCREEN_RATIO }}>
              {VIEWS.filter((v) => v.shot).map((v) => (
                <div key={v.id} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: v.id === active ? 1 : 0 }} aria-hidden={v.id !== active}>
                  <Screen id={v.shot} sizes="(min-width:1024px) 62vw, 96vw" />
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] tracking-[0.12em] uppercase text-stone-2" aria-live="polite">{SCREENS[current.shot].label}</p>
        </div>
      </div>
    </div>
  )
}

/** The same software in a phone browser — real captures at phone size. */
function OnAPhone() {
  return (
    <div className="mt-24 grid items-center gap-12 border-t hairline pt-16 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Eyebrow>In the field</Eyebrow>
        <h3 className="display-md mt-4 max-w-[14ch]">On a phone, too.</h3>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink/75">The software runs in the browser, so the fleet and a base station’s live readings are on your phone while you stand at the site. Nothing to install.</p>
      </div>
      <div className="lg:col-span-7">
        <div className="mx-auto grid max-w-[520px] grid-cols-2 gap-6 sm:gap-10">
          {Object.keys(PHONE_SCREENS).map((id, i) => (
            <figure key={id} className={i === 1 ? 'mt-12' : ''}>
              <DeviceFrame kind="phone" aspect={PHONE_RATIO}><PhoneScreen id={id} sizes="(min-width:640px) 240px, 42vw" /></DeviceFrame>
              <figcaption className="mt-4 text-center font-mono text-[11px] tracking-[0.12em] uppercase text-stone-2">{PHONE_SCREENS[id].label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
