import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Tag, AssetPlaceholder, Button } from '../components/ui/primitives.jsx'
import { CASE_STUDIES } from '../data/caseStudies.js'
import { APPLICATION_BY_ID } from '../data/applications.js'

export default function CaseStudies() {
  return (
    <Page title="Case studies" description="PheNode deployments: interstate roadside monitoring with The Ray and Georgia DOT, research at the Danforth Center, and more.">
      <section className="theme-paper pt-28 pb-10 md:pt-40">
        <Container>
          <p className="eyebrow">Case studies</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">Real hardware. Real deployments. Real data.</h1>
            <p className="lede lg:col-span-5">Only publicly reported facts are stated for named partners. Entries marked as placeholders are awaiting customer permission.</p>
          </div>
        </Container>
      </section>
      <Section theme="paper" padded={false} className="pb-28">
        <Container>
          <ol className="flex flex-col gap-16">
            {CASE_STUDIES.map((c, i) => (
              <li key={c.slug} className="border-t border-ink/10 pt-10">
                <Link to={`/case-studies/${c.slug}`} className="group grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-7"><AssetPlaceholder label={`Deployment photography · ${c.partner.split(' · ')[0]} · 2000×1250`} ratio="16 / 10" className="text-ink/50" /></div>
                  <div className="flex flex-col lg:col-span-5">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-stone-2"><span>{String(i + 1).padStart(2, '0')}</span><span className="opacity-40">/</span><span>{APPLICATION_BY_ID[c.application]?.kicker}</span>{c.placeholder && <Tag tone="signal">Placeholder · pending approval</Tag>}</div>
                    <h2 className="display-md mt-4 group-hover:underline group-hover:underline-offset-4">{c.project}</h2>
                    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ink/10 pt-5 font-mono text-[11px] tracking-[0.08em]">
                      <div><dt className="uppercase text-stone-2">Location</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.location}</dd></div>
                      <div><dt className="uppercase text-stone-2">Partner</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.partner}</dd></div>
                      <div><dt className="uppercase text-stone-2">Since</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.year}</dd></div>
                      <div><dt className="uppercase text-stone-2">Data</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.data.slice(0, 2).join(', ')}</dd></div>
                    </dl>
                    <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{c.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-6 font-mono text-[11px] tracking-[0.14em] uppercase text-ink">Read the case study <ArrowUpRight size={14} /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-16 flex flex-wrap gap-3"><Button to="/contact" variant="primary-ink">Talk to Agrela about your project</Button></div>
        </Container>
      </Section>
    </Page>
  )
}
