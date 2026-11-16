import { Eyebrow, Section, Container, Button, Img } from '../../components/ui/primitives.jsx'
import NodeExplorer from '../../components/hardware/NodeExplorer.jsx'
import BaseStationExplorer from '../../components/hardware/BaseStationExplorer.jsx'
import { ADD_ON_SENSORS } from '../../data/specs.js'
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
              <p className="lede reveal max-w-[44ch] lg:col-span-5">Two pieces of hardware, one open sensor interface. Configure what each node carries, where it sits, and how many you need.</p>
            </div>
            <div className="reveal mt-14">
              <NodeExplorer />
            </div>
          </div>
        </Container>
      </Section>

      {/* Base station + sensors on paper (studio light) */}
      <Section theme="paper" padded={true} className="!pt-20">
        <Container>
          <BaseStationExplorer />
          <div className="mt-24 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow">Configurable sensor packages</p>
              <h3 className="display-md mt-3 max-w-[16ch]">Attach what the question needs.</h3>
            </div>
            <p className="max-w-[48ch] text-[15.5px] leading-relaxed text-ink/75 lg:col-span-6">Agrela's soil sensors connect to the base station or to any wireless node (up to two per node). Third-party sensors join through the base station's SDI-12 and RS-485 connectors. Example packages are starting points, not fixed SKUs.</p>
          </div>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 md:grid-cols-3">
            {ADD_ON_SENSORS.map((s) => (
              <li key={s.id} className="flex flex-col bg-phenode-white p-6">
                <div className="flex h-40 items-center justify-center">
                  <Img name={`hardware/${s.image}`} widths={s.image === 'sensor-profile-probe-angle' ? [400, 800, 1400] : [400, 700]} sizes="30vw" alt={s.name} className="max-h-32 w-auto max-w-full object-contain" />
                </div>
                <h4 className="mt-4 text-[18px] font-semibold tracking-tight">{s.name}</h4>
                <p className="mt-1 font-mono text-[11px] tracking-[0.1em] uppercase text-stone-2">{s.measures.join(' · ')}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{s.note}</p>
                <dl className="mt-4 grid gap-1 border-t border-ink/10 pt-3 text-[12.5px]">
                  {s.specs.map((sp) => (
                    <div key={sp.name} className="grid grid-cols-[1fr_auto] gap-3"><dt className="text-stone-2">{sp.name}</dt><dd className="text-right font-mono text-[11.5px] text-ink/85">{sp.range}</dd></div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/phenode/wireless-node" variant="primary-ink">Wireless node specifications</Button>
            <Button to="/phenode/base-station" variant="ghost-ink">Base station specifications</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
