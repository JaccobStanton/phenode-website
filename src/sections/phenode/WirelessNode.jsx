import { Link } from 'react-router-dom'
import { ScreenCard } from '../../components/media/media.jsx'
import { Container, Section, Eyebrow, Button, Img, Tag } from '../../components/ui/primitives.jsx'
import NodeExplorer from '../../components/hardware/NodeExplorer.jsx'
import SensorAddOns from '../../components/hardware/SensorAddOns.jsx'
import SpecTable from '../../components/ui/SpecTable.jsx'
import { WIRELESS_NODE, ADD_ON_SENSORS } from '../../data/specs.js'
import { FEATURES } from '../../data/features.js'

/**
 * PheNode page, "Wireless sensor node" part (/phenode#wireless-node). Until Nov 16 this was its own page,
 * /phenode/wireless-node; Jake merged the PheNode pages into one scroll page (pages/PheNode.jsx), and the old address
 * now lands here. Like every part it opens on ink under a hairline, with its title as an h2.
 */
export default function WirelessNodePart() {
  const soil = ADD_ON_SENSORS.find((s) => s.id === 'soil-standard')
  return (
    <>
      <section className="theme-ink grain relative overflow-hidden border-t border-white/10 pt-24 pb-16 md:pt-36 md:pb-24 lg:pt-44">
        <Container className="relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow">Wireless sensor node</p>
            {/* headline and lede: Jake, Nov 16 */}
            <h2 className="display-xl mt-4">Install a sensor wherever conditions vary.</h2>
            <p className="lede mt-6 max-w-[46ch]">Battery-operated, solar-powered nodes collect data every 15 minutes and send it back to the nearest PheNode up to 1 km away.</p>
            <div className="mt-8 flex flex-wrap gap-3">{FEATURES.designSystem && <Button to="/design-your-system" variant="primary">Add nodes to a system</Button>}<Link to="/phenode#wireless-node-specs" className={FEATURES.designSystem ? 'btn-ghost' : 'btn-primary'}>Specifications</Link></div>
          </div>
          <div className="relative lg:col-span-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,rgba(244,242,236,0.08),transparent_70%)]" />
            <Img name="hardware/wireless-node-2026" widths={[320, 600, 880]} sizes="(min-width:1024px) 40vw, 80vw" width={880} height={930} alt="Agrela wireless sensor node" className="relative mx-auto h-auto w-full max-w-[520px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" />
          </div>
        </Container>
      </section>

      <Section theme="ink" className="!pt-0">
        <Container>
          <NodeExplorer />
        </Container>
      </Section>

      <Section theme="paper">
        <Container>
          {/* the four big numbers that opened this section (1 km, 2 ports, 1 h, −40 °C) were removed: Jake, Nov 16 */}
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>What's included</Eyebrow>
              <ul className="mt-5 flex flex-col divide-y divide-ink/10 border-y border-ink/10 text-[15px]">
                {WIRELESS_NODE.includes.map((i) => <li key={i} className="py-3">{i}</li>)}
              </ul>
              <p className="mt-5 text-[14px] leading-relaxed text-ink/70">Core measurements: {WIRELESS_NODE.coreMeasurements.join(', ')}. Add-on measurements through the sensor ports: {WIRELESS_NODE.addOnMeasurements.join(', ')}.</p>
            </div>
            <div id="wireless-node-specs" className="scroll-mt-28 lg:col-span-7">
              <SpecTable title="Wireless sensor specifications" rows={WIRELESS_NODE.sensorSpecs} />
              <SpecTable title="Add-on soil probes" rows={soil.specs} className="mt-10" />
              {FEATURES.buyersGuide && <p className="mt-4 font-mono text-[10.5px] tracking-[0.1em] text-stone-2">Source: PheNode Summer 2025 Buyer's Guide.</p>}
            </div>
          </div>
          {/* the add-on sensor cards, moved here from the home page's Hardware section (Jake, Nov 17) */}
          <SensorAddOns className="mt-24 border-t border-ink/10 pt-16" />
        </Container>
      </Section>

      <Section theme="ink">
        <Container>
          {/* "Indoors and out": hidden for now (FEATURES.nodeIndoorsOutdoors) */}
          {FEATURES.nodeIndoorsOutdoors && <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <Eyebrow>Indoors and out</Eyebrow>
              <h3 className="display-md mt-4 max-w-[16ch]">The same node in a growth chamber and a field.</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-paper/75">Track water content, ambient conditions and environmental variability in controlled environments by deploying a wireless sensor network — then move the same nodes outdoors. Battery-operated and solar-powered, with USB-C recharge for up to a growing season without sunlight.</p>
            </div>
            <div className="relative lg:col-span-7">
              <Img name="hardware/wireless-node-with-probes" widths={[400, 680]} sizes="(min-width:1024px) 50vw, 90vw" width={680} height={388} alt="Wireless node with two soil probes attached" className="mx-auto h-auto w-full max-w-[640px] object-contain" />
              <div className="absolute left-0 top-0"><Tag>Two agnostic sensor ports · shown with soil probes</Tag></div>
            </div>
          </div>}
          <div className={FEATURES.nodeIndoorsOutdoors ? 'mt-24 border-t border-white/10 pt-12' : ''}>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6"><Eyebrow>In the software</Eyebrow><h3 className="display-md mt-4 max-w-[18ch]">Every node, on the map and on the chart.</h3></div>
              <p className="max-w-[48ch] text-[15px] leading-relaxed text-paper/75 lg:col-span-6">Each wireless node appears in the PheNode software at its location, with its latest readings, battery and connected probes — and a full measurement history one click away.</p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <ScreenCard id="sensor-map" caption="Wireless nodes on the satellite map, with the PheNode they report to" tone="ink" sizes="(min-width:1024px) 1200px, 92vw" className="md:col-span-2" />
              <ScreenCard id="wireless-fleet-overview" caption="Every node on a PheNode — health, soil, signal, battery" tone="ink" sizes="(min-width:768px) 46vw, 92vw" />
              <ScreenCard id="wireless-sensor-measurements" caption="One node: two soil probes over seven days" tone="ink" sizes="(min-width:768px) 46vw, 92vw" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
