import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Page from '../../components/layout/Page.jsx'
import OverviewHero from '../../sections/phenode/OverviewHero.jsx'
import { Container, Section, Eyebrow, Button, Img, Stat } from '../../components/ui/primitives.jsx'
import SystemChain from '../../components/viz/SystemChain.jsx'
import ArchitectureDiagram from '../../components/viz/ArchitectureDiagram.jsx'
import { HEADLINE_NUMBERS } from '../../data/specs.js'
import { useScrollProgress, useReveal } from '../../lib/motion.js'

// The parts are the way into each product page; the system chain beside them tells the story in order. So each line
// says something the chain doesn't (and isn't a copy of the home page's cards either), every fact from specs.js or
// the page it links to. (Jake + PM, Nov 13 — same fix as home 02.)
const PARTS = [
  { to: '/phenode/wireless-node', name: 'Wireless sensor node', text: 'Measures air temperature, humidity, pressure, light and air quality, with up to two soil probes. Recharges by solar or USB-C.', img: 'hardware/wireless-node-2026', widths: [320, 600, 880] },
  { to: '/phenode/base-station', name: 'Base station', text: 'Runs off-grid on a 10 W solar panel, takes third-party sensors over SDI-12 and RS-485, and can cover 500+ acres with its nodes.', img: 'hardware/base-station-v4', widths: [600, 1000, 1600] },
  { to: '/phenode/data-platform', name: 'Data platform', text: 'Overlay one measurement across many nodes or two on one timeline, then download just the date range and nodes you need.', img: null },
  { to: '/phenode/software', name: 'Software', text: 'Adjust deployed hardware without a site visit, check each rain gauge against the official gauges nearby, and use it on a phone.', img: null },
]

export default function PheNodeOverview() {
  const [ref, progress] = useScrollProgress({ start: 'top 70%', end: 'bottom 60%' })
  const reveal = useReveal()
  return (
    <Page title="PheNode overview" description="PheNode: wireless sensor nodes, a solar-powered base station, a data platform and software — one configurable environmental monitoring system.">
      <OverviewHero />

      <Section theme="paper">
        <Container>
          <div ref={reveal} className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Eyebrow className="reveal">What PheNode is</Eyebrow>
              <h2 className="display-lg reveal mt-5 max-w-[14ch]">A platform, not a product.</h2>
              <p className="lede reveal mt-6 max-w-[44ch]">PheNode is a flexible, scalable environmental monitoring platform that can be tailored to the needs of the user. The same system runs in a growth chamber, a greenhouse, a research field, along a highway, or across a city.</p>
              <ul className="reveal mt-8 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                {PARTS.map((p) => (
                  <li key={p.to}><Link to={p.to} className="group flex items-center justify-between gap-4 py-4"><span><span className="block text-[17px] font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{p.name}</span><span className="block text-[14px] text-ink/70">{p.text}</span></span><ArrowRight size={16} className="shrink-0 opacity-60" /></Link></li>
                ))}
              </ul>
            </div>
            {/* labelled as the path, in order, so it doesn't read as a second list of the parts */}
            <div ref={ref} className="lg:col-span-7"><p className="eyebrow">From measurement to decision</p><SystemChain progress={progress} /></div>
          </div>
        </Container>
      </Section>

      <Section id="specifications" theme="ink">
        <Container>
          <Eyebrow>Technical capabilities</Eyebrow>
          <h2 className="display-lg mt-5 max-w-[16ch]">Numbers from the spec sheet. Nothing else.</h2>
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {HEADLINE_NUMBERS.map((n) => <Stat key={n.label} value={n.value} label={n.label} note={n.note} />)}
          </div>
          <div className="mt-12 flex flex-wrap gap-3"><Button to="/phenode/wireless-node#specs" variant="primary">Node specifications</Button><Button to="/phenode/base-station#specs" variant="ghost">Base station specifications</Button></div>
        </Container>
      </Section>

      <Section theme="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>System architecture</Eyebrow>
              <h2 className="display-md mt-4 max-w-[14ch]">From sensor to dataset.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/75">The complete stack, for technically sophisticated visitors. Expand it for the second layer of detail.</p>
            </div>
            <div className="lg:col-span-8"><ArchitectureDiagram /></div>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
