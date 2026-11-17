import { JOURNEY, journeyArt } from './DataJourney.jsx'

// Visual weight per illustration inside the stage box: the probe and the node are single parts,
// so they sit a little smaller than the full base station and the software views.
const FIT = { sensors: 0.84, node: 0.88 }
// The base station drawing (Jake's "Diagnostics Wireframe-web.svg" since Nov 17, the app's diagnostics wireframe redrawn)
// is mostly dark navy line work: lifted so it reads on the dark blue page. Its cyan lights stay cyan.
const LIFT = { base: 'brightness(1.45) saturate(1.1)' }

/**
 * The data journey's "now" panel: the illustration for the active stop crossfades in (opacity + a small drift,
 * compositor-only) with the stop's label and note underneath. All eight images are mounted up front so a
 * change of stop never waits on a download.
 */
export default function JourneyStage({ active, className = '' }) {
  const s = JOURNEY[active]
  const n = JOURNEY.length
  const physical = active <= 2
  const pad = (v) => String(v).padStart(2, '0')
  return (
    <figure className={className} data-stage={s.id}>
      <div className="journey-stage relative">
        {JOURNEY.map((st, i) => {
          const on = i === active
          return (
            <img
              key={st.id}
              src={journeyArt(st.id)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              draggable="false"
              className="journey-art absolute inset-0 h-full w-full object-contain"
              data-on={on ? '' : undefined}
              style={{ transform: `translate3d(0, ${on ? 0 : i < active ? -14 : 14}px, 0) scale(${FIT[st.id] ?? 1})`, filter: LIFT[st.id] }}
            />
          )
        })}
      </div>
      <figcaption className="journey-caption-wrap border-t hairline">
        <p className="eyebrow flex items-center gap-3">
          <span className="tabular-nums">{pad(active + 1)} / {pad(n)}</span>
          <span className="h-px w-6 bg-current opacity-40" aria-hidden="true" />
          <span className={physical ? 'text-signal' : 'text-data'}>{physical ? 'Physical' : 'Digital'}</span>
        </p>
        {/* keyed so each stop's text eases in */}
        <div key={s.id} className="journey-caption">
          <p className="mt-2 text-[22px] font-semibold tracking-tight">{s.label}</p>
          <p className="journey-note mt-1.5 max-w-[46ch] text-[15px] leading-relaxed text-[color:var(--fg-muted)]">{s.note}</p>
        </div>
      </figcaption>
    </figure>
  )
}
