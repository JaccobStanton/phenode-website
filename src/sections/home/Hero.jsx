import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button, ButtonPair } from '../../components/ui/primitives.jsx'
import PartExplorer from '../../components/hardware/PartExplorer.jsx'
import PartDetail from '../../components/hardware/PartDetail.jsx'
import { BASE_STATION_PARTS } from '../../data/baseStationParts.js'
import { useReducedMotion } from '../../lib/motion.js'
import { INTRO_LANDED } from '../../lib/intro.js'

const GLIDE = [0.65, 0, 0.35, 1]
const OUT = [0.22, 1, 0.36, 1]

/**
 * Home hero: "Understand your environment." beside the base station, whose components are all targets.
 *
 * Choosing a component (on the render or in the strip under it) turns the hero into that component's detail view:
 * the copy slips away, the station glides over to the left and the camera moves in to the part (PartExplorer's
 * close-up), and its details arrive on the right (PartDetail). Other components pan the close-up across the hardware;
 * "The whole base station", Esc, or the strip's current item go back. ←/→ step through the components.
 */
export default function Hero() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [selected, setSelected] = useState(null)
  const section = useRef(null)
  const station = useRef(null)
  const flipFrom = useRef(null) // where the station was on screen just before the view changed
  const lastSelected = useRef(null)
  const quiet = useRef(false) // the next close is the reset below: no focus move, no scroll

  // The entrance (Jake: the text on the left, then the base station, then the buttons) plays when the visitor gets
  // here, not on the way: when the intro's "Explore PheNode" slide lands (INTRO_LANDED), once the hero fills most of
  // the screen, or when scrolling stops with a good part of it in view. Landing straight on the hero plays it at once.
  // While the intro is above it (lib/intro.js), going back up into the intro resets the hero to its overview, so the
  // entrance plays again on the way down. (The data-path strip that sat along the bottom was removed on Jake's
  // request; its colours carry on in the component details.)
  useEffect(() => {
    const el = section.current
    if (!el) return undefined
    const root = document.documentElement
    let shown = false, frame = 0, idle = 0
    const show = (v) => { if (shown !== v) { shown = v; setReady(v) } }
    const check = (settled) => {
      frame = 0
      const r = el.getBoundingClientRect(), vh = window.innerHeight
      if (shown) {
        // Back on the intro with the hero (almost) out of sight below it: set it up to play again.
        if (r.top >= vh * 0.9 && el.previousElementSibling?.classList.contains('intro')) {
          show(false)
          if (lastSelected.current) { quiet.current = true; setSelected(null) }
        }
        return
      }
      if (root.dataset.introSlide) return // the intro's slide is still carrying the page down
      const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0)
      if (r.top <= vh * 0.2 || (settled && visible >= vh * 0.4)) show(true)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => check(false))
      clearTimeout(idle)
      idle = setTimeout(() => check(true), 200)
    }
    const onLanded = () => check(true)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener(INTRO_LANDED, onLanded)
    check(true)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener(INTRO_LANDED, onLanded)
      cancelAnimationFrame(frame)
      clearTimeout(idle)
    }
  }, [])

  // Choosing a component (or going back) notes where the station is on screen first, so it can glide from there.
  const select = useCallback((id) => {
    if (station.current) flipFrom.current = station.current.getBoundingClientRect()
    setSelected(id)
  }, [])

  // The station glides between its two places (right of the copy ↔ left of the details) as a Web Animation of its
  // transform, which the browser runs off the page's main thread: it stays smooth while the close-up is being painted.
  // (It was a Motion layout animation, driven frame by frame from the main thread; on the live site, in Safari, it
  // froze for about 0.3 s after each click and then jumped, Nov 18.) A click mid-glide starts from where it is.
  useLayoutEffect(() => {
    const el = station.current, from = flipFrom.current
    flipFrom.current = null
    if (!el || !from) return
    el.getAnimations().forEach((a) => a.cancel())
    if (reduced) return
    const to = el.getBoundingClientRect()
    const dx = from.left - to.left, dy = from.top - to.top
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0px, 0px)' }], { duration: 950, easing: `cubic-bezier(${GLIDE.join(', ')})` })
  }, [selected, reduced])

  // Detail view keys: Esc goes back to the whole station, ←/→ step through the components.
  useEffect(() => {
    if (!selected) return undefined
    const onKey = (e) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) return
      const n = BASE_STATION_PARTS.length
      const i = BASE_STATION_PARTS.findIndex((p) => p.id === selected)
      if (e.key === 'Escape') select(null)
      else if (e.key === 'ArrowRight') select(BASE_STATION_PARTS[(i + 1) % n].id)
      else if (e.key === 'ArrowLeft') select(BASE_STATION_PARTS[(i - 1 + n) % n].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, select])

  // Opening or closing: on one-column layouts bring the top of the hero back under the header, and on closing return
  // focus to the component's name in the strip.
  useEffect(() => {
    const opened = Boolean(selected) && !lastSelected.current
    const closed = !selected && lastSelected.current
    const was = lastSelected.current
    lastSelected.current = selected
    const quietly = quiet.current
    quiet.current = false
    if ((!opened && !closed) || quietly) return
    if (closed) document.querySelector(`[data-part="${was}"]`)?.focus({ preventScroll: true })
    if (window.innerWidth >= 1024 || !section.current) return
    const top = section.current.getBoundingClientRect().top + window.scrollY + 24
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }, [selected, reduced])

  const rv = (t, d = 1) => (ready ? { opacity: 1, transform: 'none', transition: `opacity ${d}s ${t}s var(--ease-out-quint), transform ${d}s ${t}s var(--ease-out-quint)` } : { opacity: 0, transform: 'translateY(18px)' })

  return (
    <section ref={section} className="theme-ink grain relative flex min-h-[100svh] flex-col overflow-hidden [overflow-anchor:none]" aria-label="Understand your environment">
      {/* Atmosphere: horizon glow + faint contour lines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(80%_60%_at_60%_100%,rgba(176,137,104,0.22),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(60%_50%_at_30%_100%,rgba(95,183,201,0.10),transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.28]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
          <defs><linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" stopOpacity="1" /></linearGradient><mask id="m"><rect width="1440" height="900" fill="url(#fade)" /></mask></defs>
          <g mask="url(#m)" fill="none" stroke="rgba(244,242,236,0.22)" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M-50 ${620 + i * 34} C 300 ${600 + i * 30 + (i % 2) * 12}, 700 ${660 + i * 32}, 1100 ${610 + i * 36} S 1500 ${640 + i * 34}, 1500 ${640 + i * 34}`} />
            ))}
          </g>
        </svg>
      </div>

      <div className="container-x relative z-10 flex flex-1 flex-col justify-center pt-24 pb-10 md:pt-28 lg:pb-12">
        {/* Overview: copy | station. Detail: station close-up | the component's details. */}
        <div className={`relative grid items-center gap-10 ${selected ? 'lg:grid-cols-[minmax(0,54fr)_minmax(0,46fr)] lg:gap-14' : 'lg:grid-cols-[minmax(0,47fr)_minmax(0,53fr)] lg:gap-6'}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {!selected && (
              <motion.div
                key="copy" className="max-w-[640px]"
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0, transition: reduced ? { duration: 0 } : { duration: 0.6, delay: 0.6, ease: OUT } }}
                exit={{ opacity: 0, x: -56, transition: reduced ? { duration: 0 } : { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
              >
                <p className="eyebrow mb-6" style={rv(0.05)}>Hyperlocal environmental intelligence</p>
                <h1 id="hero-title" tabIndex={-1} data-focus-target className="hero-title" style={rv(0.15)}><span className="whitespace-nowrap">Understand your</span> environment.</h1>
                <p className="lede mt-7 max-w-[48ch]" style={rv(0.3)}>
                  PheNode is a flexible, scalable environmental monitoring platform designed to move from individual measurements to connected, usable data — configured around the question you need to answer.
                </p>
                <ButtonPair className="mt-9" style={rv(1.15)}>
                  <Button to="/phenode" variant="primary">Meet PheNode</Button>
                </ButtonPair>
              </motion.div>
            )}
          </AnimatePresence>
          {selected && <h1 className="sr-only">Understand your environment.</h1>}

          {/* The station: glides between the two columns (the Web Animation above); PartExplorer handles the close-up.
              On the way back the headline waits (0.6 s) until the station has mostly cleared its column. */}
          <div ref={station} className="relative mx-auto w-full max-w-[760px] lg:max-w-none">
            <div style={rv(0.7, 1.2)}>
              <PartExplorer selected={selected} onSelect={select} />
            </div>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            {selected && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0, transition: reduced ? { duration: 0 } : { duration: 0.6, delay: 0.9, ease: OUT } }}
                exit={{ opacity: 0, x: 48, transition: reduced ? { duration: 0 } : { duration: 0.3, ease: [0.4, 0, 1, 1] } }}
              >
                <PartDetail id={selected} onSelect={select} onClose={() => select(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </section>
  )
}
