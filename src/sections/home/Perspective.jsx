import { useMemo, useRef, useSyncExternalStore } from 'react'
import {
  ArrowDown, Bird, Building2, Cable, ChartSpline, Check, ClipboardList, CloudSun, Cpu, Database, Droplets, Ellipsis,
  FlaskConical, Flame, Gauge, LayoutDashboard, Leaf, Lightbulb, MapPin, Microscope, Mountain, Radar, RotateCcw, Route,
  Shovel, Sprout, ThermometerSun, TreePine, Wheat,
} from 'lucide-react'
import { Section, Container, Button, Tag } from '../../components/ui/primitives.jsx'
import SentenceSelect from '../../components/ui/SentenceSelect.jsx'
import ExplorerScene from '../../components/viz/ExplorerScene.jsx'
import MiniChart, { Legend } from '../../components/viz/MiniChart.jsx'
import { ROLES, ROLE_GROUPS, NEEDS, APPLICATION_BY_ID } from '../../data/applications.js'
import { SENSOR_BY_ID } from '../../data/sensors.js'
import { usePersonalization } from '../../context/PersonalizationContext.jsx'
import { diurnalSeries, soilMoistureSeries } from '../../lib/demoData.js'
import { useReveal, useReducedMotion } from '../../lib/motion.js'
import { FEATURES } from '../../data/features.js'
import { homeNo } from '../../data/homeSections.js'

/*
 * Home 05: Choose your perspective. One sentence the visitor completes:
 * "I'm a [role] and I need to understand [question]." Below it, the answer is always on screen: a demo deployment
 * with its readings, and the suggested starting point for that question.
 * The role is what personalizes the page (application chapter order, the final call to action, the Applications
 * page). Until a role is picked the sentence shows an example and nothing is reordered.
 */

const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]))
const NEED_BY_ID = Object.fromEntries(NEEDS.map((n) => [n.id, n]))
const EXAMPLE_ROLE = 'agronomist'

const ROLE_ICONS = {
  agronomist: Sprout, breeder: FlaskConical, ecologist: Bird, restoration: Shovel, 'environmental-scientist': Microscope,
  infrastructure: Route, planner: Building2, fire: Flame, 'data-scientist': ChartSpline, 'program-manager': ClipboardList,
  engineer: Cpu, other: Ellipsis,
}
const NEED_ICONS = {
  'environmental-intelligence': Radar, soil: Droplets, 'fire-weather': Flame, 'urban-heat': ThermometerSun,
  'ag-microclimate': Wheat, roadside: Route, restoration: Leaf, 'crop-research': FlaskConical, ecological: TreePine,
  'weather-networks': CloudSun, custom: Cable,
}

const ROLE_OPTIONS = ROLE_GROUPS.map((g) => ({
  id: g.id, label: g.label,
  options: ROLES.filter((r) => r.group === g.id).map((r) => ({ id: r.id, label: r.name, icon: ROLE_ICONS[r.id] })),
}))
const needOption = (n) => ({ id: n.id, label: n.phrase.charAt(0).toUpperCase() + n.phrase.slice(1), icon: NEED_ICONS[n.id] })
/** The role's own questions first, then the rest. `picked`: the visitor chose the role (not the example). */
function needGroups(role, picked) {
  if (!role.needs.length) return [{ id: 'all', label: 'Questions', options: NEEDS.map(needOption) }]
  return [
    { id: 'suggested', label: picked ? 'Suggested for you' : `Suggested for ${role.plural}`, options: role.needs.map((id) => needOption(NEED_BY_ID[id])) },
    { id: 'more', label: 'More questions', options: NEEDS.filter((n) => !role.needs.includes(n.id)).map(needOption) },
  ]
}

const NODES = { field: 8, corridor: 10, city: 14, ecosystem: 8 }
// Phones get a narrower chart drawing, so its axis labels stay a readable size
const PHONE = '(max-width: 639px)'
const onPhoneChange = (cb) => { const m = window.matchMedia(PHONE); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) }
const usePhone = () => useSyncExternalStore(onPhoneChange, () => window.matchMedia(PHONE).matches, () => false)
/** "Air temperature, Relative humidity" → "Air temperature, relative humidity" (acronyms such as RGB stay as they are) */
const sentenceCase = (s) => s.replace(/, ([A-Z])(?=[a-z])/g, (_, c) => `, ${c.toLowerCase()}`)
const SCENE_NAME = { field: 'Research field', corridor: 'Roadside corridor', city: 'City blocks', ecosystem: 'Grassland and wetland' }
const SPREAD = { field: 'across the field', corridor: 'along the corridor', city: 'across the city', ecosystem: 'across the site' }

// Node labels in the scene, matching what the chart plots
const TEMP = (i) => `${(21 + ((i * 37) % 60) / 10).toFixed(1)}°`
const VWC = (i) => `${24 + ((i * 7) % 13)}%`
const RH = (i) => `${17 + ((i * 11) % 16)}%`

/** What the demo chart plots for a question: two nodes, so the difference between places is the point. */
function chartFor(need) {
  if (need.id === 'soil' || need.id === 'restoration' || need.id === 'roadside') return {
    label: 'Soil moisture', unit: '%', value: VWC,
    series: [
      { name: 'Soil VWC % · node 03', data: soilMoistureSeries({ seed: 5, days: 7, start: 34 }), color: 'var(--color-data)' },
      { name: 'Soil VWC % · node 07', data: soilMoistureSeries({ seed: 12, days: 7, start: 26, rainGain: 6, dryRate: 0.05 }), color: 'var(--color-signal)' },
    ],
  }
  if (need.id === 'fire-weather') return {
    label: 'Relative humidity', unit: '%', value: RH,
    series: [
      { name: 'RH % · ridge', data: diurnalSeries({ seed: 4, base: 28, amp: 12, phase: 5 }), color: 'var(--color-signal)' },
      { name: 'RH % · valley', data: diurnalSeries({ seed: 8, base: 41, amp: 14, phase: 5 }), color: 'var(--color-data)' },
    ],
  }
  if (need.id === 'urban-heat') return {
    label: 'Air temperature', unit: '°', value: TEMP,
    series: [
      { name: 'Air temp °C · paved block', data: diurnalSeries({ seed: 2, base: 29, amp: 6.5 }), color: 'var(--color-signal)' },
      { name: 'Air temp °C · park', data: diurnalSeries({ seed: 9, base: 24.5, amp: 5 }), color: 'var(--color-data)' },
    ],
  }
  return {
    label: 'Air temperature', unit: '°', value: TEMP,
    series: [
      { name: 'Air temp °C · node 04', data: diurnalSeries({ seed: 2, base: 24, amp: 6 }), color: 'var(--color-signal)' },
      { name: 'Air temp °C · node 11', data: diurnalSeries({ seed: 9, base: 21.5, amp: 5 }), color: 'var(--color-data)' },
    ],
  }
}

export default function Perspective() {
  const { role, setRoleId, need: pickedNeed, setNeedId } = usePersonalization()
  const shown = role || ROLE_BY_ID[EXAMPLE_ROLE]
  const need = pickedNeed || NEED_BY_ID[shown.needs[0] || 'environmental-intelligence']
  const sentence = useRef(null)
  const reveal = useReveal()
  const reduced = useReducedMotion()

  const pickRole = (id) => {
    const next = ROLE_BY_ID[id]
    setRoleId(id)
    // keep a question the visitor picked if it suits the new role too; otherwise show the role's first question
    if (pickedNeed && next.needs.length && !next.needs.includes(pickedNeed.id)) setNeedId(null)
  }
  const reset = () => {
    setRoleId(null); setNeedId(null)
    // the Reset button goes away with the role: keyboard focus moves to the role word instead of falling to the page
    requestAnimationFrame(() => sentence.current?.querySelector('[role="combobox"]')?.focus())
  }
  const first = role ? APPLICATION_BY_ID[role.order[0]] : null

  const seeApplications = () => {
    const el = document.getElementById('applications')
    if (!el) return
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    const h = el.querySelector('h2')
    if (h) { h.setAttribute('tabindex', '-1'); h.setAttribute('data-focus-target', ''); h.focus({ preventScroll: true }) }
  }

  return (
    <Section id="perspective" theme="ink" className="border-t border-white/10">
      <Container>
        <div ref={reveal}>
          <h2 className="eyebrow reveal flex items-center gap-3">
            <span aria-hidden="true">{homeNo('perspective')}</span><span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />Choose your perspective
          </h2>

          {/* The sentence: each clause on its own line from tablets up */}
          <div ref={sentence} className="sentence-xl reveal relative z-20 mt-6 md:mt-8">
            I’m {shown.lead}{' '}
            <SentenceSelect label="Your role" value={shown.id} text={shown.noun} groups={ROLE_OPTIONS} onChange={pickRole} anchorRef={sentence} />
            <span className="md:block"> and I need to understand</span>{' '}
            <span className="md:block">
              <SentenceSelect label="What you need to understand" value={need.id} text={need.phrase} groups={needGroups(shown, Boolean(role))} onChange={setNeedId} anchorRef={sentence} />.
            </span>
          </div>

          {/* What the choice does, said where it is made */}
          <div className="reveal mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] leading-snug text-stone md:mt-9">
            <p aria-live="polite" className="flex items-start gap-2">
              {first ? (
                <>
                  <Check size={16} strokeWidth={2.4} aria-hidden="true" className="mt-0.5 shrink-0 text-phenode-green" />
                  <span>Applications below now start with <span className="text-paper">{first.kicker}</span>.</span>
                </>
              ) : (
                <span>An example to start. Pick your role and the rest of this page reorders around the work you do.</span>
              )}
            </p>
            {first && (
              <span className="flex items-center gap-5">
                <button type="button" onClick={seeApplications} className="inline-flex items-center gap-1.5 text-phenode-blue-light underline-offset-4 hover:underline">See them<ArrowDown size={14} aria-hidden="true" /></button>
                <button type="button" onClick={reset} aria-label="Reset your role and question" className="inline-flex items-center gap-1.5 transition-colors hover:text-paper"><RotateCcw size={13} aria-hidden="true" />Reset</button>
              </span>
            )}
          </div>

          <div className="reveal relative z-10 mt-10 overflow-hidden rounded-xl border border-white/10 bg-ink-2 md:mt-14">
            <div className="grid lg:grid-cols-12">
              <Deployment need={need} />
              <StartingPoint need={need} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/** Left: the question as a demo deployment, with two nodes' readings over a week. */
function Deployment({ need }) {
  const chart = useMemo(() => chartFor(need), [need])
  const count = NODES[need.scene] ?? 8
  const phone = usePhone()
  return (
    <div className="flex min-w-0 flex-col lg:col-span-7 lg:border-r lg:border-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <p className="flex min-w-0 items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/80">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-phenode-green shadow-[0_0_8px_var(--color-phenode-green)]" />
          <span className="truncate">{SCENE_NAME[need.scene]}</span>
        </p>
        <Tag>Demo data</Tag>
      </div>
      <div key={need.id} className="persp-fade">
        <ExplorerScene
          kind={need.scene}
          count={count}
          heat={0.9}
          crop={30}
          className="text-paper"
          formatValue={chart.value}
          label={`${SCENE_NAME[need.scene]} with a PheNode base station and ${count} wireless nodes, each labelled with its latest reading (demo data)`}
        />
        <div className="border-t border-white/10 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <Legend series={chart.series} />
            <Tag className="shrink-0">Demo data</Tag>
          </div>
          <MiniChart series={chart.series} width={phone ? 340 : 600} height={phone ? 170 : 130} className="mt-3 text-paper" unit={chart.unit} yLabel={chart.label} />
        </div>
      </div>
    </div>
  )
}

/** Right: the suggested starting point, step by step, ending in the insight it gives and (while the design page is on) the way into the configurator. */
function StartingPoint({ need }) {
  const app = APPLICATION_BY_ID[need.app]
  const sensors = [...new Map(need.sensors.map((id) => SENSOR_BY_ID[id]).filter(Boolean).map((s) => [s.id, s])).values()]
  const steps = [
    [Mountain, 'Environment', app.kicker],
    [MapPin, 'Deployment', `1 PheNode base station · ${NODES[need.scene] ?? 8} wireless nodes ${SPREAD[need.scene]}`],
    [Gauge, 'Sensors', (
      <ul className="flex flex-wrap gap-1.5" aria-label="Sensors">
        {sensors.map((s) => <li key={s.id} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[13px] text-paper/85">{s.short}</li>)}
      </ul>
    )],
    [Database, 'Data collected', sentenceCase([...new Set(sensors.flatMap((s) => s.measures))].slice(0, 5).join(', '))],
    [LayoutDashboard, 'Software', 'Dashboard, wireless network view, downloads with cleaning preferences, API'],
  ]
  return (
    <div className="flex p-6 sm:p-8 lg:col-span-5">
      <div key={need.id} className="persp-fade flex w-full flex-col">
        <p className="eyebrow">Your starting point</p>
        <h3 className="display-sm mt-2">{need.name}</h3>
        <ol className="relative mt-7">
          {/* the rail the steps hang from */}
          <span aria-hidden="true" className="absolute bottom-5 left-[13.5px] top-5 w-px bg-gradient-to-b from-phenode-blue/60 to-white/10" />
          {steps.map(([Icon, k, v]) => (
            <li key={k} className="relative grid grid-cols-[28px_1fr] gap-4 pb-6 last:pb-0">
              <span className="relative grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-ink-2 text-phenode-blue-light">
                <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone">{k}</p>
                <div className="mt-1 text-[14.5px] leading-snug text-paper/90">{v}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-lg border border-phenode-blue/35 bg-phenode-blue/[0.09] p-4 sm:p-5">
          <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-phenode-blue-light">
            <Lightbulb size={14} aria-hidden="true" />Example insight
          </p>
          <p className="mt-2 text-[16.5px] font-medium leading-snug text-paper">{need.insight}</p>
        </div>
        <div className="mt-auto pt-8">
          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
          {FEATURES.designSystem && <Button to={`/design-your-system?need=${need.id}`} variant="primary">Start with this configuration</Button>}
          <Button to={app.route} variant={FEATURES.designSystem ? 'ghost' : 'primary'} icon={FEATURES.designSystem ? null : 'arrow'}>Read the application</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
