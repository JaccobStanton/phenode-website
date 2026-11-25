import { Link } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import Page from '../components/layout/Page.jsx'
import OverviewHero from '../sections/phenode/OverviewHero.jsx'
import BaseStationPart from '../sections/phenode/BaseStation.jsx'
import WirelessNodePart from '../sections/phenode/WirelessNode.jsx'
import DataPlatformPart from '../sections/phenode/DataPlatform.jsx'
import SoftwarePart from '../sections/phenode/Software.jsx'
import { Container, Section, Eyebrow } from '../components/ui/primitives.jsx'
import SystemChain from '../components/viz/SystemChain.jsx'
import { PHENODE_PARTS } from '../data/navigation.js'
import { useReveal } from '../lib/motion.js'
import { useScrollProgress } from '../lib/scroll.js'

// The PheNode tab is one long page (Jake, Nov 16; it was five pages): the overview, then each part in the order of
// PHENODE_PARTS (data/navigation.js), which the header menu and the footer follow too. Each part sits at /phenode#<id>.
const PART_SECTIONS = { 'base-station': BaseStationPart, 'wireless-node': WirelessNodePart, 'data-platform': DataPlatformPart, software: SoftwarePart }

// The lines under "What PheNode is" lead down to the parts; the system chain beside them tells the story in order. So
// each line says something the chain doesn't (and isn't a copy of the home page's cards either), every fact from
// specs.js or the part it leads to. (Jake + PM, Nov 13 — same fix as home 02.) Wording: Jake, Nov 16. Same order as
// the parts below.
const PARTS = [
  { to: '/phenode#base-station', name: 'Base station', text: 'Runs off-grid with a 10 W solar panel, accepts third-party sensors, and can cover 500+ acres with its nodes.' },
  { to: '/phenode#wireless-node', name: 'Wireless sensor node', text: 'Can measure ambient air, light, and soil parameters. Recharges by solar or USB-C.' },
  { to: '/phenode#data-platform', name: 'Data platform', text: 'Overlay one measurement across many nodes, or two on one timeline, then download only the date range and nodes you need.' },
  { to: '/phenode#software', name: 'Software', text: 'Adjust deployed hardware without a site visit, check each rain gauge against publicly available gauges nearby, and view it all on a smartphone.' },
]

export default function PheNodePage() {
  const [ref, progress] = useScrollProgress({ start: 'top 70%', end: 'bottom 60%' })
  const reveal = useReveal()
  return (
    <Page>
      <OverviewHero />

      <Section theme="paper">
        <Container>
          <div ref={reveal} className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Eyebrow className="reveal">What PheNode is</Eyebrow>
              <h2 className="display-lg reveal mt-5 max-w-[14ch]">A platform, not a station.</h2>
              <p className="lede reveal mt-6 max-w-[44ch]">The same system runs in a growth chamber, a greenhouse, a research field, along a highway, or across a city. Start with one base station and add wireless nodes as your work grows.</p>
              <ul className="reveal mt-8 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                {PARTS.map((p) => (
                  <li key={p.to}><Link to={p.to} className="group flex items-center justify-between gap-4 py-4"><span><span className="block text-[17px] font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{p.name}</span><span className="block text-[14px] text-ink/70">{p.text}</span></span><ArrowDown size={16} className="shrink-0 opacity-60" aria-hidden="true" /></Link></li>
                ))}
              </ul>
            </div>
            {/* labelled as the path, in order, so it doesn't read as a second list of the parts */}
            <div ref={ref} className="lg:col-span-7"><p className="eyebrow">From measurement to decision</p><SystemChain progress={progress} /></div>
          </div>
        </Container>
      </Section>

      {PHENODE_PARTS.map(({ id }) => {
        const Part = PART_SECTIONS[id]
        return <div key={id} id={id}><Part /></div>
      })}
    </Page>
  )
}
