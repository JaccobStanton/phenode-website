import { useEffect, useMemo, useReducer, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Save, Share2 } from 'lucide-react'
import ConfigScene from './ConfigScene.jsx'
import LeadForm from './LeadForm.jsx'
import { reducer, DEFAULT_CONFIG, APPLICATION_OPTIONS, SCALE_OPTIONS, BASE_ADDON_OPTIONS, summarize, referenceId, encodeConfig, decodeConfig, configFromNeed, nodeProbes } from './configModel.js'
import { SOFTWARE_MODULES, SENSOR_BY_ID, SENSOR_CATEGORIES } from '../../data/sensors.js'
import { Tag } from '../ui/primitives.jsx'
import SystemPair from '../hardware/SystemPair.jsx'

const STEPS = ['Application', 'Scale', 'Base station', 'Wireless nodes', 'Configure nodes', 'Software', 'Your system']
const KEY = 'agrela.config.v1'
const ease = [0.22, 1, 0.36, 1]

export default function Configurator({ initial }) {
  const [params, setParams] = useSearchParams()
  const [config, dispatch] = useReducer(reducer, null, () => {
    const fromUrl = params.get('c') ? decodeConfig(params.get('c')) : null
    if (fromUrl) return { ...DEFAULT_CONFIG, ...fromUrl }
    if (initial) return { ...DEFAULT_CONFIG, ...initial }
    const need = params.get('need') ? configFromNeed(params.get('need')) : null
    if (need) return need
    try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) return { ...DEFAULT_CONFIG, ...saved } } catch { /* ignore */ }
    return { ...DEFAULT_CONFIG }
  })
  const [step, setStepRaw] = useState(() => (initial || params.get('c') ? 6 : params.get('need') ? 2 : 0))
  const [selected, setSelected] = useState(null)
  const setStep = (v) => { setStepRaw((s) => { const n = typeof v === 'function' ? v(s) : v; if (n !== 4) setSelected(null); return n }) }
  const [saved, setSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const summary = useMemo(() => summarize(config), [config])
  const ref = useMemo(() => referenceId(config), [config])

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(config)) } catch { /* ignore */ } }, [config])

  const canNext = step === 0 ? !!config.application : step === 1 ? !!config.scale : true
  const next = () => setStep((s) => Math.min(6, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))
  const save = () => {
    const c = encodeConfig(config)
    setParams((p) => { p.set('c', c); p.delete('need'); return p }, { replace: true })
    setSaved(true); setTimeout(() => setSaved(false), 2200)
  }
  const share = async () => { save(); try { await navigator.clipboard.writeText(window.location.href) } catch { /* ignore */ } }
  const attachment = { reference: ref, summary, config }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Steps rail */}
      <ol className="scroll-thin -mx-4 flex gap-1 overflow-x-auto px-4 lg:col-span-12 lg:mx-0 lg:px-0" aria-label="Configurator steps">
        {STEPS.map((s, i) => {
          const state = i === step ? 'current' : i < step ? 'done' : 'todo'
          return (
            <li key={s} className="shrink-0">
              <button type="button" onClick={() => (i <= step || canNext) && setStep(i)} aria-current={state === 'current' ? 'step' : undefined} className={`flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${state === 'current' ? 'border-paper bg-paper text-ink' : state === 'done' ? 'border-data/50 text-data' : 'border-white/15 text-stone hover:border-white/40'}`}>
                <span>{state === 'done' ? <Check size={12} /> : String(i + 1).padStart(2, '0')}</span>{s}
              </button>
            </li>
          )
        })}
      </ol>

      {/* Stage */}
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-2">
            {step === 6 ? (
              <div className="relative p-6 md:p-10">
                <SystemPair className="mx-auto w-full max-w-[720px]" baseSizes="(min-width:1024px) 56vw, 92vw" nodeSizes="(min-width:1024px) 13vw, 24vw" />
                <div className="absolute left-4 top-4 flex gap-2"><Tag tone="data">{ref}</Tag></div>
              </div>
            ) : (
              <ConfigScene config={config} step={step} selected={selected} onSelect={step === 4 ? (i) => setSelected(selected === i ? null : i) : undefined} />
            )}
            <div className="absolute right-4 top-4 flex gap-2"><Tag>{step === 6 ? 'Your system' : 'Preview'}</Tag></div>
          </div>
          <dl className="mt-3 grid grid-cols-4 gap-3 font-mono text-[10px] tracking-[0.12em] uppercase text-stone">
            <div><dt>Base stations</dt><dd className="font-sans text-[20px] font-semibold tracking-tight text-paper">{step >= 2 ? summary.bases : 0}</dd></div>
            <div><dt>Nodes</dt><dd className="font-sans text-[20px] font-semibold tracking-tight text-paper">{step >= 3 ? summary.nodes : 0}</dd></div>
            <div><dt>Soil sensors</dt><dd className="font-sans text-[20px] font-semibold tracking-tight text-paper">{step >= 3 ? summary.soilSensors : 0}</dd></div>
            <div><dt>Modules</dt><dd className="font-sans text-[20px] font-semibold tracking-tight text-paper">{summary.software.length}</dd></div>
          </dl>
        </div>
      </div>

      {/* Panel */}
      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
            <p className="eyebrow">Step {step + 1} of 7</p>
            {step === 0 && (
              <StepShell title="Choose your application." text="What are you trying to understand? This sets the starting sensors and software.">
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {APPLICATION_OPTIONS.map((a) => <Option key={a.id} on={config.application === a.id} onClick={() => dispatch({ type: 'application', value: a.id })}>{a.name}</Option>)}
                </ul>
              </StepShell>
            )}
            {step === 1 && (
              <StepShell title="Choose your deployment scale." text="The scene reshapes itself; node counts are starting points you can change next.">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {SCALE_OPTIONS.map((s) => (
                    <Option key={s.id} on={config.scale === s.id} onClick={() => dispatch({ type: 'scale', value: s.id })}>
                      <span className="block">{s.name}</span><span className="mt-0.5 block font-mono text-[10px] tracking-[0.1em] uppercase opacity-60">{s.bases} base · {s.nodes} nodes</span>
                    </Option>
                  ))}
                </ul>
                {config.scale && <p className="mt-3 text-[13.5px] text-stone">{SCALE_OPTIONS.find((s) => s.id === config.scale).hint}</p>}
              </StepShell>
            )}
            {step === 2 && (
              <StepShell title="Add the base station." text="Each base station runs the standard sensor suite and the imager, and connects the network to the data platform.">
                <Counter label="Base stations" value={config.base.count} min={1} max={4} onChange={(v) => dispatch({ type: 'base', value: { count: v } })} />
                <div className="mt-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone">Connectivity</p>
                  <div className="mt-2 flex gap-2">{['cellular', 'wifi'].map((c) => <Option key={c} on={config.base.connectivity === c} onClick={() => dispatch({ type: 'base', value: { connectivity: c } })} small>{c === 'wifi' ? 'Wi-Fi' : 'Cellular'}</Option>)}</div>
                </div>
                <div className="mt-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone">Mounting</p>
                  <div className="mt-2 flex gap-2"><Option on={!config.base.tower} onClick={() => dispatch({ type: 'base', value: { tower: false } })} small>Post / pole / tripod</Option><Option on={config.base.tower} onClick={() => dispatch({ type: 'base', value: { tower: true } })} small>3-section aluminum tower</Option></div>
                </div>
                <p className="mt-5 text-[13.5px] leading-relaxed text-stone">Included on every base station: air temperature, humidity, pressure, rainfall, wind, solar radiation, 5 MP imager, SDI-12 / RS-485 ports.</p>
              </StepShell>
            )}
            {step === 3 && (
              <StepShell title="Add wireless sensor nodes." text="Each node carries a light sensor and takes up to two sensors in its ports, for ambient air and/or soil. Nodes talk to a PheNode up to 1 km away.">
                <Counter label="Wireless nodes" value={config.nodes} min={1} max={100} step={config.nodes >= 20 ? 5 : 1} onChange={(v) => dispatch({ type: 'nodes', value: v })} big />
                <div className="mt-4 flex flex-wrap gap-2">{[1, 5, 10, 20, 50, 100].map((n) => <Option key={n} on={config.nodes === n} onClick={() => dispatch({ type: 'nodes', value: n })} small>{n}</Option>)}</div>
              </StepShell>
            )}
            {step === 4 && (
              <StepShell title="Configure your nodes." text="Set the template for every node, then select a node on the scene to override it.">
                <div className="rounded-lg border border-white/10 p-4">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone">{selected != null ? `Node ${String(selected + 1).padStart(2, '0')}` : 'All nodes (template)'}</p>
                  <SensorPicker
                    probes={selected != null ? nodeProbes(config, selected) : config.nodeTemplate.soilProbes}
                    onChange={(v) => (selected != null ? dispatch({ type: 'override', index: selected, value: { soilProbes: v } }) : dispatch({ type: 'template', value: { soilProbes: v } }))}
                  />
                  {selected != null && <div className="mt-3 flex gap-2"><button type="button" className="btn-ghost !px-3 !py-1.5 text-[13px]" onClick={() => dispatch({ type: 'applyToAll', index: selected })}>Apply to all nodes</button><button type="button" className="btn-ghost !px-3 !py-1.5 text-[13px]" onClick={() => setSelected(null)}>Back to template</button></div>}
                </div>
                <div className="mt-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone">Base-station add-ons (per base station)</p>
                  <ul className="mt-2 flex flex-col divide-y divide-white/10 border-y border-white/10">
                    {BASE_ADDON_OPTIONS.map((id) => {
                      const s = SENSOR_BY_ID[id]
                      return (
                        <li key={id} className="flex items-center justify-between gap-3 py-2.5">
                          <div><p className="text-[14px] text-paper">{s.name}</p><p className="font-mono text-[10px] tracking-[0.1em] uppercase text-stone">{SENSOR_CATEGORIES.find((c) => c.id === s.category)?.name}{s.requires ? ` · ${s.requires}` : ''}</p></div>
                          <Counter value={config.baseAddons[id] || 0} min={0} max={8} onChange={(v) => dispatch({ type: 'baseAddon', id, value: v })} compact />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </StepShell>
            )}
            {step === 5 && (
              <StepShell title="Choose software." text="Everything here is a current PheNode offering. Custom integrations are scoped with Agrela.">
                <ul className="grid gap-2">
                  {SOFTWARE_MODULES.map((m) => {
                    const on = config.software.includes(m.id)
                    return (
                      <li key={m.id}>
                        <button type="button" role="switch" aria-checked={on} onClick={() => dispatch({ type: 'software', id: m.id })} className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors ${on ? 'border-data/60 bg-data/10' : 'border-white/10 hover:border-white/30'}`}>
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${on ? 'border-data bg-data text-ink' : 'border-white/30'}`}>{on && <Check size={12} strokeWidth={3} />}</span>
                          <span><span className="block text-[14.5px] font-medium text-paper">{m.name}</span><span className="block text-[13px] text-paper/65">{m.text}</span></span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </StepShell>
            )}
            {step === 6 && (
              <div>
                <h2 className="display-md mt-3">Your PheNode system.</h2>
                <p className="mt-2 font-mono text-[11px] tracking-[0.14em] uppercase text-stone">Reference {ref} · {summary.application} · {summary.scale}</p>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6">
                  {[
                    [summary.bases, summary.bases === 1 ? 'Base station' : 'Base stations'],
                    [summary.nodes, 'Wireless sensor nodes'],
                    [summary.soilSensors, 'Soil sensors'],
                    [summary.airLightSensors, 'Air / light sensor sets'],
                    ...(summary.waterPotential ? [[summary.waterPotential, 'Water potential sensors']] : []),
                    ...(summary.profileProbes ? [[summary.profileProbes, 'Soil profile probes']] : []),
                    ...(summary.customSensors ? [[summary.customSensors, 'Third-party sensor ports']] : []),
                    [summary.imagers, summary.imagers === 1 ? 'Imager' : 'Imagers'],
                  ].map(([v, k]) => (
                    <div key={k}><dt className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-stone">{k}</dt><dd className="stat-xl !text-[clamp(2.2rem,4vw,3.5rem)] text-paper">{v}</dd></div>
                  ))}
                </dl>
                <div className="mt-6 grid gap-2 border-t border-white/10 pt-6 sm:grid-cols-2">
                  {[['API access', summary.apiEnabled], ['Dockerized backend', summary.backendEnabled], ['Connectivity', summary.connectivity === 'wifi' ? 'Wi-Fi' : 'Cellular'], ['Mounting', summary.tower ? 'Tower' : 'Post / pole']].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2"><span className="text-[13.5px] text-paper/80">{k}</span><span className={`font-mono text-[11px] tracking-[0.12em] uppercase ${v === true ? 'text-data' : v === false ? 'text-stone' : 'text-paper'}`}>{v === true ? 'Enabled' : v === false ? 'Not included' : v}</span></div>
                  ))}
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-stone">Measures: {summary.measurements.join(', ')}.</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-stone">Software: {summary.software.map((m) => m.name).join(', ')}.</p>
                {config.notes && <p className="mt-3 rounded-md border-l-2 border-signal pl-3 text-[13px] text-paper/80">{config.notes}</p>}
                <div className="mt-6 flex flex-wrap gap-2">
                  <button type="button" className="btn-primary" onClick={() => setShowForm((v) => !v)}>Talk to Agrela about this system <ArrowRight size={16} /></button>
                  <button type="button" className="btn-ghost" onClick={save}><Save size={15} /> {saved ? 'Saved' : 'Save configuration'}</button>
                  <button type="button" className="btn-ghost" onClick={share}><Share2 size={15} /> Copy link</button>
                </div>
                <p className="mt-3 text-[12px] text-stone">Saving stores the configuration in this browser and in the page link. This is guidance for a conversation with Agrela — not a quote or an engineering guarantee.</p>
                <AnimatePresence>
                  {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <div className="mt-6 rounded-xl border border-white/10 bg-ink-2 p-5 md:p-6">
                        <p className="eyebrow mb-4">Send this configuration to Agrela</p>
                        <LeadForm attachment={attachment} intent="configuration" compact submitLabel="Send to Agrela" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step < 6 && (
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <button type="button" onClick={back} disabled={step === 0} className="btn-ghost !px-4 disabled:opacity-30"><ArrowLeft size={15} /> Back</button>
                <button type="button" onClick={next} disabled={!canNext} className="btn-primary disabled:opacity-40">{step === 5 ? 'Review your system' : 'Continue'} <ArrowRight size={15} /></button>
              </div>
            )}
            {step === 6 && (
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <button type="button" onClick={back} className="btn-ghost !px-4"><ArrowLeft size={15} /> Adjust</button>
                <button type="button" onClick={() => { dispatch({ type: 'reset' }); setStep(0); setShowForm(false); setParams((p) => { p.delete('c'); return p }, { replace: true }) }} className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone hover:text-paper">Start over</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="mt-6 text-[12.5px] text-stone">Prefer a conversation? <Link to="/contact" className="text-paper underline underline-offset-4">Talk to Agrela</Link> or <Link to="/design-your-system?mode=guided" className="text-paper underline underline-offset-4">answer four questions</Link> instead.</p>
      </div>
    </div>
  )
}

function StepShell({ title, text, children }) {
  return (
    <div>
      <h2 className="display-md mt-3">{title}</h2>
      <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-paper/70">{text}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function Option({ on, onClick, children, small = false }) {
  return (
    <li className="list-none">
      <button type="button" aria-pressed={on} onClick={onClick} className={`w-full rounded-lg border text-left transition-colors ${small ? 'px-3.5 py-2 text-[13.5px]' : 'px-4 py-3.5 text-[14.5px]'} ${on ? 'border-paper bg-paper text-ink' : 'border-white/15 text-paper/85 hover:border-white/40'}`}>{children}</button>
    </li>
  )
}

function Counter({ label, value, min = 0, max = 100, step = 1, onChange, big = false, compact = false }) {
  const dec = () => onChange(Math.max(min, value - (value > 20 && step > 1 ? step : 1)))
  const inc = () => onChange(Math.min(max, value + (value >= 20 && step > 1 ? step : 1)))
  const size = compact ? 'h-8 w-8' : 'h-11 w-11'
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-4'}`}>
      <button type="button" aria-label={`Fewer ${label || ''}`} onClick={dec} className={`${size} flex items-center justify-center rounded-full border border-white/20 hover:border-white/50`}><Minus size={compact ? 13 : 16} /></button>
      <div className={`${compact ? 'w-8' : big ? 'w-[140px]' : 'w-[90px]'} text-center`}>
        <input type="number" aria-label={label} value={value} min={min} max={max} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))} className={`w-full bg-transparent text-center font-semibold tracking-tight text-paper outline-none ${compact ? 'text-[15px]' : big ? 'text-[44px] leading-none' : 'text-[26px]'}`} />
        {label && !compact && <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-stone">{label}</p>}
      </div>
      <button type="button" aria-label={`More ${label || ''}`} onClick={inc} className={`${size} flex items-center justify-center rounded-full border border-white/20 hover:border-white/50`}><Plus size={compact ? 13 : 16} /></button>
    </div>
  )
}

function SensorPicker({ probes, onChange }) {
  const cats = [
    { id: 'soil', name: 'Soil', items: [{ id: 'soil-standard', name: 'Standard soil sensor', note: 'Moisture · temperature · EC', max: 2 }] },
    { id: 'weather', name: 'Weather', items: [{ id: 'ws-air', name: 'Ambient air sensor', note: 'Uses a sensor port · T / RH / pressure · ask Agrela' }] },
    { id: 'plant', name: 'Plant & light', items: [{ id: 'ws-lux', name: 'Light intensity', note: 'Built in · lux / daylength', builtIn: true }] },
    { id: 'water', name: 'Water', items: [{ id: 'water-potential', name: 'Water potential', note: 'Base station only — add in base-station add-ons', disabled: true }] },
    { id: 'custom', name: 'Custom / third-party', items: [{ id: 'custom', name: 'SDI-12 / RS-485', note: 'Base station only — add in base-station add-ons', disabled: true }] },
  ]
  return (
    <div className="mt-3 flex flex-col gap-3">
      {cats.map((c) => (
        <div key={c.id}>
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone">{c.name}</p>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {c.items.map((it) => (
              <li key={it.id} className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 ${it.builtIn ? 'border-data/30 bg-data/5' : it.disabled ? 'border-white/10 opacity-60' : 'border-white/15'}`}>
                <div><p className="text-[13.5px] text-paper">{it.name}</p><p className="font-mono text-[10px] tracking-[0.08em] text-stone">{it.note}</p></div>
                {it.builtIn && <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-data">Included</span>}
                {it.max && (
                  <div className="flex gap-1">{[0, 1, 2].map((n) => <button key={n} type="button" aria-pressed={probes === n} onClick={() => onChange(n)} className={`h-8 w-8 rounded-md border font-mono text-[12px] ${probes === n ? 'border-signal bg-signal text-ink' : 'border-white/15 text-paper/80 hover:border-white/40'}`}>{n}</button>)}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
