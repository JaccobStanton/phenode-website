import Page from '../../components/layout/Page.jsx'
import { ScreenCard } from '../../components/media/media.jsx'
import { Container, Section, Eyebrow, Button, Img, Stat, Tag } from '../../components/ui/primitives.jsx'
import NodeExplorer from '../../components/hardware/NodeExplorer.jsx'
import SpecTable from '../../components/ui/SpecTable.jsx'
import { WIRELESS_NODE, ADD_ON_SENSORS } from '../../data/specs.js'
import { FEATURES } from '../../data/features.js'

export default function WirelessNodePage() {
  const soil = ADD_ON_SENSORS.find((s) => s.id === 'soil-standard')
  return (
    <Page title="Wireless sensor node" description="Agrela wireless sensor: solar-powered, LoRaWAN, up to 1 km from a PheNode base station, with two agnostic sensor ports.">
      <section className="theme-ink grain relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24">
        <Container className="relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow">Wireless sensor node</p>
            <h1 className="display-xl mt-4">Carry the sensors to where conditions vary.</h1>
            <p className="lede mt-6 max-w-[46ch]">{WIRELESS_NODE.tagline} Hourly measurements over LoRaWAN, up to 1 km from the base station.</p>
            <div className="mt-8 flex flex-wrap gap-3">{FEATURES.designSystem && <Button to="/design-your-system" variant="primary">Add nodes to a system</Button>}<a href="#specs" className={FEATURES.designSystem ? 'btn-ghost' : 'btn-primary'}>Specifications</a></div>
          </div>
          <div className="relative lg:col-span-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,rgba(244,242,236,0.08),transparent_70%)]" />
            <Img name="hardware/wireless-node-2026" widths={[320, 600, 880]} sizes="(min-width:1024px) 40vw, 80vw" alt="Agrela wireless sensor node" className="relative mx-auto h-auto w-full max-w-[520px] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" loading="eager" />
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
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value="1 km" label="Range" note="Line of sight to a PheNode" />
            <Stat value="2" label="Agnostic sensor ports" note="Soil probes or other sensors" />
            <Stat value="1 h" label="Transmit cadence" note="LoRaWAN to the nearest PheNode" />
            <Stat value="−40 °C" label="Temperature range" note="to 85 °C, ±0.5–1.0 °C" />
          </div>
          <div className="mt-20 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>What's included</Eyebrow>
              <ul className="mt-5 flex flex-col divide-y divide-ink/10 border-y border-ink/10 text-[15px]">
                {WIRELESS_NODE.includes.map((i) => <li key={i} className="py-3">{i}</li>)}
              </ul>
              <p className="mt-5 text-[14px] leading-relaxed text-ink/70">Core measurements: {WIRELESS_NODE.coreMeasurements.join(', ')}. Add-on measurements with soil probes: {WIRELESS_NODE.addOnMeasurements.join(', ')}.</p>
            </div>
            <div id="specs" className="lg:col-span-7">
              <SpecTable title="Wireless sensor specifications" rows={WIRELESS_NODE.sensorSpecs} />
              <SpecTable title="Add-on soil probes" rows={soil.specs} className="mt-10" />
              {FEATURES.buyersGuide && <p className="mt-4 font-mono text-[10.5px] tracking-[0.1em] text-stone-2">Source: PheNode Summer 2025 Buyer's Guide.</p>}
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <Eyebrow>Indoors and out</Eyebrow>
              <h2 className="display-md mt-4 max-w-[16ch]">The same node in a growth chamber and a field.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-paper/75">Track water content, ambient conditions and environmental variability in controlled environments by deploying a wireless sensor network — then move the same nodes outdoors. Battery-operated and solar-powered, with USB-C recharge for up to a growing season without sunlight.</p>
            </div>
            <div className="relative lg:col-span-7">
              <Img name="hardware/wireless-node-with-probes" widths={[400, 680]} sizes="(min-width:1024px) 50vw, 90vw" alt="Wireless node with two soil probes attached" className="mx-auto h-auto w-full max-w-[640px] object-contain" />
              <div className="absolute left-0 top-0"><Tag>Two agnostic sensor ports · shown with soil probes</Tag></div>
            </div>
          </div>
          <div className="mt-24 border-t border-white/10 pt-12">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6"><Eyebrow>In the software</Eyebrow><h2 className="display-md mt-4 max-w-[18ch]">Every node, on the map and on the chart.</h2></div>
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
    </Page>
  )
}
