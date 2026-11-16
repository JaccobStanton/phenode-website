import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Page from '../../components/layout/Page.jsx'
import { Container, Section, Eyebrow, Button } from '../../components/ui/primitives.jsx'
import ExplorerScene from '../../components/viz/ExplorerScene.jsx'
import { APPLICATIONS } from '../../data/applications.js'
import { usePersonalization } from '../../context/PersonalizationContext.jsx'
import { FEATURES } from '../../data/features.js'

export default function ApplicationsIndex() {
  const { applications, role } = usePersonalization()
  const list = role ? applications : APPLICATIONS
  return (
    <Page title="Applications" description="PheNode applications: transportation and smart infrastructure, agricultural research, ecological research and restoration, urban environmental intelligence.">
      <section className="theme-ink pt-28 pb-12 md:pt-40">
        <Container>
          <p className="eyebrow">Applications</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-xl lg:col-span-7">One environment is never just one environment.</h1>
            <p className="lede lg:col-span-5">{role?.plural ? `Ordered for ${role.plural}. ` : ''}The same platform, reconfigured for roadsides, research plots, ecosystems and cities.</p>
          </div>
        </Container>
      </section>
      <Section theme="ink" padded={false} className="pb-24">
        <Container>
          <ol className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            {list.map((a, i) => (
              <li key={a.id}>
                <Link to={a.route} className="group grid gap-6 py-10 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-5"><div className="overflow-hidden rounded-xl border border-white/10 bg-ink-2"><ExplorerScene kind={a.environment} count={8} heat={0.6} pulse={false} className="text-paper" /></div></div>
                  <div className="lg:col-span-6 lg:col-start-7">
                    <p className="eyebrow"><span className="opacity-90">{String(i + 1).padStart(2, '0')}</span><span className="mx-2 opacity-40">/</span>{a.kicker}</p>
                    <h2 className="display-md mt-3 max-w-[18ch] group-hover:underline group-hover:underline-offset-4">{a.title}</h2>
                    <p className="mt-3 max-w-[50ch] text-[15px] leading-relaxed text-paper/70">{a.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-data">{a.cta} <ArrowRight size={14} /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          {FEATURES.designSystem && <div className="mt-10"><Button to="/design-your-system" variant="primary">Design your system</Button></div>}
        </Container>
      </Section>
    </Page>
  )
}
