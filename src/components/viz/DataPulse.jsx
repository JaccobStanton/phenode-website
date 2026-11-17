import { useId } from 'react'
import { useReducedMotion } from '../../lib/motion.js'

/**
 * DataPulse — a dot travelling along an SVG path with a soft trail. Pure SVG (animateMotion), no JS per frame.
 * Place inside an <svg>. `d` is the path; `color` amber for physical readings, cyan for digital packets.
 * `switchAt` (0..1) optionally changes color mid-path to show a reading becoming data.
 */
export default function DataPulse({ d, color = 'var(--color-signal)', toColor, dur = 3, delay = 0, r = 3, trail = true, repeat = 'indefinite', showPath = true, pathOpacity = 0.25, dash }) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  return (
    <g>
      {showPath && <path d={d} fill="none" stroke="currentColor" strokeOpacity={pathOpacity} strokeWidth={1} strokeDasharray={dash} />}
      {!reduced && (
        <>
          {trail && (
            <circle r={r * 2.4} fill={color} opacity="0">
              <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount={repeat} path={d} />
              <animate attributeName="opacity" to="0.18" dur="0.01s" begin={`${delay}s`} fill="freeze" />
              {toColor && <animate attributeName="fill" values={`${color};${color};${toColor};${toColor}`} keyTimes="0;0.5;0.55;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount={repeat} />}
            </circle>
          )}
          <circle r={r} fill={color} id={id} opacity="0">
            <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount={repeat} path={d} />
            <animate attributeName="opacity" to="1" dur="0.01s" begin={`${delay}s`} fill="freeze" />
            {toColor && <animate attributeName="fill" values={`${color};${color};${toColor};${toColor}`} keyTimes="0;0.5;0.55;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount={repeat} />}
          </circle>
        </>
      )}
    </g>
  )
}

