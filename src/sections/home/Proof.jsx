import { Eyebrow, Section, Container, Button } from '../../components/ui/primitives.jsx'
import { COMPANY } from '../../data/company.js'
import { useReveal, useCountUp } from '../../lib/motion.js'
import { homeNo } from '../../data/homeSections.js'

function BigNumber({ value, suffix = '', label, note }) {
  const numeric = typeof value === 'number'
  const [ref, v] = useCountUp(numeric ? value : 0, { enabled: numeric })
  return (
    <div ref={ref} className="border-t border-white/10 pt-5">
      <p className="stat-xl !text-[clamp(2.75rem,5.5vw,5rem)]">{numeric ? Math.round(v) : value}{suffix}</p>
      <p className="mt-2 font-mono text-[11px] tracking-[0.16em] uppercase text-paper/80">{label}</p>
      {note && <p className="mt-1 text-[13.5px] text-stone">{note}</p>}
    </div>
  )
}

export default function Proof() {
  const reveal = useReveal()
  return (
    <Section id="proof" theme="ink" className="border-t border-white/10">
      <Container>
        <div ref={reveal}>
          <ol className="reveal flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.18em] uppercase text-stone" aria-label="From hardware to customers">
            {['Real hardware', 'Real deployments', 'Real data', 'Real customers'].map((s, i, a) => <li key={s} className="flex items-center gap-4"><span className={i === a.length - 1 ? 'text-paper' : ''}>{s}</span>{i < a.length - 1 && <span aria-hidden="true" className="opacity-40">→</span>}</li>)}
          </ol>
          <Eyebrow index={homeNo('proof')} className="reveal mt-10">Customer proof</Eyebrow>
          <div className="mt-5 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg reveal max-w-[12ch]">Built with the people who use it.</h2>
              <p className="lede reveal mt-6 max-w-[42ch]">PheNode was designed by researchers who needed scalable, customizable environmental data collection. It grew through long-term partnerships — in research fields, along interstates, and in the controlled environments in between.</p>
              <figure className="reveal mt-8 border-l-2 border-data pl-5">
                <blockquote className="text-[18px] leading-relaxed text-paper/90">"{COMPANY.founderQuote.text}"</blockquote>
                <figcaption className="mt-3 font-mono text-[11px] tracking-[0.1em] text-stone">{COMPANY.founderQuote.name} · {COMPANY.founderQuote.title} · <span className="opacity-80">{COMPANY.founderQuote.source}</span></figcaption>
              </figure>
            </div>
            <div className="lg:col-span-7">
              {/* No customer-retention figure, not even a placeholder: Jake's PM doesn't want it public (Nov 16) */}
              <div className="reveal grid gap-8 sm:grid-cols-3">
                <BigNumber value={COMPANY.founded} label="Founded" note="At the Donald Danforth Plant Science Center, St. Louis" />
                <BigNumber value={COMPANY.commercialSince} label="Commercially available since" note="After seven years of research deployments" />
                <BigNumber value={COMPANY.publicPartners.length} label="Publicly announced partners" note="Transportation agencies and research institutions" />
              </div>
              <ul className="reveal mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2" aria-label="Public partners">
                {COMPANY.publicPartners.map((p) => (
                  <li key={p.name} className="bg-ink p-5"><p className="text-[15px] font-medium text-paper">{p.name}</p><p className="mt-1 text-[13.5px] text-stone">{p.detail}</p></li>
                ))}
              </ul>
              <p className="reveal mt-3 font-mono text-[10.5px] tracking-[0.1em] text-stone">Sources: Danforth Plant Science Center (2026), The Ray. Customer locations are never shown without permission.</p>
            </div>
          </div>
          <div className="reveal mt-10 flex flex-wrap gap-3">
            <Button to="/case-studies" variant="primary">View case studies</Button>
            <Button to="/company" variant="ghost">About Agrela</Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
