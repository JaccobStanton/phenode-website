import { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { ArrowDown } from 'lucide-react'
import { Button } from '../../components/ui/primitives.jsx'
import { prefersReducedMotion } from '../../lib/motion.js'
import { ScrollTrigger } from '../../lib/scroll.js'
import { mountSensorField } from '../../components/viz/sensorFieldHost.js'
import { ALWAYS_SHOW, INTRO_LANDED, WANT_REST, hasSeen, markSeen } from '../../lib/intro.js'

const IDLE_MS = 180 // a pause this long (no scrolling, no finger down) is a safe moment to remove the intro

/**
 * The home page's opening screen: "Capture Hyperlocal Environmental Intelligence" (Jake, Nov 16; was "Welcome to …")
 * over the living sensor field (components/viz/sensorField.js), with one button, "Explore PheNode", that slides the
 * visitor down to the hero.
 *
 * It belongs to the first moments of a visit only. Once the visitor reaches the hero — by the button or by scrolling —
 * the intro is removed and the scroll position moved by its height in the same frame, so nothing on screen shifts and
 * scrolling back up ends at the hero. That happens when they pause below it, start back up, or the slide lands. It is
 * then remembered for the rest of the visit (sessionStorage), so returning to the home page goes straight to the hero.
 *
 * As it scrolls away the copy recedes and the field dives toward the ground (--x, 0 → 1). Reduced motion: no word
 * reveal or dive, a still field, and the button jumps instead of sliding.
 *
 * While it's on screen the header is reduced to the logo, Sign in, Request a demo and the menu; the page tabs appear
 * once the visitor is on the hero (lib/intro.js).
 *
 * While ALWAYS_SHOW (lib/intro.js) is on, none of the removal happens: the intro is there on every visit and stays
 * above the hero.
 */
export default function IntroHero() {
  const [gone, setGone] = useState(() => !ALWAYS_SHOW && hasSeen())
  const section = useRef(null)
  const fieldHost = useRef(null)
  const copy = useRef(null)
  const explore = useRef(null)

  useLayoutEffect(() => {
    const el = section.current
    if (gone || !el || !fieldHost.current || !copy.current) return undefined
    const reduced = prefersReducedMotion()
    // the hero, just below; looked up when needed, because it arrives a moment after the intro (pages/Home.jsx) —
    // until then a screen-tall placeholder stands in for it
    const next = () => el.nextElementSibling
    const heroHere = () => { const n = next(); return !!n && !n.hasAttribute('data-rest-placeholder') }
    const root = document.documentElement

    // The header: reduced while the intro is in view, full once the visitor is on the hero (see lib/intro.js).
    const headerMode = (mode) => { if (root.dataset.intro !== mode) root.dataset.intro = mode }
    headerMode('top')
    const followHeader = () => {
      const bottom = el.getBoundingClientRect().bottom
      const head = document.querySelector('header')?.offsetHeight || 72
      if (bottom > window.innerHeight * 0.5) headerMode('top')
      else if (bottom <= head + 1) headerMode('past')
    }

    // Readings in the field keep clear of the headline and the button.
    let keep = null
    const measure = () => {
      const s = el.getBoundingClientRect(), c = copy.current.getBoundingClientRect()
      keep = { x: c.left - s.left, y: c.top - s.top, w: c.width, h: c.height }
    }
    // drawn in a worker where the browser can, so it never holds up the page (sensorFieldHost.js)
    const field = mountSensorField(fieldHost.current, { reduced, avoid: () => keep })
    const ro = new ResizeObserver(() => { measure(); field.resize() })
    ro.observe(el)
    measure()
    field.resize()

    // Animate only while it's on screen and the tab is visible.
    let inView = true
    const run = () => (inView && !document.hidden ? field.start() : field.stop())
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; run() })
    io.observe(el)
    document.addEventListener('visibilitychange', run)
    run()

    let collapsed = false, sliding = false, touching = false
    let idle = 0, frame = 0, slide = 0, lastY = window.scrollY

    const focusHero = () => {
      const heading = next()?.querySelector('h1')
      if (heading) heading.focus({ preventScroll: true })
    }

    function collapse() {
      if (collapsed || ALWAYS_SHOW) return
      collapsed = true
      markSeen()
      // Remove the intro and move the scroll position by the same amount, so the hero stays exactly where it is.
      // The browser's own scroll anchoring is paused meanwhile so it can't adjust as well.
      root.style.overflowAnchor = 'none'
      const hero = next()
      const before = hero ? hero.getBoundingClientRect().top : 0
      flushSync(() => setGone(true)) // unmounts the intro; the cleanup below stops the field and the listeners
      const after = hero ? hero.getBoundingClientRect().top : 0
      if (Math.abs(after - before) > 0.5) window.scrollTo({ top: window.scrollY + (after - before), left: 0, behavior: 'instant' })
      ScrollTrigger.refresh() // every trigger further down the page moved up
      requestAnimationFrame(() => { root.style.overflowAnchor = '' })
    }

    const passed = () => el.getBoundingClientRect().bottom <= 0.5 // the intro is entirely above the screen

    const update = () => {
      frame = 0
      if (collapsed) return
      followHeader()
      if (reduced) return
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / el.offsetHeight))
      el.style.setProperty('--x', p.toFixed(4))
      field.setExit(p)
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
      const y = window.scrollY
      const up = y < lastY
      lastY = y
      clearTimeout(idle)
      if (sliding || ALWAYS_SHOW) return
      // Heading back up from the hero: remove it now, rather than let them scroll back into it.
      if (up && passed()) { requestAnimationFrame(collapse); return }
      // Not mid-fling on the way down (a scroll jump there would stop touch momentum): wait for a pause.
      idle = setTimeout(() => { if (!touching && passed()) collapse() }, IDLE_MS)
    }
    const onTouchStart = () => { touching = true; clearTimeout(idle) }
    const onTouchEnd = () => { touching = false; onScroll() }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // "Explore PheNode": an eased slide down to the hero. Any wheel, touch or key from the visitor takes over.
    const userTakesOver = () => stopSlide()
    function stopSlide() {
      sliding = false
      delete root.dataset.introSlide
      cancelAnimationFrame(slide)
      window.removeEventListener('wheel', userTakesOver)
      window.removeEventListener('touchstart', userTakesOver)
      window.removeEventListener('keydown', userTakesOver)
    }
    const slideToHero = () => {
      const hero = next()
      if (!hero) return
      const to = hero.getBoundingClientRect().top + window.scrollY
      // landed: the hero plays its entrance now (see INTRO_LANDED in lib/intro.js)
      const land = () => { stopSlide(); collapse(); focusHero(); window.dispatchEvent(new Event(INTRO_LANDED)) }
      if (reduced) { window.scrollTo({ top: to, left: 0, behavior: 'instant' }); land(); return }
      const from = window.scrollY
      const dist = to - from
      const dur = Math.min(1500, Math.max(950, Math.abs(dist) * 1.05))
      const t0 = performance.now()
      sliding = true
      root.dataset.introSlide = '1'
      window.addEventListener('wheel', userTakesOver, { passive: true })
      window.addEventListener('touchstart', userTakesOver, { passive: true })
      window.addEventListener('keydown', userTakesOver)
      const stepSlide = (now) => {
        const k = Math.min(1, (now - t0) / dur)
        const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2 // ease in-out cubic
        window.scrollTo({ top: from + dist * e, left: 0, behavior: 'instant' })
        if (k < 1) slide = requestAnimationFrame(stepSlide)
        else land()
      }
      slide = requestAnimationFrame(stepSlide)
    }
    explore.current = () => {
      if (heroHere()) { slideToHero(); return }
      // the rest of the page isn't in yet: ask for it now, and slide as soon as the hero is in place
      window.dispatchEvent(new Event(WANT_REST))
      const t0 = performance.now()
      const wait = () => {
        if (heroHere()) slideToHero()
        else if (performance.now() - t0 < 10000) slide = requestAnimationFrame(wait)
      }
      slide = requestAnimationFrame(wait)
    }

    return () => {
      ro.disconnect()
      io.disconnect()
      field.destroy()
      document.removeEventListener('visibilitychange', run)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      stopSlide()
      clearTimeout(idle)
      cancelAnimationFrame(frame)
      explore.current = null
      delete root.dataset.intro // the full header again
    }
  }, [gone])

  if (gone) return null

  return (
    <section ref={section} className="intro theme-ink relative h-[100svh] min-h-[560px] overflow-hidden" aria-label="Welcome">
      <div aria-hidden="true" className="intro-sky pointer-events-none absolute inset-0" />
      {/* the field of points and, above it, the pings and readings: two canvases mountSensorField puts in here */}
      <div ref={fieldHost} aria-hidden="true" className="intro-field pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="intro-fade pointer-events-none absolute inset-0" />

      <div className="intro-stage relative z-10 flex h-full items-center justify-center px-5">
        <div ref={copy} className="intro-copy flex flex-col items-center text-center">
          <p className="intro-word intro-welcome" style={{ '--d': '0.35s' }}>Capture</p>
          <p className="intro-title">
            <span className="block"><span className="intro-word" style={{ '--d': '0.55s' }}><span className="intro-grad">Hyperlocal</span></span></span>
            <span className="intro-word" style={{ '--d': '0.75s' }}>Environmental</span>{' '}
            <span className="intro-word" style={{ '--d': '0.92s' }}>Intelligence</span>
          </p>
          <div className="intro-word mt-9 md:mt-11" style={{ '--d': '1.3s' }}>
            <Button variant="primary" icon={null} onClick={() => explore.current?.()}>
              Explore PheNode <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

    </section>
  )
}
