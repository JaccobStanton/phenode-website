import { Section, Container, Button } from '../../components/ui/primitives.jsx'
import SystemPair from '../../components/hardware/SystemPair.jsx'
import { usePersonalization } from '../../context/PersonalizationContext.jsx'
import { useReveal } from '../../lib/motion.js'
import { FEATURES } from '../../data/features.js'

export default function FinalCTA() {
  const { primaryCta } = usePersonalization()
  // fades in a little later than the other sections, once it is well up the screen, so the fade is seen (Jake, Nov 16)
  const reveal = useReveal({ rootMargin: '0px 0px -22% 0px', stagger: 110 })
  return (
    <Section id="final" theme="ink" className="grain overflow-hidden border-t border-white/10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(95,183,201,0.14),transparent_60%)]" />
      <Container>
        <div ref={reveal} className="relative flex flex-col items-center text-center">
          <p className="eyebrow reveal">The complete system</p>
          {/* Jake, Nov 16: this title, no line under it, and one way on: to the PheNode pages */}
          <h2 className="display-xl reveal mt-5 max-w-[14ch]">Built for the environment you need to understand.</h2>
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
            {FEATURES.designSystem && <Button to="/design-your-system" variant="primary">{primaryCta === 'Design your system' ? 'Design your system' : primaryCta}</Button>}
            <Button to="/phenode" variant={FEATURES.designSystem ? 'ghost' : 'primary'}>Let’s get started</Button>
          </div>
          <div className="reveal relative mt-16 w-full max-w-[1100px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,rgba(244,242,236,0.08),transparent_70%)]" />
            {/* the 2026 graphic from the PheNode page hero (Jake, Nov 16; replaced the old system-composite) */}
            <SystemPair className="mx-auto w-full max-w-[1000px]" baseSizes="(min-width:1024px) 70vw, 96vw" nodeSizes="(min-width:1024px) 16vw, 26vw" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
