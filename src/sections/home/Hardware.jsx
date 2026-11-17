import { Eyebrow, Section, Container, Button } from '../../components/ui/primitives.jsx'
import NodeExplorer from '../../components/hardware/NodeExplorer.jsx'
import BaseStationExplorer from '../../components/hardware/BaseStationExplorer.jsx'
import { useReveal } from '../../lib/motion.js'
import { homeNo } from '../../data/homeSections.js'

export default function Hardware() {
  const reveal = useReveal()
  return (
    <>
      {/* Node explorer on ink (studio dark) */}
      <Section id="hardware" theme="ink" className="border-t border-white/10">
        <Container>
          <div ref={reveal}>
            <Eyebrow index={homeNo('hardware')} className="reveal">Hardware</Eyebrow>
            <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="display-lg reveal max-w-[16ch] lg:col-span-7">The system adapts to the experiment — not the other way around.</h2>
              <p className="lede reveal max-w-[44ch] lg:col-span-5">Two pieces of hardware, one open sensor interface. You decide what each node carries, where it sits, and how many you need.</p>
            </div>
            <div className="reveal mt-14">
              <NodeExplorer />
            </div>
          </div>
        </Container>
      </Section>

      {/* Base station on paper (studio light) */}
      <Section theme="paper" padded={true} className="!pt-20">
        <Container>
          <BaseStationExplorer />
          {/* the "Configurable sensor packages" cards that were here are the PheNode page's "Sensor add-ons" now
              (components/hardware/SensorAddOns.jsx; Jake, Nov 17) */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/phenode#wireless-node-specs" variant="primary-ink">Wireless node specifications</Button>
            <Button to="/phenode#base-station-specs" variant="ghost-ink">Base station specifications</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
