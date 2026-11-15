import Page from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button, AssetPlaceholder } from '../components/ui/primitives.jsx'
import { AgrelaLogo } from '../components/ui/Logos.jsx'
import { COMPANY } from '../data/company.js'

const TIMELINE = [
  ['2016', 'Founded', 'Plant scientists at the Donald Danforth Plant Science Center build the first PheNode to get environmental data from the field alongside their crop data.'],
  ['2023', 'Commercial launch', 'PheNode becomes available to outside institutions after years of research deployments.'],
  ['2025', 'Interstate roadside', 'PheNode is deployed with The Ray and the Georgia Department of Transportation along 18 miles of Interstate 85 — a first for interstate roadside monitoring.'],
  ['2026', 'National expansion', 'Deployment with the Washington State Department of Transportation; a $500,000 round led by QRM Capital and the St. Louis Port Authority supports the move from agricultural research into transportation infrastructure.'],
]

export default function Company() {
  return (
    <Page title="Company" description="Agrela Ecosystems: founded in 2016 at the Donald Danforth Plant Science Center, maker of the PheNode environmental monitoring platform.">
      <section className="theme-paper pt-28 pb-10 md:pt-40">
        <Container>
          <AgrelaLogo tone="dark" height={40} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">Built by researchers who needed the data.</h1>
            <p className="lede lg:col-span-5">{COMPANY.origin}. Agrela makes PheNode — hardware, communications, data and software designed as one environmental intelligence platform.</p>
          </div>
        </Container>
      </section>
      <Section theme="paper" padded={false} className="pb-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>Leadership</Eyebrow>
              <ul className="mt-5 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                {COMPANY.leadership.map((l) => <li key={l.name} className="py-4"><p className="text-[18px] font-semibold tracking-tight">{l.name}</p><p className="text-[14px] text-ink/70">{l.title}</p></li>)}
              </ul>
              <figure className="mt-8 border-l-2 border-data pl-5">
                <blockquote className="text-[18px] leading-relaxed text-ink/85">"{COMPANY.founderQuote.text}"</blockquote>
                <figcaption className="mt-3 font-mono text-[11px] tracking-[0.1em] text-stone-2">{COMPANY.founderQuote.name} · {COMPANY.founderQuote.source}</figcaption>
              </figure>
              <AssetPlaceholder label="Team / lab photography · 1600×1200" ratio="4 / 3" className="mt-8 text-ink/50" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Eyebrow>Timeline</Eyebrow>
              <ol className="mt-5 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                {TIMELINE.map(([y, k, v]) => <li key={y} className="grid grid-cols-[72px_1fr] gap-4 py-5"><span className="font-mono text-[12px] tracking-[0.1em] text-stone-2">{y}</span><div><p className="text-[16px] font-semibold tracking-tight">{k}</p><p className="mt-1 text-[14.5px] leading-relaxed text-ink/75">{v}</p></div></li>)}
              </ol>
              <p className="mt-3 font-mono text-[10.5px] tracking-[0.1em] text-stone-2">Sources: Danforth Plant Science Center press (2026); The Ray.</p>
              <div className="mt-10 flex flex-wrap gap-3"><Button to="/contact" variant="primary-ink">Talk to Agrela</Button><Button href={COMPANY.website} variant="ghost-ink" icon="external">agrelaeco.com</Button></div>
            </div>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
