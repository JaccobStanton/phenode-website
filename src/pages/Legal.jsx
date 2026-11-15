import { useParams, Navigate } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Tag } from '../components/ui/primitives.jsx'
import { COMPANY } from '../data/company.js'

const DOCS = {
  privacy: {
    title: 'Privacy policy',
    updated: 'Placeholder — insert effective date',
    sections: [
      ['Scope', 'Placeholder. Describe what this policy covers: the website, the PheNode software, and data collected by deployed hardware on behalf of customers.'],
      ['Information we collect', 'Placeholder. Contact details submitted through forms; account information for the PheNode software; environmental measurements and images collected by customer-owned hardware; usage analytics if enabled.'],
      ['How we use it', 'Placeholder. To respond to inquiries, provide and support the service, store customer data for the retention period described in the service subscription, and improve the platform.'],
      ['Data retention', 'Placeholder. Agrela stores customer data in its cloud for two years even if a subscription expires (per the service subscription).'],
      ['Your choices', 'Placeholder. How to request access, correction or deletion; how to contact Agrela.'],
    ],
  },
  terms: {
    title: 'Terms of service',
    updated: 'Placeholder — insert effective date',
    sections: [
      ['Agreement', 'Placeholder. Terms governing use of agrelaeco.com and the PheNode software.'],
      ['Service subscription', 'Placeholder. Software license, data plan, hardware warranty and support as described in the PheNode service subscription.'],
      ['Acceptable use', 'Placeholder.'],
      ['Intellectual property', 'Placeholder. PheNode® is a registered trademark of Agrela Ecosystems.'],
      ['Contact', `Questions about these terms: ${COMPANY.supportEmail}.`],
    ],
  },
}

export default function Legal() {
  const { doc } = useParams()
  const d = DOCS[doc]
  if (!d) return <Navigate to="/" replace />
  return (
    <Page title={d.title}>
      <section className="theme-paper pt-28 pb-6 md:pt-40">
        <Container>
          <p className="eyebrow">Legal</p>
          <h1 className="display-lg mt-4">{d.title}</h1>
          <div className="mt-4 flex items-center gap-3"><Tag tone="signal">Placeholder</Tag><span className="font-mono text-[11px] tracking-[0.1em] text-stone-2">{d.updated}</span></div>
        </Container>
      </section>
      <Section theme="paper" className="!pt-8">
        <Container>
          <div className="max-w-[72ch]">
            {d.sections.map(([k, v]) => <div key={k} className="border-t border-ink/10 py-6"><h2 className="text-[20px] font-semibold tracking-tight">{k}</h2><p className="mt-2 text-[15.5px] leading-relaxed text-ink/80">{v}</p></div>)}
            <p className="mt-6 text-[13px] text-stone-2">Replace this placeholder with Agrela's reviewed {d.title.toLowerCase()} (the PDF versions are linked from the Summer 2025 Buyer's Guide).</p>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
