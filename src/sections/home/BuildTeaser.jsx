import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Eyebrow, Section, Container, Button, Tag } from '../../components/ui/primitives.jsx'
import ExplorerScene from '../../components/viz/ExplorerScene.jsx'
import { useReveal } from '../../lib/motion.js'
import { homeNo } from '../../data/homeSections.js'

const STEPS = ['Application', 'Scale', 'Base station', 'Wireless nodes', 'Configure nodes', 'Software', 'Your system']

export default function BuildTeaser() {
  const [nodes, setNodes] = useState(10)
  const reveal = useReveal()
  const soil = nodes * 2
  return (
    <Section id="build" theme="paper" className="border-t border-ink/10">
      <Container>
        <div ref={reveal} className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <Eyebrow index={homeNo('build')} className="reveal">Build your PheNode</Eyebrow>
            <h2 className="display-lg reveal mt-5 max-w-[14ch]">Build the monitoring system your project needs.</h2>
            <p className="lede reveal mt-6 max-w-[44ch]">Choose the application and the scale, add a base station, set the number of nodes, attach sensors, pick software. Then send the configuration to Agrela to talk it through.</p>
            <ol className="reveal mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.14em] uppercase text-stone-2" aria-label="Configurator steps">
              {STEPS.map((s, i) => <li key={s}><span className="text-ink">{String(i + 1).padStart(2, '0')}</span> {s}</li>)}
            </ol>
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Button to="/design-your-system" variant="primary-ink">Design your system</Button>
              <Button to="/design-your-system?mode=guided" variant="ghost-ink">I'd rather answer questions</Button>
            </div>
          </div>
          <div className="reveal lg:col-span-7">
            <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-ink text-paper">
              <ExplorerScene kind="field" count={nodes} heat={0.5} className="text-paper" seed={9} />
              <div className="absolute left-4 top-4 flex gap-2"><Tag>Preview</Tag></div>
              <div className="flex flex-col gap-4 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Fewer nodes" onClick={() => setNodes((n) => Math.max(1, n - (n > 10 ? 5 : 1)))} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:border-white/50"><Minus size={16} /></button>
                  <div className="w-[120px] text-center"><p className="text-[28px] font-semibold leading-none tracking-tight">{nodes}</p><p className="font-mono text-[10px] tracking-[0.16em] uppercase text-stone">wireless nodes</p></div>
                  <button type="button" aria-label="More nodes" onClick={() => setNodes((n) => Math.min(50, n + (n >= 10 ? 5 : 1)))} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:border-white/50"><Plus size={16} /></button>
                </div>
                <dl className="grid grid-cols-3 gap-4 font-mono text-[11px] tracking-[0.1em] uppercase text-stone">
                  <div><dt>Base station</dt><dd className="text-[18px] font-sans font-semibold tracking-tight text-paper">1</dd></div>
                  <div><dt>Soil sensors</dt><dd className="text-[18px] font-sans font-semibold tracking-tight text-paper">{soil}</dd></div>
                  <div><dt>Air / light</dt><dd className="text-[18px] font-sans font-semibold tracking-tight text-paper">{nodes}</dd></div>
                </dl>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-stone-2">Preview assumes two soil probes per node. Adjust everything on the full configurator.</p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
