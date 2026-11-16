import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Eyebrow, Section, Container, Button, Tag, AssetPlaceholder } from '../../components/ui/primitives.jsx'
import { CASE_STUDIES } from '../../data/caseStudies.js'
import { useReveal } from '../../lib/motion.js'
import { homeNo } from '../../data/homeSections.js'
import { FEATURES } from '../../data/features.js'

/** A row opens the case study page, or its first press release while those pages are hidden (data/features.js). */
function RowLink({ c, className, children }) {
  if (FEATURES.caseStudyPages || !c.press?.length) return <Link to={FEATURES.caseStudyPages ? `/case-studies/${c.slug}` : '/case-studies'} className={className}>{children}</Link>
  return <a href={c.press[0].href} target="_blank" rel="noreferrer" className={className}>{children}</a>
}

export default function CaseStudiesTeaser() {
  const reveal = useReveal()
  const items = CASE_STUDIES.slice(0, 3)
  return (
    <Section id="case-studies" theme="paper" className="border-t border-ink/10">
      <Container>
        <div ref={reveal}>
          <Eyebrow index={homeNo('case-studies')} className="reveal">Case studies</Eyebrow>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="display-lg reveal max-w-[14ch]">Real deployments.</h2>
            <p className="lede reveal max-w-[42ch]">Where PheNode is running today, what it measures, and what the people running it are learning.</p>
          </div>
          <ol className="mt-14 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
            {items.map((c, i) => (
              <li key={c.slug} className="reveal">
                <RowLink c={c} className="group grid gap-6 py-8 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-3">
                    <AssetPlaceholder label={`Photo · ${c.partner.split(' · ')[0]}`} ratio="4 / 3" className="text-ink/50" />
                  </div>
                  <div className="md:col-span-7">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-stone-2">
                      <span>{String(i + 1).padStart(2, '0')}</span><span className="opacity-40">/</span><span>{c.location}</span><span className="opacity-40">/</span><span>{c.year}</span>
                      {c.placeholder && <Tag tone="signal" className="ml-1">Placeholder · pending approval</Tag>}
                    </div>
                    <h3 className="display-sm mt-3 max-w-[30ch] group-hover:underline group-hover:underline-offset-4">{c.project}</h3>
                    <p className="mt-2 text-[14.5px] text-ink/70">{c.partner}</p>
                  </div>
                  <div className="md:col-span-2 md:text-right"><span className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.14em] uppercase text-ink">{FEATURES.caseStudyPages ? 'Read' : 'Press release'} <ArrowUpRight size={14} /></span></div>
                </RowLink>
              </li>
            ))}
          </ol>
          <div className="reveal mt-10"><Button to="/case-studies" variant="primary-ink">All case studies</Button></div>
        </div>
      </Container>
    </Section>
  )
}
