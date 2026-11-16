import { Section, Container, Button, Img } from '../../components/ui/primitives.jsx'
import { usePersonalization } from '../../context/PersonalizationContext.jsx'
import { useReveal } from '../../lib/motion.js'
import { FEATURES } from '../../data/features.js'

export default function FinalCTA() {
  const { primaryCta } = usePersonalization()
  const reveal = useReveal()
  return (
    <Section id="final" theme="ink" className="grain overflow-hidden border-t border-white/10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(95,183,201,0.14),transparent_60%)]" />
      <Container>
        <div ref={reveal} className="relative flex flex-col items-center text-center">
          <p className="eyebrow reveal">The complete system</p>
          <h2 className="display-xl reveal mt-5 max-w-[14ch]">Build around the environment you need to understand.</h2>
          <p className="lede reveal mt-6 max-w-[52ch]">Base station, wireless nodes, sensors, software. Configure the hardware. Configure the software. Configure the science.</p>
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
            {FEATURES.designSystem && <Button to="/design-your-system" variant="primary">{primaryCta === 'Design your system' ? 'Design your system' : primaryCta}</Button>}
            <Button to="/contact" variant={FEATURES.designSystem ? 'ghost' : 'primary'}>Talk to Agrela</Button>
          </div>
          <div className="reveal relative mt-16 w-full max-w-[1100px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,rgba(244,242,236,0.08),transparent_70%)]" />
            <Img name="hardware/system-composite" widths={[600, 1000, 1600, 2400]} sizes="(min-width:1024px) 76vw, 96vw" alt="The complete PheNode system: a wireless sensor node beside the base station with its sensor frame, imager, control box and soil probe." className="relative h-auto w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
