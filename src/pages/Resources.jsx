import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Tag } from '../components/ui/primitives.jsx'

const GROUPS = [
  { heading: 'Guides', items: [
    { title: 'PheNode Summer 2025 Buyer\'s Guide', text: 'System overview, specifications and expansion options.', href: '/docs/phenode-buyers-guide-summer-2025.pdf', external: true },
    { title: 'Support & documentation', text: 'Quick-start, installation, software guides and manuals by version.', to: '/support' },
    { title: 'Specifications', text: 'Every published number for the base station, the wireless node and add-on sensors.', to: '/phenode#specifications' },
  ] },
  { heading: 'Press', items: [
    { title: 'Agrela Ecosystems expands nationally as PheNode moves from agricultural research into transportation infrastructure', text: 'Danforth Plant Science Center, 2026', href: 'https://www.danforthcenter.org/news/agrela-ecosystems-phenode-expands-nationally-into-transportation-infrastructure/', external: true },
    { title: 'Leading transportation partnership deploys Agrela\'s vegetation monitoring technology on The Ray Highway', text: 'The Ray', href: 'https://www.theray.org/our-news/leading-transportation-partnership-deploys-agrelas-vegetation-monitoring-technology-on-the-ray-highway-first-for-interstate-roadside', external: true },
    { title: 'Meet the founder: Agrela\'s Nadia Shakoor on how to restore biodiversity to US highways', text: 'AgFunderNews', href: 'https://agfundernews.com/agrelas-nadia-shakoor-on-how-to-restore-biodiversity-to-us-highways', external: true },
  ] },
  { heading: 'Learn', items: [
    { title: 'How PheNode works', text: 'Follow one reading from the sensor to your dataset.', to: '/phenode/data-platform' },
    { title: 'Applications', text: 'Transportation, agriculture, ecology, urban heat.', to: '/applications' },
    { title: 'Case studies', text: 'Public deployments and what they measure.', to: '/case-studies' },
  ] },
]

export default function Resources() {
  return (
    <Page title="Resources" description="PheNode guides, specifications, press and learning resources from Agrela Ecosystems.">
      <section className="theme-paper pt-28 pb-10 md:pt-40">
        <Container>
          <p className="eyebrow">Resources</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">Read before you deploy.</h1>
            <p className="lede lg:col-span-5">Guides, specifications and press — and the documentation library for everything after the sale.</p>
          </div>
        </Container>
      </section>
      <Section theme="paper" padded={false} className="pb-28">
        <Container>
          {GROUPS.map((g) => (
            <div key={g.heading} className="mt-14 grid gap-6 border-t border-ink/10 pt-8 lg:grid-cols-12">
              <div className="lg:col-span-3"><Eyebrow>{g.heading}</Eyebrow></div>
              <ul className="flex flex-col divide-y divide-ink/10 lg:col-span-9">
                {g.items.map((it) => {
                  const inner = (<><span><span className="block text-[17px] font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{it.title}</span><span className="mt-1 block text-[14px] text-ink/70">{it.text}</span></span><ArrowUpRight size={16} className="mt-1 shrink-0 opacity-60" /></>)
                  return (
                    <li key={it.title}>
                      {it.to ? <Link to={it.to} className="group flex items-start justify-between gap-4 py-4">{inner}</Link> : <a href={it.href} target={it.external ? '_blank' : undefined} rel="noreferrer" className="group flex items-start justify-between gap-4 py-4">{inner}</a>}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
          <p className="mt-10 font-mono text-[10.5px] tracking-[0.1em] text-ink/75"><Tag className="mr-2">Note</Tag>Press links open the publisher's site. Documents marked pending on the Support page are placeholders until the files are added.</p>
        </Container>
      </Section>
    </Page>
  )
}
