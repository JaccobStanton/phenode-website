import { useState } from 'react'
import { Download, FileText, ChevronDown } from 'lucide-react'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Tag, Button } from '../components/ui/primitives.jsx'
import { TestimonialSlot } from '../sections/home/Proof.jsx'
import { DOC_PRODUCTS } from '../data/docs.js'
import { COMPANY } from '../data/company.js'

const QUICK = [
  ['Quick-start guides', 'Unbox, mount, power, connect — in order.', '#phenode'],
  ['Installation guides', 'Frame, pole, tripod and tower mounting; soil probe placement.', '#phenode'],
  ['Software guides', 'Dashboard, wireless network, downloads and cleaning preferences.', '#software'],
  ['Technical references', 'Sensor specifications, API reference, backend notes.', '#software'],
]

export default function Support() {
  const [showArchived, setShowArchived] = useState({})
  return (
    <Page title="Support & documentation" description="PheNode documentation by product and version: quick-start guides, installation guides, software guides, manuals and technical references — current and archived.">
      <section className="theme-paper pt-28 pb-10 md:pt-40">
        <Container>
          <p className="eyebrow">Support</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">Documentation, by product and version.</h1>
            <p className="lede lg:col-span-5">Current and archived documents stay available for download, with version numbers and dates. Submit a ticket or request remote installation support at <a href={`mailto:${COMPANY.supportEmail}`} className="text-ink underline underline-offset-4">{COMPANY.supportEmail}</a>.</p>
          </div>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK.map(([k, v, href]) => <li key={k} className="bg-phenode-white"><a href={href} className="block h-full p-5 hover:bg-phenode-white-2"><p className="text-[16px] font-semibold tracking-tight">{k}</p><p className="mt-1 text-[13.5px] text-ink/70">{v}</p></a></li>)}
          </ul>
        </Container>
      </section>

      <Section theme="paper" padded={false} className="pb-28">
        <Container>
          {DOC_PRODUCTS.map((p) => (
            <div key={p.id} id={p.id} className="mt-16 border-t border-ink/10 pt-10 first:mt-0">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4"><Eyebrow>Product</Eyebrow><h2 className="display-md mt-3">{p.name}</h2></div>
                <div className="lg:col-span-8">
                  {p.versions.map((v) => {
                    const open = v.current || showArchived[`${p.id}-${v.version}`]
                    return (
                      <div key={v.version} className="mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[12px] tracking-[0.12em] text-ink">{v.version}</span>
                          <span className="font-mono text-[11px] tracking-[0.1em] text-stone-2">{v.date}</span>
                          {v.current ? <Tag tone="data">Current</Tag> : <Tag>Archived</Tag>}
                          {!v.current && <button type="button" onClick={() => setShowArchived((s) => ({ ...s, [`${p.id}-${v.version}`]: !s[`${p.id}-${v.version}`] }))} className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase text-stone-2 hover:text-ink" aria-expanded={!!open}>{open ? 'Hide' : 'Show'} <ChevronDown size={12} className={open ? 'rotate-180' : ''} /></button>}
                        </div>
                        {open && (
                          <ul className="mt-3 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                            {v.docs.map((d) => (
                              <li key={d.title} className="flex items-center justify-between gap-4 py-3">
                                <div className="flex items-start gap-3"><FileText size={16} className="mt-1 shrink-0 text-stone-2" /><div><p className="text-[15px] font-medium">{d.title}</p><p className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone-2">{d.type} · {v.version} · {d.size}{d.placeholder ? ' · file pending' : ''}</p></div></div>
                                {d.placeholder ? <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone-2">Placeholder</span> : <a href={`${import.meta.env.BASE_URL}${d.file.replace(/^\//, '')}`} className="btn-ghost-ink !px-3 !py-1.5 text-[13px]" download><Download size={14} /> Download</a>}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
          <div className="mt-16 grid gap-6 border-t border-ink/10 pt-10 lg:grid-cols-12">
            <div className="lg:col-span-5"><Eyebrow>Service</Eyebrow><h2 className="display-md mt-3 max-w-[14ch]">A person from Agrela answers.</h2><p className="mt-4 text-[15px] leading-relaxed text-ink/75">Tech support and customer service, software demos, real-time remote installation support, and a hardware warranty while the subscription is active.</p><div className="mt-6 flex flex-wrap gap-3"><Button href={`mailto:${COMPANY.supportEmail}`} variant="primary-ink" icon="external">Email support</Button><Button to="/contact" variant="ghost-ink">Contact form</Button></div></div>
            <div className="theme-ink rounded-xl p-2 lg:col-span-7"><TestimonialSlot context="Working with Agrela" /></div>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
