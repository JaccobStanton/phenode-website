import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Page from '../components/layout/Page.jsx'
import Configurator from '../components/configurator/Configurator.jsx'
import { configFromAnswers } from '../components/configurator/configModel.js'
import { Container } from '../components/ui/primitives.jsx'

const QUESTIONS = [
  { id: 'monitor', q: 'What are you trying to monitor?', options: [['soil', 'Soil'], ['weather', 'Weather'], ['vegetation', 'Vegetation'], ['urban-heat', 'Urban heat'], ['fire', 'Fire conditions'], ['restoration', 'Restoration'], ['plots', 'Research plots'], ['other', 'Other']] },
  { id: 'area', q: 'How large is your monitoring area?', options: [['single', 'Single location'], ['lt1', '< 1 acre'], ['1-10', '1–10 acres'], ['10-100', '10–100 acres'], ['100+', '100+ acres'], ['corridor', 'Transportation corridor'], ['city', 'City / distributed network'], ['custom', 'Custom']] },
  { id: 'frequency', q: 'How frequently do you need measurements?', options: [['hourly', 'Hourly is fine'], ['sub-hourly', 'More often than hourly'], ['daily', 'Daily summaries'], ['unsure', 'Not sure yet']] },
  { id: 'existingSensors', q: 'Do you already have sensors you want to integrate?', options: [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']] },
]

export default function DesignYourSystem() {
  const [params, setParams] = useSearchParams()
  const guided = params.get('mode') === 'guided'
  const [answers, setAnswers] = useState({})
  const [suggested, setSuggested] = useState(null)
  const done = QUESTIONS.every((q) => answers[q.id])

  return (
    <Page title="Design your system" description="Build your PheNode: choose an application and scale, add a base station and wireless nodes, attach sensors, pick software, and send the configuration to Agrela.">
      <section className="theme-ink pt-28 pb-10 md:pt-40 md:pb-14">
        <Container>
          <p className="eyebrow">Design your system</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="display-lg max-w-[12ch]">Build your PheNode.</h1>
            <p className="lede max-w-[46ch]">Assemble a deployment visually, or answer four questions and start from a suggested configuration. Either way it ends with a conversation, not a checkout.</p>
          </div>
          <div className="mt-8 flex gap-2">
            <button type="button" onClick={() => { setSuggested(null); setParams((p) => { p.delete('mode'); return p }, { replace: true }) }} className={`chip !px-4 !py-2 ${!guided ? 'border-paper bg-paper text-ink' : 'border-white/15 text-paper/80'}`}>Build it visually</button>
            <button type="button" onClick={() => setParams((p) => { p.set('mode', 'guided'); return p }, { replace: true })} className={`chip !px-4 !py-2 ${guided ? 'border-paper bg-paper text-ink' : 'border-white/15 text-paper/80'}`}>Answer questions</button>
          </div>
        </Container>
      </section>
      <section className="theme-ink pb-24 md:pb-36">
        <Container>
          {guided && !suggested ? (
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow">Smart configurator</p>
                <h2 className="display-md mt-3">Four questions.</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-paper/70">We'll propose a starting configuration based on your answers. It is guidance for a conversation with Agrela, not an automated engineering guarantee.</p>
              </div>
              <div className="flex flex-col gap-8 lg:col-span-8">
                {QUESTIONS.map((q, i) => (
                  <fieldset key={q.id} className="border-t border-white/10 pt-6">
                    <legend className="sr-only">{q.q}</legend>
                    <p className="flex items-baseline gap-3 text-[18px] font-semibold tracking-tight"><span className="font-mono text-[11px] font-normal text-stone">{String(i + 1).padStart(2, '0')}</span>{q.q}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.options.map(([v, l]) => <button key={v} type="button" aria-pressed={answers[q.id] === v} onClick={() => setAnswers((a) => ({ ...a, [q.id]: v }))} className={`chip !px-4 !py-2 ${answers[q.id] === v ? 'border-paper bg-paper text-ink' : 'border-white/15 text-paper/85 hover:border-white/40'}`}>{l}</button>)}
                    </div>
                  </fieldset>
                ))}
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <button type="button" disabled={!done} onClick={() => setSuggested(configFromAnswers(answers))} className="btn-primary disabled:opacity-40">Suggest a configuration <ArrowRight size={16} /></button>
                  {!done && <span className="text-[13px] text-stone">Answer all four to continue.</span>}
                </div>
              </div>
            </div>
          ) : (
            <Configurator key={suggested ? 'suggested' : 'manual'} initial={suggested} />
          )}
        </Container>
      </section>
    </Page>
  )
}
