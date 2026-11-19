import { Download, FileText } from 'lucide-react'
import Page, { PageHero } from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button, Img } from '../components/ui/primitives.jsx'
import { SUPPORT_DOCS } from '../data/docs.js'
import { COMPANY } from '../data/company.js'

/** Version status: Current in the PheNode app's green, Archived in the site's orange (Jake, Nov 15), dark text on both. */
function Status({ current }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-ink ${current ? 'bg-phenode-green' : 'bg-signal'}`}>
      {current ? 'Current' : 'Archived'}
    </span>
  )
}

/** A quote from Nadia beside the service block (Jake, Nov 15), word for word from AgFunderNews (Dec 11, 2023). */
const NADIA = {
  text: 'The PheNode is designed to be a platform for other folks’ innovation.',
  name: 'Nadia Shakoor, PhD',
  role: COMPANY.founderQuote.title,
  source: 'AgFunderNews, 2023',
}

export default function Support() {
  return (
    <Page title="Support & documentation" description="PheNode support documentation in PDF format: quick start guides and user manuals, current and archived.">
      <PageHero
        eyebrow="Support"
        title="Quick start guides and manuals."
        photo={{ name: 'support/phenode-research-field', widths: [800, 1200], alt: 'A PheNode on a guyed mast above rows of plants in a field', position: '60% 50%' }}
        lede={<>Below are links to downloadable support documentation in PDF format. Submit a ticket or request remote installation support at <a href={`mailto:${COMPANY.supportEmail}`} className="text-ink underline underline-offset-4">{COMPANY.supportEmail}</a>.</>}
      />

      <Section theme="paper" padded={false} className="pb-28">
        <Container>
          {/* One list, by version, as on agrelaeco.com/support */}
          <div className="grid gap-8 border-t border-ink/10 pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4"><Eyebrow>Documentation</Eyebrow><h2 className="display-md mt-3 max-w-[14ch]">Everything is in the quick start guide.</h2></div>
            <ol className="flex flex-col gap-8 lg:col-span-8" aria-label="Support documents by version">
              {SUPPORT_DOCS.map((v) => (
                <li key={v.version}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px] tracking-[0.12em] text-ink">{v.version}</span>
                    <Status current={v.current} />
                  </div>
                  <ul className="mt-3 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                    {v.docs.map((d) => (
                      <li key={d.title} className="flex items-center justify-between gap-4 py-3">
                        <div className="flex items-start gap-3">
                          <FileText size={16} className="mt-1 shrink-0 text-stone-2" aria-hidden="true" />
                          <div><p className="text-[15px] font-medium">{d.title}</p><p className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone-2">PDF · {d.size}</p></div>
                        </div>
                        <a href={d.href} target="_blank" rel="noreferrer" className="btn-ghost-ink shrink-0 !px-3 !py-1.5 text-[13px]" aria-label={`Download ${d.title} (PDF)`}><Download size={14} aria-hidden="true" /> Download</a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 grid gap-10 border-t border-ink/10 pt-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5"><Eyebrow>Service</Eyebrow><h2 className="display-md mt-3 max-w-[14ch]">A person from Agrela answers.</h2><p className="mt-4 text-[15px] leading-relaxed text-ink/75">Tech support and customer service, software demos, real-time remote installation support, and a hardware warranty while the subscription is active.</p><div className="btn-row mt-6 flex flex-wrap gap-3"><Button href={`mailto:${COMPANY.supportEmail}`} variant="primary-ink" icon="external">Email support</Button><Button to="/contact" variant="ghost-ink">Contact form</Button></div></div>
            {/* In place of the customer-quote placeholder: Jake's close-up of a PheNode (DSC02237.jpg, Nov 15), and a quote from Nadia */}
            <figure className="lg:col-span-6 lg:col-start-7">
              <Img name="support/phenode-closeup" widths={[800, 1200]} sizes="(min-width: 1024px) 46vw, 100vw" alt="Close-up of a PheNode: the enclosure, two solar panels and its sensors against a blue sky" className="aspect-[3/2] h-auto w-full rounded-xl object-cover" />
              <blockquote className="mt-6 border-l-2 border-data pl-5 text-[18px] leading-relaxed text-ink/85">“{NADIA.text}”</blockquote>
              <figcaption className="mt-3 pl-5 font-mono text-[11px] tracking-[0.1em] text-stone-2">{NADIA.name} · {NADIA.role} · {NADIA.source}</figcaption>
            </figure>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
