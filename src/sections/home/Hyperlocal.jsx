import { Sprout, Tractor, Route, TreePine, GraduationCap, Building2 } from 'lucide-react'
import { Eyebrow, Section, Container, Button, ButtonPair } from '../../components/ui/primitives.jsx'
import HyperlocalMap from '../../components/viz/HyperlocalMap.jsx'
import { useScrollProgress, useReveal } from '../../lib/motion.js'
import { homeNo } from '../../data/homeSections.js'

const FACTORS = ['Soil type', 'Slope', 'Canopy', 'Irrigation', 'Pavement', 'Shade']
const PLACES = [
  [Sprout, 'Research field'], [Tractor, 'Production area'], [Route, 'Transportation corridor'],
  [TreePine, 'Restoration site'], [GraduationCap, 'Campus'], [Building2, 'City'],
]

export default function Hyperlocal() {
  const [ref, progress] = useScrollProgress({ start: 'top 85%', end: 'top 35%' })
  const reveal = useReveal()
  return (
    <Section id="hyperlocal" theme="ink" className="overflow-hidden">
      <Container>
       <div ref={reveal}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-5">
            <Eyebrow index={homeNo('hyperlocal')} className="reveal">Hyperlocal environmental intelligence</Eyebrow>
            <h2 className="hyperlocal-title reveal mt-5 [text-wrap:balance]">One measurement point can’t describe an entire landscape.</h2>
            {/* The problem, in one line */}
            <p className="lede reveal mt-6">Traditional monitoring often relies on one station to represent a much larger area.</p>

            {/* The reality: a short statement + what drives the difference */}
            <div className="reveal mt-8 border-l-2 border-signal pl-5">
              <p className="text-[19px] font-medium leading-snug tracking-tight text-paper md:text-[21px]">But conditions change by the block, the field, and the meter.</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="What makes conditions vary">
                {FACTORS.map((f) => <li key={f} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[12.5px] text-paper/75">{f}</li>)}
              </ul>
            </div>

            {/* What PheNode is for */}
            <div className="reveal mt-8">
              <p className="text-[15px] leading-relaxed text-paper/70">Regional weather data gives you the big picture. <span className="font-semibold text-paper">PheNode is built for hyperlocal measurements</span> — a network of monitoring locations across a:</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-[repeat(3,auto)] sm:justify-start sm:gap-x-7 lg:grid-cols-2 xl:grid-cols-[repeat(3,auto)]" aria-label="Where PheNode networks run">
                {PLACES.map(([Icon, label]) => (
                  <li key={label} className="flex items-center gap-2 text-[14px] text-paper/85 sm:whitespace-nowrap">
                    <Icon size={16} strokeWidth={1.6} className="shrink-0 text-data" aria-hidden="true" />{label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* the map is held to ~85% of its column so it doesn't dominate the screen; flush with the container's right edge on desktop */}
          <div ref={ref} className="w-full max-w-[640px] lg:col-span-7 lg:ml-auto lg:w-[86%] lg:max-w-[660px]">
            <HyperlocalMap progress={progress} />
          </div>
        </div>

        <div className="reveal relative mt-12">
          {/* soft PheNode-blue glow, gently pulsing (opacity only, so it runs on the compositor) */}
          <span aria-hidden="true" className="glow-pulse pointer-events-none absolute inset-0 rounded-lg shadow-[0_10px_24px_-14px_rgba(26,117,224,0.6),0_0_18px_-6px_rgba(26,117,224,0.3)]" />
          <div className="relative grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2">
          <div className="bg-ink p-7 md:p-9">
            <p className="eyebrow">Traditional</p>
            <p className="mt-3 text-[28px] font-semibold tracking-tight">1 station</p>
            <p className="mt-1 font-mono text-[12px] tracking-[0.12em] uppercase text-stone">→ 1 generalized measurement</p>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-paper/70">Good for regional context. Not built to see the difference between two plots, two slopes or two blocks.</p>
          </div>
          <div className="bg-ink-2 p-7 md:p-9">
            <p className="eyebrow text-data">PheNode</p>
            <p className="mt-3 text-[28px] font-semibold tracking-tight">Distributed nodes</p>
            <p className="mt-1 font-mono text-[12px] tracking-[0.12em] uppercase text-data">→ hyperlocal environmental understanding</p>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-paper/70">Measurements where conditions actually vary, in one dataset, from a single base station to a regional network.</p>
          </div>
          </div>
        </div>
        <ButtonPair className="reveal mt-8">
          <Button to="/applications" variant="primary">See it in your environment</Button>
          <Button to="/phenode/wireless-node" variant="ghost">The wireless node</Button>
        </ButtonPair>
       </div>
      </Container>
    </Section>
  )
}
