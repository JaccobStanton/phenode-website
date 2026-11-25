import { ArrowUpRight } from 'lucide-react'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Tag, AssetPlaceholder, Button, Img } from '../components/ui/primitives.jsx'
import { CASE_STUDIES } from '../data/caseStudies.js'
import { APPLICATION_BY_ID } from '../data/applications.js'

export default function CaseStudies() {
  return (
    <Page>
      <section className="theme-paper pt-28 pb-10 md:pt-40">
        <Container>
          <p className="eyebrow">Case studies</p>
          {/* Just the title (Jake, Nov 15) */}
          <h1 className="display-xl mt-4 text-balance">Real deployments. Real impact.</h1>
        </Container>
      </section>
      <Section theme="paper" padded={false} className="pb-28">
        <Container>
          <ol className="flex flex-col gap-16">
            {CASE_STUDIES.map((c, i) => (
              <li key={c.slug} className="border-t border-ink/10 pt-10">
                {/* The card links only to its press releases (the case study pages were deleted on Nov 17) */}
                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    {c.photo
                      ? <Img name={c.photo.name} widths={c.photo.widths} sizes="(min-width: 1024px) 54vw, 100vw" alt={c.photo.alt} className="aspect-[16/10] h-auto w-full rounded-xl bg-ink/5 object-cover" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} />
                      : <AssetPlaceholder label={`Deployment photography · ${c.partner.split(' · ')[0]} · 2000×1250`} ratio="16 / 10" className="text-ink/50" />}
                  </div>
                  <div className="flex flex-col lg:col-span-5">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-stone-2"><span>{String(i + 1).padStart(2, '0')}</span><span className="opacity-40">/</span><span>{APPLICATION_BY_ID[c.application]?.kicker}</span>{c.placeholder && <Tag tone="signal">Placeholder · pending approval</Tag>}</div>
                    <h2 className="display-md mt-4">{c.project}</h2>
                    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ink/10 pt-5 font-mono text-[11px] tracking-[0.08em]">
                      <div><dt className="uppercase text-stone-2">Location</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.location}</dd></div>
                      <div><dt className="uppercase text-stone-2">Partner</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.partner}</dd></div>
                      <div><dt className="uppercase text-stone-2">Since</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.year}</dd></div>
                      <div><dt className="uppercase text-stone-2">Data</dt><dd className="mt-0.5 font-sans text-[14px] tracking-normal text-ink">{c.data.slice(0, 2).join(', ')}</dd></div>
                    </dl>
                    <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{c.summary}</p>
                    {c.press?.length > 0 && (
                      <div className="mt-auto pt-6">
                        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone-2">{c.press.length > 1 ? 'Press releases' : 'Press release'}</p>
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {c.press.map((p) => (
                            <li key={p.href}>
                              <a href={p.href} target="_blank" rel="noreferrer" aria-label={`${p.publisher}, ${p.date}: ${p.title} (opens in a new tab)`} className="inline-flex items-center gap-1 text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink">
                                {p.publisher}, {p.date} <ArrowUpRight size={14} aria-hidden="true" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-16 flex flex-wrap gap-3"><Button to="/contact" variant="primary-ink">Talk to Agrela about your project</Button></div>
        </Container>
      </Section>
    </Page>
  )
}
