import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Page, { PageHero } from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Img } from '../components/ui/primitives.jsx'

/**
 * Each entry shows a 3:2 thumbnail, like an article list (Jake, Nov 15): `thumb` names public/assets/thumbs/<thumb>-{320,480}.webp.
 * Press entries use the lead photo of the article they link to (copies in media-src/press/); the rest use Agrela's photos.
 */
const GROUPS = [
  { heading: 'Guides', items: [
    { title: 'Support & documentation', text: 'PheNode quick start guides and user manuals, current and archived.', to: '/support', thumb: 'support-docs' },
    { title: 'API instructions', text: 'Request your PheNode’s sensor data from phenode.live with an access token.', to: '/resources/api', thumb: 'api' },
  ] },
  { heading: 'Press', items: [
    { title: 'Agrela Ecosystems expands nationally as PheNode moves from agricultural research into transportation infrastructure', text: 'Danforth Plant Science Center, 2026', href: 'https://www.danforthcenter.org/news/agrela-ecosystems-phenode-expands-nationally-into-transportation-infrastructure/', external: true, thumb: 'press-danforth' },
    { title: 'Leading transportation partnership deploys Agrela\'s vegetation monitoring technology on The Ray Highway', text: 'The Ray', href: 'https://www.theray.org/our-news/leading-transportation-partnership-deploys-agrelas-vegetation-monitoring-technology-on-the-ray-highway-first-for-interstate-roadside', external: true, thumb: 'press-theray' },
    { title: 'Meet the founder: Agrela\'s Nadia Shakoor on how to restore biodiversity to US highways', text: 'AgFunderNews', href: 'https://agfundernews.com/agrelas-nadia-shakoor-on-how-to-restore-biodiversity-to-us-highways', external: true, thumb: 'press-agfundernews' },
  ] },
  { heading: 'Learn', items: [
    { title: 'How PheNode works', text: 'Follow one reading from the sensor to your dataset.', to: '/phenode#data-platform', thumb: 'how-it-works' },
    { title: 'Applications', text: 'Transportation, agriculture, ecology, urban heat.', to: '/applications', thumb: 'applications' },
    { title: 'Case studies', text: 'Public deployments and what they measure.', to: '/case-studies', thumb: 'case-studies' },
  ] },
]

export default function Resources() {
  return (
    <Page>
      <PageHero
        eyebrow="Resources"
        title="Read before you deploy."
        lede="Guides, specifications and press — and the documentation library for everything after your purchase."
        photo={{ name: 'gallery/phenode-tripod-field', alt: 'A PheNode on its tripod in a field, under a cloudy sky', position: '50% 20%' }}
      />
      <Section theme="paper" padded={false} className="pb-28">
        <Container>
          {GROUPS.map((g) => (
            <div key={g.heading} className="mt-14 grid gap-6 border-t border-ink/10 pt-8 first:mt-0 lg:grid-cols-12">
              <div className="lg:col-span-3"><Eyebrow>{g.heading}</Eyebrow></div>
              <ul className="flex flex-col divide-y divide-ink/10 lg:col-span-9">
                {g.items.map((it) => {
                  const inner = (
                    <>
                      {/* decorative: the title names the link */}
                      {it.thumb && (
                        <span className="relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-lg bg-ink/5 md:w-44 lg:w-52">
                          <Img name={`thumbs/${it.thumb}`} widths={[320, 480]} sizes="(min-width: 1024px) 208px, (min-width: 768px) 176px, 96px" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1"><span className="block text-[17px] font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{it.title}</span><span className="mt-1 block text-[14px] text-ink/70">{it.text}</span></span>
                      <ArrowUpRight size={16} className="mt-1 shrink-0 opacity-60 md:mt-0" />
                    </>
                  )
                  return (
                    <li key={it.title}>
                      {it.to ? <Link to={it.to} className="group flex items-start gap-4 py-4 md:items-center md:gap-6 md:py-5">{inner}</Link> : <a href={it.href} target={it.external ? '_blank' : undefined} rel="noreferrer" className="group flex items-start gap-4 py-4 md:items-center md:gap-6 md:py-5">{inner}</a>}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </Container>
      </Section>
    </Page>
  )
}
