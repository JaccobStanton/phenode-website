import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion, setScrollRefresher } from './motion.js'

/*
 * Scroll-driven animation: GSAP's ScrollTrigger, registered once, and useScrollProgress. Only the pages with
 * scroll-driven sections import this (home, PheNode, the application pages), so only they download GSAP; the
 * rest of the motion helpers are in lib/motion.js (Nov 17, performance pass).
 */
gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'power3.out', duration: 0.9 })
setScrollRefresher(() => ScrollTrigger.refresh()) // App.jsx re-measures after a page change through refreshScroll()

export { gsap, ScrollTrigger }

/**
 * useScrollProgress — returns a ref and a 0..1 progress value as the element scrolls through the viewport.
 * `start`/`end` follow ScrollTrigger semantics. Reduced motion → progress jumps to 1 once in view.
 */
export function useScrollProgress({ start = 'top 80%', end = 'bottom 40%', pin = false, scrub = 0.8 } = {}) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { setProgress(1); io.disconnect() } }), { threshold: 0.2 })
      io.observe(el)
      return () => io.disconnect()
    }
    let frame = 0
    const st = ScrollTrigger.create({
      trigger: el, start, end, pin, scrub, anticipatePin: pin ? 1 : 0,
      onUpdate: (self) => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => setProgress(self.progress))
      },
    })
    return () => { cancelAnimationFrame(frame); st.kill() }
  }, [start, end, pin, scrub])
  return [ref, progress]
}
