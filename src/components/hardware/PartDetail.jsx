import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Img } from '../ui/primitives.jsx'
import { BASE_STATION_PARTS } from '../../data/baseStationParts.js'
import { PART_DETAILS } from '../../data/partDetails.js'

/**
 * The home hero's detail view for one base-station component: what it is, what it measures and the published specs,
 * with a way back to the whole station and to the neighbouring components. The close-up of the hardware itself is
 * PartExplorer (with `selected`), beside this panel. Focus moves here when it opens; Esc and ←/→ are handled by the hero.
 */
export default function PartDetail({ id, onSelect, onClose }) {
  const n = BASE_STATION_PARTS.length
  const i = Math.max(0, BASE_STATION_PARTS.findIndex((p) => p.id === id))
  const part = BASE_STATION_PARTS[i]
  const prev = BASE_STATION_PARTS[(i - 1 + n) % n]
  const next = BASE_STATION_PARTS[(i + 1) % n]
  const d = PART_DETAILS[part.id]
  const region = useRef(null)

  useEffect(() => { region.current?.focus({ preventScroll: true }) }, [])

  return (
    <div ref={region} tabIndex={-1} data-focus-target role="region" aria-label={`${part.label}: details`} className="max-w-[540px]">
      <button type="button" onClick={onClose} className="group inline-flex items-center gap-2 rounded-md py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-stone transition-colors hover:text-phenode-blue-light">
        <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
        The whole base station
      </button>
      <span className="sr-only" aria-live="polite">{part.label}</span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={part.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          {/* the colours of the old data-path strip: amber for the hardware, cyan for its data, Agrela blue on hover */}
          <p className="eyebrow mt-8 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" /><span className="text-signal-2">{d.kicker}</span></p>
          <h2 className="display-md mt-3">{part.label}</h2>
          <p className="lede mt-5">{d.lede}</p>
          <p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-stone">{d.body}</p>

          {d.photo && (
            <figure className="mt-7 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 pr-5">
              <Img name={d.photo.name} widths={d.photo.widths} sizes="96px" alt={d.photo.alt} className="h-20 w-20 shrink-0 object-contain" />
              <figcaption className="text-[13.5px] leading-snug text-stone">{d.photo.caption}</figcaption>
            </figure>
          )}

          <dl className="mt-7 divide-y divide-white/10 border-y border-white/10">
            {d.specs.map((s) => (
              <div key={s.name} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-3">
                <dt className="pt-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-paper">{s.name}</dt>
                <dd className="text-[14.5px] leading-snug text-data">
                  {s.lead && <span className="text-stone">{s.lead} </span>}
                  {s.value}
                  {s.note && <span className="mt-0.5 block text-[13px] text-stone">{s.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button type="button" onClick={() => onSelect(prev.id)} className="group inline-flex items-center gap-2 rounded-md py-1 text-[14px] text-stone transition-colors hover:text-phenode-blue-light" aria-label={`Previous component: ${prev.label}`}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
          {prev.label}
        </button>
        <button type="button" onClick={() => onSelect(next.id)} className="group inline-flex items-center gap-2 rounded-md py-1 text-[14px] text-paper transition-colors hover:text-phenode-blue-light" aria-label={`Next component: ${next.label}`}>
          {next.label}
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}
