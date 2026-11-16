import Page, { PageHero } from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button, Img } from '../components/ui/primitives.jsx'
import { COMPANY } from '../data/company.js'

/** "About Us" on agrelaeco.com, word for word (Jake, Nov 15, 2026), shown beside its photo of the Danforth Center.
 *  One fix at Jake's request: "… Center is St Louis" → "in St Louis". */
const ABOUT_LEAD = 'Agrela is an agtech start up that began its journey at the Danforth Plant Science Center in St Louis, MO in 2016.'
const ABOUT = [
  "Founded by plant scientists, Agrela offers scalable and flexible weather-tech solutions that evolve with the user's needs. Our mission is to make research-quality environmental data collection more accessible. We provide premium products and services that cater to a diverse range of industries, aiming to lower the barrier to entry and enhance user experience.",
  'After six years of dedicated research and development on core concepts, we proudly launched our first commercial product, PheNode, in spring 2023.',
]

/** Jake's photo about-us-hero.jpg (Nov 15), in place of the Gallery photo first used here. It is 800 px wide, so only that size is exported. */
const HERO_PHOTO = { name: 'company/about-us-hero', widths: [800], alt: 'A PheNode on a pole in tall grass at dusk, with glass buildings behind', position: '50% 45%' }

const TIMELINE = [
  ['2016', 'Founded', 'Plant scientists at the Donald Danforth Plant Science Center build the first PheNode to get environmental data from the field alongside their crop data.'],
  ['2023', 'Commercial launch', 'PheNode becomes available to outside institutions after years of research deployments.'],
  ['2025', 'Interstate roadside', 'PheNode is deployed with The Ray and the Georgia Department of Transportation along 18 miles of Interstate 85 — a first for interstate roadside monitoring.'],
  ['2026', 'National expansion', 'Deployment with the Washington State Department of Transportation; a $500,000 round led by QRM Capital and the St. Louis Port Authority supports the move from agricultural research into transportation infrastructure.'],
]

export default function Company() {
  return (
    <Page title="Company" description="Agrela Ecosystems: founded in 2016 at the Donald Danforth Plant Science Center, maker of the PheNode environmental monitoring platform.">
      <PageHero
        eyebrow="Company"
        title="Built by researchers who needed the data."
        lede={`${COMPANY.origin}. Agrela makes PheNode — hardware, communications, data and software designed as one environmental intelligence platform.`}
        photo={HERO_PHOTO}
      />
      {/* About Us, as on agrelaeco.com: the Danforth Center photo beside the text */}
      <Section theme="paper" padded={false} className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-10 border-t border-ink/10 pt-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <figure className="lg:col-span-7">
              <Img name="company/danforth-center" widths={[800, 1200, 1800]} sizes="(min-width: 1024px) 56vw, 100vw" alt="Donald Danforth Plant Science Center" className="aspect-[1800/941] h-auto w-full rounded-xl object-cover" />
              <figcaption className="mt-3 font-mono text-[10.5px] tracking-[0.1em] text-stone-2">Donald Danforth Plant Science Center, St. Louis</figcaption>
            </figure>
            <div className="lg:col-span-5">
              <Eyebrow>About us</Eyebrow>
              <p className="mt-4 text-[21px] font-medium leading-snug tracking-tight text-ink md:text-[23px]">{ABOUT_LEAD}</p>
              {ABOUT.map((t) => <p key={t.slice(0, 24)} className="mt-5 text-[16px] leading-relaxed text-ink/75">{t}</p>)}
            </div>
          </div>
        </Container>
      </Section>
      <Section theme="paper" padded={false} className="pb-24">
        <Container>
          <div className="grid gap-12 border-t border-ink/10 pt-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow>Leadership</Eyebrow>
              <ul className="mt-5 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                {COMPANY.leadership.map((l) => <li key={l.name} className="py-4"><p className="text-[18px] font-semibold tracking-tight">{l.name}</p><p className="text-[14px] text-ink/70">{l.title}</p></li>)}
              </ul>
              <figure className="mt-8 border-l-2 border-data pl-5">
                <blockquote className="text-[18px] leading-relaxed text-ink/85">"{COMPANY.founderQuote.text}"</blockquote>
                <figcaption className="mt-3 font-mono text-[11px] tracking-[0.1em] text-stone-2">{COMPANY.founderQuote.name} · {COMPANY.founderQuote.source}</figcaption>
              </figure>
              <figure className="mt-8">
                <Img name="company/nadia" widths={[800, 1200]} sizes="(min-width: 1024px) 38vw, 100vw" alt="Dr. Nadia Shakoor presenting on a prototype PheNode in a lab" className="aspect-[3/2] h-auto w-full rounded-xl object-cover" />
                <figcaption className="mt-3 font-mono text-[10.5px] tracking-[0.1em] text-stone-2">Dr. Shakoor presenting on a prototype PheNode</figcaption>
              </figure>
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
