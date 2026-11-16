import Page from '../../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button, Img, Stat } from '../../components/ui/primitives.jsx'
import BaseStationExplorer from '../../components/hardware/BaseStationExplorer.jsx'
import SpecTable from '../../components/ui/SpecTable.jsx'
import ExplorerScene from '../../components/viz/ExplorerScene.jsx'
import { BASE_STATION, ADD_ON_SENSORS } from '../../data/specs.js'
import { ScreenCard, LoopVideo } from '../../components/media/media.jsx'
import DeviceFrame from '../../components/software/DeviceFrame.jsx'
import { FEATURES } from '../../data/features.js'

export default function BaseStationPage() {
  return (
    <Page title="Base station" description="The PheNode base station: control box, aluminum sensor frame, standard sensor suite, 5 MP imager, solar power, cellular or Wi-Fi with satellite backup — the hub of every wireless network.">
      <section className="theme-ink grain relative overflow-hidden pt-28 pb-10 md:pt-40">
        <Container className="relative">
          <p className="eyebrow">Base station</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">The hub of the network.</h1>
            <p className="lede lg:col-span-5">{BASE_STATION.tagline} It collects every wireless node, runs its own sensor suite and imager, and connects the deployment to the data platform.</p>
          </div>
          <div className="relative mt-12 grid items-end gap-8 lg:grid-cols-[1fr_280px]">
            <Img name="hardware/base-station-v4" widths={[600, 1000, 1600, 2400]} sizes="(min-width:1024px) 70vw, 96vw" alt="PheNode base station" className="h-auto w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" loading="eager" />
            <div className="hidden lg:block">
              <Img name="hardware/base-station-pole-2026" widths={[460, 910]} sizes="280px" alt="PheNode base station on the 3-section aluminum tower and tripod" className="mx-auto h-auto max-h-[520px] w-auto object-contain" />
              <p className="mt-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase text-stone">Tower configuration</p>
            </div>
          </div>
        </Container>
      </section>

      <Section theme="paper">
        <Container>
          <BaseStationExplorer />
          <div className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value="10 W" label="Solar panel" note="6 V, with USB-C power option" />
            <Stat value="5 MP" label="RGB imager" note="1–4 images per day over cellular" />
            <Stat value="2" label="Sensor buses" note="SDI-12 and RS-485 for custom sensors" />
            <Stat value="500+" label="Acres per PheNode" note="With a fleet of wireless sensors" />
          </div>
        </Container>
      </Section>

      <Section theme="ink" id="specs">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>What's included</Eyebrow>
              <ul className="mt-5 flex flex-col divide-y divide-white/10 border-y border-white/10 text-[15px]">
                {BASE_STATION.includes.map((i) => <li key={i} className="py-3">{i}</li>)}
              </ul>
              <p className="mt-5 text-[14px] leading-relaxed text-paper/70">Core measurements: {BASE_STATION.coreMeasurements.join(', ')}.</p>
              <div className="mt-8 flex flex-wrap gap-3">{FEATURES.designSystem && <Button to="/design-your-system" variant="primary">Design a system</Button>}<Button to="/support" variant={FEATURES.designSystem ? 'ghost' : 'primary'}>Installation guides</Button></div>
            </div>
            <div className="lg:col-span-7">
              <SpecTable title="PheNode sensor specifications" rows={BASE_STATION.sensorSpecs} />
              <SpecTable title="Add-on sensor specifications" rows={ADD_ON_SENSORS.flatMap((s) => s.specs)} className="mt-10" />
              {FEATURES.buyersGuide && <p className="mt-4 font-mono text-[10.5px] tracking-[0.1em] text-stone">Source: PheNode Summer 2025 Buyer's Guide.</p>}
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="paper">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <Eyebrow>Coordinating the network</Eyebrow>
              <h2 className="display-md mt-4 max-w-[16ch]">One base station, hundreds of acres.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/75">A single PheNode stationed strategically can gather data from multiple fields, leaving daily operations unencumbered for most of the season. Add base stations to extend a network along a corridor or across a campus.</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-ink/10 bg-ink lg:col-span-7"><ExplorerScene kind="field" count={16} heat={0.4} className="text-paper" /></div>
          </div>
          <div className="mt-24 border-t border-ink/10 pt-12">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6"><Eyebrow>In the software</Eyebrow><h2 className="display-md mt-4 max-w-[18ch]">What the base station reports.</h2></div>
              <p className="max-w-[48ch] text-[15px] leading-relaxed text-ink/75 lg:col-span-6">Every sensor on the frame is charted over time in the PheNode software, diagnostics show the health of each one, and the imager's captures sit alongside the measurements — so a site can be checked without a visit.</p>
            </div>
            <div className="mt-10">
              <DeviceFrame kind="monitor" aspect="8 / 5">
                <LoopVideo name="base-station-scroll-1920" poster="base-station-scroll-poster.webp" label="Recording of a base station in the PheNode software: current air temperature, rainfall and wind, then scrolling through seven days of charts for every sensor on the frame." />
              </DeviceFrame>
              <p className="mt-4 font-mono text-[11px] tracking-[0.12em] uppercase text-stone-2">Live readings, then seven days of every sensor</p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              <ScreenCard id="system-diagnostics" caption="Diagnostics — signal, battery and every sensor’s status" tone="paper" sizes="(min-width:768px) 46vw, 92vw" />
              <ScreenCard id="imaging" caption="Imager captures, by day" tone="paper" sizes="(min-width:768px) 46vw, 92vw" />
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
