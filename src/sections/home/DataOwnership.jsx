import { Eyebrow, Section, Container, Button } from '../../components/ui/primitives.jsx'
import { SOFTWARE } from '../../data/specs.js'
import { useReveal } from '../../lib/motion.js'
import { homeNo } from '../../data/homeSections.js'

const LANES = [
  {
    id: 'typical', title: 'For every user', tone: 'text-signal', items: [
      ['Dashboards', 'Fleet status, wireless networks, measurements, imaging'],
      ['Downloads', '.csv datasets for every device and node'],
      ['Data cleaning options', 'Your preferences for gaps and outliers, applied on export'],
      ['Sub-accounts', 'Employees, partners, public demonstrations'],
    ],
  },
  {
    id: 'advanced', title: 'For power users', tone: 'text-data', items: [
      ['API', 'Structured data into your notebooks, pipelines and tools'],
      ['Structured data', 'Consistent columns across devices, nodes and sites'],
      ['Dockerized backend', 'A portable backend where self-managed data flow is required'],
      ['Custom workflows', 'Scoped with Agrela around your analysis'],
    ],
  },
]

export default function DataOwnership() {
  const reveal = useReveal()
  return (
    <Section id="your-data" theme="paper">
      <Container>
        <div ref={reveal} className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index={homeNo('data-ownership')} className="reveal">Data ownership</Eyebrow>
            <h2 className="display-lg reveal mt-5 max-w-[12ch]">Your measurements. Your workflow.</h2>
            <p className="lede reveal mt-6 max-w-[44ch]">PheNode supports different levels of interaction with the same data. Start with dashboards and downloads; move to the API and a portable backend when the analysis demands it. Nothing about the data changes along the way.</p>
            <ul className="reveal mt-8 flex flex-col gap-2 border-t hairline pt-6 text-[14.5px] text-ink/80">
              {SOFTWARE.dataPlan.map((d) => <li key={d} className="flex gap-3"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-data" aria-hidden="true" />{d}</li>)}
            </ul>
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Button to="/phenode/data-platform" variant="primary-ink">The data platform</Button>
              <Button to="/support" variant="ghost-ink">Documentation</Button>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:col-span-7">
            {LANES.map((lane) => (
              <div key={lane.id} className="reveal bg-phenode-white p-7 md:p-8">
                <p className={`font-mono text-[11px] tracking-[0.16em] uppercase ${lane.tone}`}>{lane.title}</p>
                <ol className="mt-5 flex flex-col divide-y divide-ink/10">
                  {lane.items.map(([k, v], i) => (
                    <li key={k} className="py-4">
                      <p className="flex items-baseline gap-3 text-[17px] font-semibold tracking-tight"><span className="font-mono text-[11px] font-normal text-stone-2">{String(i + 1).padStart(2, '0')}</span>{k}</p>
                      <p className="mt-1 pl-8 text-[14px] leading-relaxed text-ink/70">{v}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
