import { Eyebrow, Section, Container, Button, ButtonPair } from '../../components/ui/primitives.jsx'
import DataJourney, { JOURNEY, JourneyList } from '../../components/viz/DataJourney.jsx'
import JourneyStage from '../../components/viz/JourneyStage.jsx'
import { useScrollProgress, seg, easeInOut } from '../../lib/motion.js'

export default function HowItWorks() {
  // Tall wrapper + sticky stage (on screens tall enough to pin): the journey plays as the visitor scrolls ~1.6 screens.
  // Below that it lays out in flow and the same progress follows the visitor down the section.
  const [ref, progress] = useScrollProgress({ start: 'top top', end: 'bottom bottom' })
  const p = easeInOut(seg(progress, 0.02, 0.98))
  const active = Math.round(p * (JOURNEY.length - 1))
  return (
    // Dark blue (Jake's PM, Nov 15): the journey drawings come from the app and were made for its dark navy; it also sets
    // this section apart from the black ones before and after it. theme-ink for the text and the header, theme-midnight for the blue.
    <Section id="how-it-works" theme="ink" className="theme-midnight" padded={false}>
      <div ref={ref} className="relative pin:h-[260vh]">
        <div className="pin:sticky pin:top-0 pin:flex pin:h-screen pin:flex-col pin:justify-center pin:pt-[72px]">
          <Container className="py-24 pin:py-0">
            {/* Title, lede and the next steps on the left; the stop being described, pictured and explained on the right */}
            <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-x-12">
              <div className="md:col-span-7">
                <Eyebrow index="04">How PheNode works</Eyebrow>
                {/* display-lg, also capped by height so the pinned stage fits short laptop screens */}
                <h2 className="display-lg mt-5 max-w-[16ch]" style={{ fontSize: 'clamp(2.25rem, min(5vw, 9.5vh), 4.5rem)' }}>From measurement to meaningful data.</h2>
                <p className="lede mt-[clamp(1rem,2.6vh,1.5rem)] max-w-[44ch]">Environmental readings leave the hardware as a signal and arrive in your workflow as structured datasets, and you maintain control at every step.</p>
                <ButtonPair className="mt-[clamp(1.5rem,3.5vh,2.25rem)]">
                  <Button to="/phenode/data-platform" variant="primary">The data platform</Button>
                  <Button to="/phenode/software" variant="ghost">The software</Button>
                </ButtonPair>
              </div>
              <JourneyStage active={active} className="hidden md:col-span-5 md:block" />
            </div>

            <div className="mt-[clamp(1.5rem,5vh,3.5rem)] hidden text-paper md:block"><DataJourney progress={progress} crop /></div>
            <div className="mt-10 text-paper md:hidden"><JourneyList progress={progress} art /></div>
          </Container>
        </div>
      </div>
    </Section>
  )
}
