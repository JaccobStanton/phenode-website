import { useLayoutEffect, useRef } from 'react'
import { Button, ButtonPair, Img } from '../../components/ui/primitives.jsx'
import { prefersReducedMotion, seg, easeOut, easeInOut } from '../../lib/motion.js'
import { ScrollTrigger } from '../../lib/scroll.js'
import { BASE_STATION_WIDTHS } from '../../data/baseStationParts.js'

// Phrases in [brackets] pick up a soft Agrela-blue glow as they light.
const STATEMENT = 'Hardware, communications, data and software — designed as [one solution], configured around the question [you need to answer].'
const WORDS = (() => {
  let open = false
  return STATEMENT.split(' ').map((raw) => {
    let text = raw
    if (text.startsWith('[')) { open = true; text = text.slice(1) }
    const close = text.indexOf(']')
    if (close < 0) return { text, tail: '', glow: open }
    open = false
    return { text: text.slice(0, close), tail: text.slice(close + 1), glow: true } // punctuation after "]" stays plain
  })
})()

// The phases, as [start, end] fractions of the scroll through the track.
const LINE2 = [0.08, 0.28] // "Many environments." fades up under "One system."
const LIFT = [0.32, 0.6] // both lines rise to the top and shrink
const HARDWARE = [0.48, 0.76] // the base station rises in
const NODE = [0.58, 0.84] // the wireless node follows a beat later, sliding in from the lower left
const BUTTONS = [0.76, 0.88] // the buttons arrive; the sequence is finished at BUTTONS[1]
const IDLE_MS = 180 // a pause this long (no scrolling, no finger on the screen) is a safe moment to shorten the track

/**
 * PheNode overview hero, in the manner of Apple's product pages: a pinned, scroll-driven reveal on a dark stage.
 *
 *   1. "One system." alone, large and centered (fades in on load).
 *   2. Scrolling brings in "Many environments." beneath it.
 *   3. Both lines lift to the top of the screen and shrink while the base station rises into the light, with the
 *      wireless node following a beat later.
 *   4. The buttons arrive; the composition holds, then the page scrolls on to the intro statement, which brightens word
 *      by word as it is read (and stays lit), its two key phrases picking up an Agrela-blue glow.
 *
 * The stage is `position: sticky` inside a 280svh track. Scroll progress through the track is mapped to eased phase
 * values (--t1 … --t4) written straight onto the stage, and the CSS in index.css (.seq-*) turns them into transforms
 * and opacity — no React re-renders while scrolling. The layout values the motion needs (where the headline ends up,
 * how far it shrinks, how much room the hardware gets) are measured here on resize.
 *
 * It plays once. When the buttons are in, the finished composition is latched, so scrolling back up never rewinds it.
 * The track is then shortened to the stage's own height, with the scroll position moved by the same amount so nothing
 * on screen shifts, and from then on the hero scrolls like a normal section (no stretch of scrolling where the finished
 * stage just sits pinned). That happens at the first safe moment: when the visitor pauses after scrolling past the
 * hero, or as soon as they start back up into it. It isn't done mid-fling on the way down, because a scroll jump there
 * would stop momentum scrolling on touch screens.
 *
 * Reduced motion: no pinning, the finished composition is shown.
 */
export default function OverviewHero() {
  const track = useRef(null)
  const stage = useRef(null)
  const title = useRef(null)
  const line2 = useRef(null)
  const cta = useRef(null)
  const statement = useRef(null)

  useLayoutEffect(() => {
    const st = stage.current
    const tr = track.current
    if (!st || !tr || !title.current) return undefined
    const set = (name, value) => st.style.setProperty(name, value)

    // Layout: the headline's final place (under the nav, scaled to a normal headline size) and the room left for the hardware.
    const measure = () => {
      const vw = window.innerWidth
      const stageH = st.clientHeight
      const nav = document.querySelector('header')?.offsetHeight || 72
      const fontPx = parseFloat(getComputedStyle(title.current).fontSize) || 100
      const sf = Math.min(1, Math.min(68, Math.max(34, vw * 0.044)) / fontPx)
      const titleH = title.current.offsetHeight
      const top = nav + (vw < 768 ? 16 : 22)
      set('--sf', sf.toFixed(4))
      set('--dy', `${(top + (titleH * sf) / 2 - stageH / 2).toFixed(1)}px`)
      set('--head', `${(top + titleH * sf + (vw < 768 ? 16 : 24)).toFixed(1)}px`)
      set('--foot', `${(cta.current?.offsetHeight || 48) + (vw < 768 ? 24 : 28) + 16}px`)
      set('--l2h', `${line2.current?.offsetHeight || 0}px`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(st)
    ro.observe(title.current)

    if (prefersReducedMotion()) {
      st.dataset.cta = 'on'
      return () => ro.disconnect()
    }

    let done = false // the buttons are in: from here on the stage always shows the finished composition
    let collapsed = false // the track has been shortened to one screen
    let touching = false
    let idle = 0
    let frame = 0
    let pin = null

    const apply = (p) => {
      if (p >= BUTTONS[1]) done = true
      const q = done ? 1 : p
      const t4 = easeOut(seg(q, ...BUTTONS))
      set('--t1', easeOut(seg(q, ...LINE2)).toFixed(4))
      set('--t2', easeInOut(seg(q, ...LIFT)).toFixed(4))
      set('--t3', easeOut(seg(q, ...HARDWARE)).toFixed(4))
      set('--t3b', easeOut(seg(q, ...NODE)).toFixed(4))
      set('--t4', t4.toFixed(4))
      st.dataset.cta = t4 > 0.02 ? 'on' : 'off'
    }

    const root = document.documentElement
    function collapse() {
      if (collapsed || !done) return
      collapsed = true
      detach()
      // Shorten the track and move the scroll position by the same amount, so the stage (and everything after it) stays
      // exactly where it is on screen. The browser's own scroll anchoring is paused meanwhile so it can't adjust as well.
      root.style.overflowAnchor = 'none'
      const before = st.getBoundingClientRect().top
      tr.dataset.done = ''
      const shift = st.getBoundingClientRect().top - before
      if (Math.abs(shift) > 0.5) window.scrollTo({ top: window.scrollY + shift, left: 0, behavior: 'instant' })
      pin?.kill()
      pin = null
      ScrollTrigger.refresh() // every trigger further down the page has moved up
      frame = requestAnimationFrame(() => { root.style.overflowAnchor = '' })
    }

    function onScroll() {
      clearTimeout(idle)
      // Only once the stage has begun to scroll away (past the end of the track). While it's pinned there's nothing to
      // do: scrolling on down plays out normally, and heading back up is handled in onUpdate below.
      idle = setTimeout(() => { if (!touching && st.getBoundingClientRect().top < -0.5) collapse() }, IDLE_MS)
    }
    function onTouchStart() { touching = true; clearTimeout(idle) }
    function onTouchEnd() { touching = false; onScroll() }
    function detach() {
      clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    pin = ScrollTrigger.create({
      trigger: tr,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        apply(s.progress)
        // Heading back up after it finished: shorten the track now, rather than leave the visitor scrolling through a
        // pinned, finished stage. (Nothing on screen moves, and it's the way they were going.)
        if (done && s.direction < 0) { cancelAnimationFrame(frame); frame = requestAnimationFrame(collapse) }
      },
      onRefresh: (s) => apply(s.progress),
    })
    apply(pin.progress)
    onScroll() // in case the page opened already scrolled past the hero

    // The statement brightens word by word as it's read, and stays lit when scrolling back up.
    const words = statement.current
    let lit = 0
    const light = (p) => {
      if (p <= lit) return
      lit = p
      words.style.setProperty('--w', lit.toFixed(4))
    }
    words.style.setProperty('--w', '0')
    const read = ScrollTrigger.create({ trigger: words, start: 'top 82%', end: 'bottom 46%', onUpdate: (s) => light(s.progress), onRefresh: (s) => light(s.progress) })
    light(read.progress)

    return () => {
      ro.disconnect()
      detach()
      cancelAnimationFrame(frame)
      pin?.kill()
      read.kill()
      root.style.overflowAnchor = ''
      delete tr.dataset.done
    }
  }, [])

  return (
    // No overflow clipping on these ancestors: it would break the sticky stage.
    <section className="theme-ink relative" style={{ backgroundColor: '#07080A' }}>
      <div ref={track} className="seq-track relative">
        <div ref={stage} data-cta="off" className="seq-stage sticky top-0 h-[100svh] overflow-hidden">
          {/* light: a soft spotlight from above and a wide glow behind the hardware, brightening as it arrives */}
          <div aria-hidden="true" className="stage-light pointer-events-none absolute inset-0" style={{ '--d': '0.1s' }}>
            <div className="seq-glow absolute inset-0">
              <div className="absolute left-1/2 top-0 h-[80%] w-[min(84vw,1150px)] -translate-x-1/2 bg-[radial-gradient(46%_62%_at_50%_0%,rgba(255,255,255,0.15),transparent_72%)]" />
              <div className="absolute left-1/2 top-[30%] h-[62%] w-[min(100vw,1500px)] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(244,242,236,0.09),transparent)]" />
            </div>
          </div>

          <h1 ref={title} className="seq-title absolute inset-x-0 top-1/2 px-4 text-center text-[clamp(3rem,9vw,9rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-paper">
            <span className="stage-fade block" style={{ '--d': '0.25s' }}>One system.</span>
            <span ref={line2} className="seq-line2">Many environments.</span>
          </h1>

          {/* the base station, with the node arriving a beat later to stand in front at its lower left */}
          <div className="seq-product pointer-events-none absolute inset-x-0 flex items-center justify-center px-4" style={{ top: 'var(--head)', bottom: 'var(--foot)' }}>
            <div className="relative aspect-[2400/1625]" style={{ width: 'min(100%, calc((100svh - var(--head) - var(--foot)) * 1.477), 1180px)' }}>
              <div aria-hidden="true" className="absolute inset-x-[8%] bottom-[1%] h-[9%] rounded-[50%] bg-black/80 blur-2xl" />
              <Img
                name="hardware/base-station-v4" widths={BASE_STATION_WIDTHS} sizes="(min-width:1024px) 70vw, 100vw" loading="eager"
                alt="PheNode base station: rain gauge, solar panel, wind sensor, radiation shield, control box and imager on its aluminum frame."
                className="absolute inset-0 h-full w-full object-contain"
              />
              <Img
                name="hardware/wireless-node-2026" widths={[320, 600, 880]} sizes="(min-width:1024px) 16vw, 26vw" loading="eager"
                alt="Agrela wireless sensor node."
                className="seq-node absolute bottom-[-5%] left-[-3%] w-[27%] md:w-[22%]"
              />
            </div>
          </div>

          <div ref={cta} className="seq-cta absolute inset-x-0 bottom-6 px-4 md:bottom-7">
            <ButtonPair className="mx-auto">
              <Button to="/contact?intent=demo" variant="primary">Request a demo</Button>
            </ButtonPair>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 pb-[18vh] pt-[6vh] md:pt-[10vh]">
        <p ref={statement} className="mx-auto max-w-[24ch] text-center text-[clamp(1.875rem,4.2vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-paper" style={{ '--n': WORDS.length }}>
          {WORDS.map((w, i) => (
            <span key={i} className="stage-word" style={{ '--i': i }}>
              {w.glow ? <span className="stage-glow">{w.text}</span> : w.text}{w.tail}{i < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
