import { useEffect, useRef, useState } from 'react'
import { Img } from '../ui/primitives.jsx'
import { useReducedMotion } from '../../lib/motion.js'

/**
 * Real PheNode software screenshots, captured from phenode.live on 7 Oct 2026 at a 1440 × 900 browser size (2× pixel density)
 * and exported as WebP at 1200 / 2400 (1200 × 750 / 2400 × 1500). Site, sensor and account names are replaced with neutral
 * labels ("Research Field 02", "University Plot 03", "team@example.org"); every reading, chart and image is real.
 * The precipitation-* views were captured the same way on 27 Oct 2026, from the Precipitation page before its
 * production release (staging responses recorded that morning, other sites as "Field Site NN").
 * Keys match public/assets/software/<key>-<w>.webp. Captions describe the view, not results.
 */
export const SCREENS = {
  'fleet-overview': { label: 'Fleet overview', alt: 'PheNode software, Your Fleet view: PheNode sites listed with health status, temperature, today’s rainfall, wind speed and battery for each.' },
  'base-station': { label: 'Base station', alt: 'PheNode software, Base Station Measurements: current air temperature, today’s rainfall and wind speed on large dials, above the first charts of the last seven days.' },
  'base-station-charts': { label: 'Base station measurements', alt: 'PheNode software, base station Measurements Over Time for the last seven days: ambient temperature, rainfall, wind speed, relative humidity, air pressure, wind gust, growing degree days and wind direction.' },
  'measurement-categories': { label: 'Measurement categories', alt: 'PheNode software, base station charts with the category menu open: environment, light, soil, power and device, or all.' },
  imaging: { label: 'Imaging', alt: 'PheNode software, Imaging view: a photo from the base station imager of a grassy hillside with wildflowers and trees under a blue sky.' },
  'system-diagnostics': { label: 'System diagnostics', alt: 'PheNode software, Diagnostics view: a drawing of the base station with 27 wireless sensors connected, cellular signal, battery charge, internal temperature and the status of each sensor — rainfall, camera, solar radiation, soil, air and light, wind.' },
  'wireless-fleet-overview': { label: 'Wireless fleet', alt: 'PheNode software, wireless Fleet Overview: the wireless sensors connected to one PheNode, each with health status, soil moisture, soil temperature, signal strength and battery.' },
  'sensor-map': { label: 'Sensor map', alt: 'PheNode software, Sensor Overview on a satellite map: a cluster of wireless sensors across field plots, the selected sensor and the PheNode they report to.' },
  'wireless-sensor-measurements': { label: 'Wireless sensor measurements', alt: 'PheNode software, Wireless Sensor Measurements: a wireless node with its sensor information, then seven days of soil moisture, soil temperature and electrical conductivity from two probes.' },
  'multi-sensor-overlay': { label: 'Multi-sensor overlay', alt: 'PheNode software, Multi Sensor Comparative Overlay: soil moisture from four wireless sensors and both of their probes on one chart over seven days, rising at different times and by different amounts.' },
  'dual-comparison': { label: 'Dual measurement comparison', alt: 'PheNode software, Dual Measurement Comparison: seven days of air temperature and relative humidity at one base station on a shared timeline, with left and right axes.' },
  'data-downloads': { label: 'Data downloads', alt: 'PheNode software, Data Downloads: a date range, the download type, a PheNode and four of its wireless sensors selected, with a download summary.' },
  'precipitation-overview': { label: 'Precipitation', alt: 'PheNode software, Precipitation overview: today’s rainfall from the unit’s own gauge hour by hour, with the hours not reported yet striped, beside the National Weather Service forecast for the next seven days.' },
  'precipitation-storms': { label: 'Storm events', alt: 'PheNode software, Precipitation overview further down: rainfall at the nearest PheNodes today and over seven days, this month’s three storms with their peak intensity and how far soil moisture rose, and the radar map with the fleet’s pins.' },
  'precipitation-season': { label: 'Season vs normal', alt: 'PheNode software, Precipitation season view: rain since April 1 against the 1991–2020 normal month by month, 119% of normal so far, beside the county’s US Drought Monitor category for the last eight weeks.' },
  'precipitation-unit-check': { label: 'Rain gauge check', alt: 'PheNode software, Gauge Check: in September this unit’s rain gauge caught 78% of the rain at the middle of three nearby official gauges, with what to check, both gauges’ running totals over the month and the radar estimate as further evidence.' },
}
export const SCREEN_RATIO = '8 / 5'

/** Phone captures (390 × 844 browser size, 2×), exported at 390 / 780 wide. */
export const PHONE_SCREENS = {
  'mobile-fleet': { label: 'Fleet on a phone', alt: 'PheNode software in a phone browser: Your Fleet, with each PheNode’s health status and the time of its last measurements.' },
  'mobile-base-station': { label: 'Base station on a phone', alt: 'PheNode software in a phone browser: a base station’s current air temperature and humidity, with the measurement controls below.' },
}
export const PHONE_RATIO = '390 / 844'

/** A phone capture sized to its native ratio. Use inside DeviceFrame kind="phone" aspect={PHONE_RATIO}. */
export function PhoneScreen({ id, sizes = '(min-width:768px) 280px, 60vw', className = '' }) {
  const s = PHONE_SCREENS[id]
  return <Img name={`software/${id}`} widths={[390, 780]} sizes={sizes} alt={s.alt} loading="lazy" className={`block h-full w-full object-cover object-top ${className}`} />
}

/** A screenshot sized to its native ratio. Use inside DeviceFrame (aspect={SCREEN_RATIO}) or on its own. */
export function Screen({ id, sizes = '(min-width:1024px) 70vw, 96vw', className = '', eager = false }) {
  const s = SCREENS[id]
  return <Img name={`software/${id}`} widths={[1200, 2400]} sizes={sizes} alt={s.alt} loading={eager ? 'eager' : 'lazy'} className={`block h-full w-full object-cover object-top ${className}`} />
}

/** Screenshot in a thin browser-window chrome — lighter than the monitor frame, for grids and figures. */
export function ScreenCard({ id, caption, sizes, className = '', tone = 'ink' }) {
  const s = SCREENS[id]
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#061127] shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#0b1a33] px-3 py-2" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <div style={{ aspectRatio: SCREEN_RATIO }}><Screen id={id} sizes={sizes} /></div>
      </div>
      <figcaption className={`mt-3 font-mono text-[11px] tracking-[0.12em] uppercase ${tone === 'ink' ? 'text-stone' : 'text-stone-2'}`}>{caption ?? s.label}</figcaption>
    </figure>
  )
}

/**
 * Muted, inline, looping screen recording. The poster and the video load a screen before it's reached (the poster used
 * to load with the page: ~80 KB each on the home and PheNode pages, Nov 17); it plays while in view, pauses off-screen.
 * Under reduced motion it stays on the poster frame and offers a play control instead of autoplaying.
 */
export function LoopVideo({ name, poster, label, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined')
  const [playing, setPlaying] = useState(false)
  const base = `${import.meta.env.BASE_URL}assets/video/`

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const nearby = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); nearby.disconnect() } }, { rootMargin: '100% 0px' })
    nearby.observe(el)
    const inView = reduced ? null : new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.25) el.play?.().catch(() => {})
      else el.pause?.()
    }, { threshold: [0, 0.25, 0.6] })
    inView?.observe(el)
    return () => { nearby.disconnect(); inView?.disconnect() }
  }, [reduced])

  return (
    <div className={`relative h-full w-full ${className}`}>
      <video
        ref={ref} muted loop playsInline preload="none" aria-label={label}
        poster={near ? `${base}${poster}` : undefined}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        className="block h-full w-full object-cover object-top"
      >
        {near && <source src={`${base}${name}.webm`} type="video/webm" />}
        {near && <source src={`${base}${name}.mp4`} type="video/mp4" />}
      </video>
      {reduced && (
        <button type="button" onClick={() => (playing ? ref.current.pause() : ref.current.play())} className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-ink/80 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em] uppercase text-paper backdrop-blur hover:bg-ink">
          {playing ? 'Pause' : 'Play'} recording
        </button>
      )}
    </div>
  )
}

/**
 * Editorial photograph (photos/<name>-<w>.webp). `position` sets object-position for the crop.
 * These are scene-setting images, not deployment photos — captions must not imply a PheNode site.
 */
export function Photo({ name, alt, ratio = '21 / 9', position = '50% 50%', widths = [800, 1600, 2400], sizes = '96vw', className = '', imgClassName = '', imgStyle, children }) {
  return (
    <div className={`${className.includes('absolute') ? '' : 'relative '}overflow-hidden ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <Img name={`photos/${name}`} widths={widths} sizes={sizes} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`} style={{ objectPosition: position, ...imgStyle }} />
      {children}
    </div>
  )
}
