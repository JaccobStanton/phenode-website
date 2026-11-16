import { Eyebrow, Section, Container, Button, Tag } from '../../components/ui/primitives.jsx'
import ScaleNetwork, { STAGES, stageFor } from '../../components/viz/ScaleNetwork.jsx'
import { SceneLegend } from '../../components/viz/scenes.jsx'
import { useScrollProgress, seg, easeInOut } from '../../lib/motion.js'
import { FEATURES } from '../../data/features.js'
import { homeNo } from '../../data/homeSections.js'

export default function Scale() {
  const [ref, raw] = useScrollProgress({ start: 'top top', end: 'bottom bottom' })
  const progress = easeInOut(seg(raw, 0.02, 0.98))
  const st = stageFor(progress)
  return (
    <Section id="scale" theme="ink" padded={false} className="border-t border-white/10">
      <div ref={ref} className="relative lg:h-[300vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pt-16">
          <Container className="py-24 lg:py-0">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <Eyebrow index={homeNo('scale')}>Scale</Eyebrow>
                <h2 className="display-lg mt-5 max-w-[12ch]">From one sensor to an entire network.</h2>
                <p className="lede mt-5 max-w-[38ch]">A single PheNode commands a fleet of wireless sensors across hundreds of acres. Add base stations and the same data system covers a corridor, a campus, a region.</p>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="stat-xl !text-[clamp(3rem,6vw,5.5rem)] text-paper" aria-live="polite">{st.nodes === 50 && st.bases > 1 ? `${st.bases}×` : st.nodes}{st.nodes === 50 && st.bases === 1 ? '+' : ''}</p>
                  <p className="mt-1 font-mono text-[12px] tracking-[0.16em] uppercase text-signal-2">{st.label}</p>
                  <p className="mt-1 text-[14px] text-stone">{st.sub}</p>
                </div>
                <ol className="mt-6 hidden gap-1 lg:flex" aria-hidden="true">
                  {STAGES.map((s) => <li key={s.at} className={`h-1 flex-1 rounded-full ${progress >= s.at ? 'bg-signal' : 'bg-white/15'}`} />)}
                </ol>
                {FEATURES.designSystem && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button to="/design-your-system" variant="primary">Design your system</Button>
                  </div>
                )}
              </div>
              <div className="relative lg:col-span-8">
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-2">
                  <ScaleNetwork progress={progress} />
                  <SceneLegend />
                  <div className="absolute left-4 top-4 flex gap-2"><Tag>Illustrative</Tag></div>
                </div>
                <p className="mt-3 font-mono text-[11px] tracking-[0.12em] uppercase text-stone">Wireless nodes communicate up to 1 km line of sight with a PheNode · hourly via LoRaWAN</p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  )
}
