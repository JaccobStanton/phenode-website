import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Eyebrow, Section, Container, Button, ButtonPair, Img } from '../../components/ui/primitives.jsx'
import SystemChain from '../../components/viz/SystemChain.jsx'
import { useScrollProgress, useReveal } from '../../lib/motion.js'
import { homeNo } from '../../data/homeSections.js'

// The four parts are the way into the product pages; the system chain below tells the story in order. So each card
// says something the chain doesn't (how it's built, what it costs to run, what you take away, what you see), every
// fact from specs.js, and links to the page that goes deeper. (Jake + PM, Nov 13: keep the cards, don't repeat the chain.)
// Wording from Jake's boss (Nov 16): "two agnostic sensor ports", "aluminum-framed base station", "We keep your data
// safe, even if your subscription expires." (no two-year figure), "track rainfall against local references".
const PARTS = [
  { title: 'Hardware', to: '/phenode', text: 'Solar-charged nodes with two agnostic sensor ports, and an aluminum-framed base station that mounts on a post, pole, tripod or tower.' },
  { title: 'Communications', to: '/phenode/base-station', text: 'Nodes report hourly to the nearest PheNode over LoRaWAN. Cellular and cloud fees are covered by the subscription.' },
  { title: 'Data', to: '/phenode/data-platform', text: 'Download .csv datasets or connect your own tools. We keep your data safe, even if your subscription expires.' },
  { title: 'Software', to: '/phenode/software', text: 'See every node on a map and the site in daily images, track rainfall against local references, and add sub-accounts for your team.' },
]

/**
 * 02 — What is PheNode.
 * Desktop: the PheNode elevation is sized to the viewport and pinned on the right, so it is always fully visible.
 * The copy sits on the left; once you scroll past it, the animated system chain arrives directly under the buttons.
 * Phones/tablets: copy → elevation (500–560 px tall) → chain, in order.
 */
export default function WhatIsPheNode() {
  const [chainRef, progress] = useScrollProgress({ start: 'top 85%', end: 'bottom 70%' })
  const reveal = useReveal()
  return (
    <Section id="what-is-phenode" theme="paper">
      <Container>
        <div ref={reveal} className="grid gap-14 [--elev-h:min(calc(100vh-8rem),1060px)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
          {/* Left: copy, then the system chain */}
          <div className="contents lg:flex lg:flex-col">
            <div className="order-1 lg:min-h-[var(--elev-h)]">
              <div className="lg:sticky lg:top-28">
                <Eyebrow index={homeNo('what-is')} className="reveal">What is PheNode?</Eyebrow>
                <h2 className="display-lg reveal mt-5 max-w-[14ch]"><span className="block whitespace-nowrap">One system.</span> Built around your environment.</h2>
                {/* Jake's PM (Nov 16): the old text repeated the hero's lede (01). Jake chose this one ("low upkeep") */}
                <p className="lede reveal mt-6 max-w-[46ch]">Once it’s installed, PheNode keeps working on its own: solar power, automatic uploads and remote diagnostics mean fewer trips to the field and more time with your data.</p>
                <ul className="reveal mt-10 -mx-3 grid border-t hairline pt-3 sm:grid-cols-2" aria-label="What PheNode includes">
                  {PARTS.map((p) => <li key={p.title} className="flex"><PartCard {...p} /></li>)}
                </ul>
                <ButtonPair className="reveal mt-10">
                  <Button to="/phenode" variant="primary-ink">Explore the system</Button>
                  <Button to="/phenode/data-platform" variant="ghost-ink">How it works</Button>
                </ButtonPair>
              </div>
            </div>
            {/* lg: the copy block is as tall as the elevation, so the chain arrives once the whole image is on screen */}
            <div ref={chainRef} className="order-3 lg:mt-20">
              {/* names the chain's job (the path, in order) so it doesn't read as a second list of the parts above */}
              <p className="eyebrow">From measurement to decision</p>
              <SystemChain progress={progress} />
            </div>
          </div>

          {/* Right: the elevation, sized to fit the viewport and pinned, so it is always fully in view (top included) */}
          <div className="relative order-2 lg:order-none">
            <div className="lg:sticky lg:top-24">
              <Img
                name="hardware/base-station-pole-2026" widths={[460, 910]} sizes="(min-width:1024px) 440px, 240px"
                alt="PheNode base station on its three-section aluminum mast and tripod: rain gauge, solar panel, wind sensor, radiation shield, control box and imager at the top of the pole."
                className="mx-auto block h-[500px] w-auto max-w-full drop-shadow-[0_30px_40px_rgba(14,16,18,0.18)] sm:h-[540px] md:h-[560px] lg:h-[var(--elev-h)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/** One of the four system parts. Title in ink; on hover/focus it turns Agrela blue and an arrow slides in. */
function PartCard({ title, text, to }) {
  // Hover is compositor-friendly: the tint and arrow animate opacity/transform only; the title colour switches
  // instantly. Nothing here needs a repaint per frame, so it stays smooth even when the page is busy.
  const inner = (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg bg-ink/[0.045] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="relative flex items-center gap-1.5 text-[17px] font-semibold tracking-tight text-ink group-hover:text-phenode-blue group-focus-visible:text-phenode-blue">
        {title}
        {/* touch screens can't hover, so there the arrow shows faintly to say the card is a link */}
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" className={`-translate-x-1 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${to ? '[@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-50' : ''}`} />
      </span>
      <span className="relative mt-1 block text-[15px] leading-relaxed text-ink/75">{text}</span>
    </>
  )
  // Cells fill the whole grid area (no gaps), so the pointer moves from card to card without dropping hover in between.
  const cls = 'group relative block w-full rounded-lg px-3 py-3.5'
  return to ? <Link to={to} className={cls}>{inner}</Link> : <div className={`${cls} cursor-default`}>{inner}</div>
}
