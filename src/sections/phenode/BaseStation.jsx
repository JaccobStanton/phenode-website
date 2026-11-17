import { Container, Section, Eyebrow, Button, Img } from '../../components/ui/primitives.jsx'
import BaseStationExplorer from '../../components/hardware/BaseStationExplorer.jsx'
import SpecTable from '../../components/ui/SpecTable.jsx'
import ExplorerScene from '../../components/viz/ExplorerScene.jsx'
import { BASE_STATION, ADD_ON_SENSORS } from '../../data/specs.js'
import { BASE_STATION_WIDTHS } from '../../data/baseStationParts.js'
import { ScreenCard, LoopVideo } from '../../components/media/media.jsx'
import DeviceFrame from '../../components/software/DeviceFrame.jsx'

/**
 * PheNode page, "Base station" part (/phenode#base-station). Until Nov 16 this was its own page, /phenode/base-station;
 * Jake merged the PheNode pages into one scroll page (pages/PheNode.jsx), and the old address now lands here.
 * Like every part it opens on ink under a hairline, with its title as an h2 (the page's h1 is the hero's).
 */
export default function BaseStationPart() {
  return (
    <>
      <section className="theme-ink grain relative overflow-hidden border-t border-white/10 pt-24 pb-10 md:pt-36 lg:pt-44">
        <Container className="relative">
          <p className="eyebrow">Base station</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h2 className="display-xl lg:col-span-7">The hub of the network.</h2>
            {/* Jake, Nov 16: this sentence alone (it used to open with the base station's tagline) */}
            <p className="lede lg:col-span-5">PheNode collects every wireless node, runs its own sensor suite and imager, and connects the deployment to the data platform.</p>
          </div>
          <div className="relative mt-12 grid items-end gap-8 lg:grid-cols-[1fr_280px]">
            <Img name="hardware/base-station-v4" widths={BASE_STATION_WIDTHS} sizes="(min-width:1024px) 70vw, 96vw" width={2400} height={1625} alt="PheNode base station" className="h-auto w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" />
            <div className="hidden lg:block">
              <Img name="hardware/base-station-pole-2026" widths={[460, 910]} sizes="280px" width={910} height={2015} alt="PheNode base station on the 3-section aluminum tower and tripod" className="mx-auto h-auto max-h-[520px] w-auto object-contain" />
              <p className="mt-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase text-stone">Tower configuration</p>
            </div>
          </div>
        </Container>
      </section>

      <Section theme="paper">
        <Container>
          {/* the four big numbers that followed (10 W, 5 MP, 2 sensor buses, 500+ acres) were removed: Jake's PM, Nov 16 */}
          <BaseStationExplorer />
        </Container>
      </Section>

      <Section theme="ink" id="base-station-specs">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>What's included</Eyebrow>
              <ul className="mt-5 flex flex-col divide-y divide-white/10 border-y border-white/10 text-[15px]">
                {BASE_STATION.includes.map((i) => <li key={i} className="py-3">{i}</li>)}
              </ul>
              <p className="mt-5 text-[14px] leading-relaxed text-paper/70">Core measurements: {BASE_STATION.coreMeasurements.join(', ')}.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Button to="/support" variant="primary">Installation guides</Button></div>
            </div>
            <div className="lg:col-span-7">
              <SpecTable title="PheNode sensor specifications" rows={BASE_STATION.sensorSpecs} />
              <SpecTable title="Add-on sensor specifications" groups={ADD_ON_SENSORS.map((s) => ({ title: s.name, rows: s.specs }))} className="mt-10" />
            </div>
          </div>
        </Container>
      </Section>

      <Section theme="paper">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <Eyebrow>Coordinating the network</Eyebrow>
              <h3 className="display-md mt-4 max-w-[16ch]">One base station, hundreds of acres.</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/75">A single PheNode stationed strategically can gather data from multiple fields, leaving daily operations unencumbered for most of the season. Add base stations to extend a network along a corridor or across a campus.</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-ink/10 bg-ink lg:col-span-7"><ExplorerScene kind="field" count={16} heat={0.4} className="text-paper" /></div>
          </div>
          <div className="mt-24 border-t border-ink/10 pt-12">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-6"><Eyebrow>In the software</Eyebrow><h3 className="display-md mt-4 max-w-[18ch]">What the base station reports.</h3></div>
              <p className="max-w-[48ch] text-[15px] leading-relaxed text-ink/75 lg:col-span-6">All of PheNode’s sensors charted over time, visualized in the dashboard. Diagnostics track PheNode’s health, and the captured images sit alongside the measurements — so a site can be checked without a visit.</p>
            </div>
            <div className="mt-10">
              <DeviceFrame kind="monitor" aspect="8 / 5">
                <LoopVideo name="base-station-scroll-1920" poster="base-station-scroll-poster.webp" label="Recording of a base station in the PheNode software: current air temperature, rainfall and wind, then scrolling through seven days of charts for every sensor on the frame." />
              </DeviceFrame>
              {/* captions: Jake, Nov 16 */}
              <p className="mt-4 font-mono text-[11px] tracking-[0.12em] uppercase text-stone-2">View historical data — from the last hour, or last 5 years</p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              <ScreenCard id="system-diagnostics" caption="Diagnostics — signal, battery and every sensor’s status" tone="paper" sizes="(min-width:768px) 46vw, 92vw" />
              <ScreenCard id="imaging" caption="Check in on remote field sites" tone="paper" sizes="(min-width:768px) 46vw, 92vw" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
