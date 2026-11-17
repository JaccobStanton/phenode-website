import { Eyebrow, Section, Container, Button, Tag } from '../../components/ui/primitives.jsx'
import DeviceFrame from '../../components/software/DeviceFrame.jsx'
import { LoopVideo } from '../../components/media/media.jsx'
import DataPulse from '../../components/viz/DataPulse.jsx'
import { NodeGlyph } from '../../components/viz/scenes.jsx'
import { useReveal, seg, easeOut, lerp } from '../../lib/motion.js'
import { useScrollProgress } from '../../lib/scroll.js'
import { homeNo } from '../../data/homeSections.js'

export default function Software() {
  const [ref, p] = useScrollProgress({ start: 'top 70%', end: 'bottom 70%' })
  const reveal = useReveal()
  const scale = lerp(0.86, 1, easeOut(seg(p, 0.1, 0.6)))

  return (
    <Section id="software" theme="ink" className="overflow-hidden border-t border-white/10">
      <Container>
        <div ref={reveal}>
          <Eyebrow index={homeNo('software')} className="reveal">Software</Eyebrow>
          <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 className="display-lg reveal max-w-[14ch] lg:col-span-7">The hardware is configurable. The software is too.</h2>
            <p className="lede reveal max-w-[44ch] lg:col-span-5">One browser-based platform for the whole fleet: status, wireless networks, measurements, imaging, downloads, remote control — and an API underneath all of it.</p>
          </div>
        </div>

        {/* Field → screen */}
        <div ref={ref} className="relative mt-16">
          <div className="grid items-center gap-8 lg:grid-cols-[120px_1fr]">
            <div className="relative hidden h-[140px] lg:block" aria-hidden="true">
              <svg viewBox="0 0 120 140" className="absolute inset-0 h-full w-full overflow-visible text-paper/40">
                <NodeGlyph x={30} y={70} s={1.6} />
                <DataPulse d="M46 70 C 80 70, 100 70, 140 70" color="var(--color-signal)" toColor="var(--color-data)" dur={2.6} r={3} pathOpacity={0.3} />
                <DataPulse d="M46 70 C 80 70, 100 70, 140 70" color="var(--color-signal)" toColor="var(--color-data)" dur={2.6} delay={1.3} r={3} showPath={false} />
              </svg>
              <p className="absolute -bottom-6 left-0 font-mono text-[10px] tracking-[0.14em] uppercase text-stone">Field</p>
            </div>
            <div className="origin-center will-change-transform" style={{ transform: `scale(${scale})`, transition: 'transform 0.2s linear' }}>
              <DeviceFrame kind="monitor" aspect="8 / 5">
                <LoopVideo name="software-tour-1920" poster="software-tour-poster.webp" label="Recording of the PheNode software: the fleet overview, then a base station's live readings scrolling down to seven days of charts, the wireless sensors on a satellite map, and the latest image from a site." />
              </DeviceFrame>
            </div>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2"><Tag tone="data">PheNode software</Tag><span className="font-mono text-[11px] tracking-[0.1em] text-stone">Fleet · base station · wireless network · imaging</span></p>
          {/* the way to the PheNode page's Software part, right under the recording (the screenshots, Precipitation,
              capabilities and modules that followed were hidden on Nov 16 and deleted on Nov 17, Jake) */}
          <div className="mt-8"><Button to="/phenode#software" variant="primary">Explore the software</Button></div>
        </div>

      </Container>
    </Section>
  )
}
