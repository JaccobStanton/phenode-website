import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { COMPANY } from '../../data/company.js'

const APPLICATION_CHOICES = ['Transportation / infrastructure', 'Agricultural research', 'Crop improvement / breeding', 'Ecological research', 'Restoration', 'Fire weather monitoring', 'Urban environmental intelligence', 'Other']
const PROJECT_TYPES = ['Research', 'Pilot / evaluation', 'Operational deployment', 'Education', 'Other']
const TIMELINES = ['As soon as possible', 'Next 3 months', 'Next 6–12 months', 'Exploring']

const inputCls = 'w-full rounded-md border bg-transparent px-3.5 py-3 text-[15px] outline-none transition-colors placeholder:text-current/40 focus:border-data'

const Field = ({ label, children }) => (<label className="flex flex-col gap-1.5"><span className="font-mono text-[11px] tracking-[0.14em] uppercase opacity-70">{label}</span>{children}</label>)

/**
 * Qualifying lead form (Contact). Posts to VITE_LEAD_ENDPOINT when configured; otherwise opens a prefilled email to
 * Agrela. (Until Nov 17 it also carried the configurator's result; that page was deleted.)
 */
export default function LeadForm({ intent = 'contact', tone = 'ink', submitLabel = 'Talk to Agrela' }) {
  const [state, setState] = useState('idle')
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', organization: '', email: '', projectType: '', application: '', locations: '', sensors: '', timeline: '', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const border = tone === 'ink' ? 'border-white/15' : 'border-ink/15'

  const payload = () => ({ ...form, intent, submittedAt: new Date().toISOString(), page: typeof window !== 'undefined' ? window.location.href : '' })

  const bodyText = () => {
    const p = payload()
    return [
      `Name: ${p.name}`, `Organization: ${p.organization}`, `Email: ${p.email}`, `Project type: ${p.projectType}`, `Application: ${p.application}`,
      `Monitoring locations / nodes: ${p.locations}`, `Sensors of interest: ${p.sensors}`, `Timeline: ${p.timeline}`, '', p.message,
    ].join('\n')
  }

  const submit = async (e) => {
    e.preventDefault()
    setState('sending')
    const endpoint = import.meta.env.VITE_LEAD_ENDPOINT
    if (endpoint) {
      try {
        const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()) })
        if (!r.ok) throw new Error('bad status')
        setState('sent'); return
      } catch { /* fall through to mailto */ }
    }
    const subject = `PheNode inquiry — ${form.organization || form.name}`
    window.location.href = `mailto:${COMPANY.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText())}`
    setState('sent')
  }

  const copy = async () => { try { await navigator.clipboard.writeText(bodyText()); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ } }

  if (state === 'sent') {
    return (
      <div className={`rounded-lg border p-6 ${border}`} role="status">
        <div className="flex items-center gap-2 text-data"><Check size={18} /><p className="font-medium">Thanks — your message is on its way to Agrela.</p></div>
        <p className="mt-2 text-[14px] opacity-70">If your email client did not open, copy the message and send it to {COMPANY.supportEmail}.</p>
        <button type="button" onClick={copy} className="btn-ghost mt-4 !px-4 !py-2 text-[14px]">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy message'}</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" aria-label="Contact Agrela">
      {/* Progressive: essentials first, qualifiers second */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><input required className={`${inputCls} ${border}`} value={form.name} onChange={set('name')} autoComplete="name" /></Field>
        <Field label="Organization"><input className={`${inputCls} ${border}`} value={form.organization} onChange={set('organization')} autoComplete="organization" /></Field>
        <Field label="Email"><input required type="email" className={`${inputCls} ${border}`} value={form.email} onChange={set('email')} autoComplete="email" /></Field>
        <Field label="Application">
          <select className={`${inputCls} ${border} appearance-none`} value={form.application} onChange={set('application')}>
            <option value="" className="text-ink">Select</option>{APPLICATION_CHOICES.map((a) => <option key={a} value={a} className="text-ink">{a}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project type">
          <select className={`${inputCls} ${border} appearance-none`} value={form.projectType} onChange={set('projectType')}>
            <option value="" className="text-ink">Select</option>{PROJECT_TYPES.map((a) => <option key={a} value={a} className="text-ink">{a}</option>)}
          </select>
        </Field>
        <Field label="Approximate monitoring locations / nodes"><input className={`${inputCls} ${border}`} value={form.locations} onChange={set('locations')} placeholder="e.g. 1 base station, 20 nodes" /></Field>
        <Field label="Sensors of interest"><input className={`${inputCls} ${border}`} value={form.sensors} onChange={set('sensors')} placeholder="Soil moisture, wind, imaging…" /></Field>
        <Field label="Project timeline">
          <select className={`${inputCls} ${border} appearance-none`} value={form.timeline} onChange={set('timeline')}>
            <option value="" className="text-ink">Select</option>{TIMELINES.map((a) => <option key={a} value={a} className="text-ink">{a}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Message"><textarea rows={4} className={`${inputCls} ${border}`} value={form.message} onChange={set('message')} placeholder="Tell us about the environment you need to understand." /></Field>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state === 'sending'} className={tone === 'ink' ? 'btn-primary' : 'btn-primary-ink'}>{state === 'sending' ? 'Sending…' : submitLabel}</button>
        <span className="text-[13px] opacity-60">No spam, no newsletter — a person from Agrela replies.</span>
      </div>
    </form>
  )
}
