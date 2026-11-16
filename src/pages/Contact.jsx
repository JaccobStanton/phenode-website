import { useSearchParams } from 'react-router-dom'
import Page from '../components/layout/Page.jsx'
import { Container, Section, Eyebrow } from '../components/ui/primitives.jsx'
import LeadForm from '../components/configurator/LeadForm.jsx'
import { COMPANY } from '../data/company.js'
import { FEATURES } from '../data/features.js'

export default function Contact() {
  const [params] = useSearchParams()
  const demo = params.get('intent') === 'demo'
  return (
    <Page title={demo ? 'Request a demo' : 'Talk to Agrela'} description="Contact Agrela Ecosystems about PheNode: demos, configurations, pricing and deployments.">
      <section className="theme-ink pt-28 pb-10 md:pt-40">
        <Container>
          <p className="eyebrow">{demo ? 'Request a demo' : 'Contact'}</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">{demo ? 'See PheNode running.' : 'Talk to Agrela.'}</h1>
            <p className="lede lg:col-span-5">{demo ? 'A short walkthrough of the hardware and the software, with your application in mind.' : 'Tell us about the environment you need to understand. A person replies — no automated sequences.'}</p>
          </div>
        </Container>
      </section>
      <Section theme="ink" className="!pt-6">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7"><LeadForm intent={demo ? 'demo' : 'contact'} submitLabel={demo ? 'Request a demo' : 'Talk to Agrela'} /></div>
            <aside className="lg:col-span-4 lg:col-start-9">
              <Eyebrow>Direct</Eyebrow>
              <ul className="mt-4 flex flex-col gap-3 text-[15px]">
                <li><a href={`mailto:${COMPANY.supportEmail}`} className="underline underline-offset-4 hover:text-data">{COMPANY.supportEmail}</a><p className="text-[13px] text-stone">Support, demos, remote installation help</p></li>
                <li className="pt-2 text-paper/80">St. Louis, Missouri<p className="text-[13px] text-stone">Donald Danforth Plant Science Center community</p></li>
              </ul>
              {FEATURES.designSystem && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <Eyebrow>Before you write</Eyebrow>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-paper/75">If you have a sense of scale and sensors already, the configurator captures it in a minute and attaches it to your message.</p>
                  <a href="/design-your-system" className="btn-ghost mt-4 !px-4 !py-2 text-[14px]">Design your system</a>
                </div>
              )}
            </aside>
          </div>
        </Container>
      </Section>
    </Page>
  )
}
