import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

export { gsap, ScrollTrigger }

export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

/** True when the visitor prefers reduced motion. Updates live. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => (mq ? mq.matches : false))
  useEffect(() => {
    if (!mq) return
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export const prefersReducedMotion = () => (mq ? mq.matches : false)

/**
 * useReveal — adds `.is-visible` to `.reveal` children (or the element itself) when it enters the viewport.
 * Pure IntersectionObserver + CSS, so it costs nothing per frame.
 */
export function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = el.classList.contains('reveal') ? [el] : Array.from(el.querySelectorAll('.reveal'))
    if (targets.length === 0) return
    if (prefersReducedMotion()) { targets.forEach((t) => t.classList.add('is-visible')); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        // also reveal anything already scrolled past (e.g. a lazy section that mounted after a fast scroll or an anchor jump)
        if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
          const t = e.target
          const i = targets.indexOf(t)
          t.style.transitionDelay = `${Math.min(i, 8) * (options.stagger ?? 70)}ms`
          t.classList.add('is-visible')
          io.unobserve(t)
        }
      })
    }, { rootMargin: options.rootMargin ?? '0px 0px -10% 0px', threshold: options.threshold ?? 0.1 })
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [options.stagger, options.rootMargin, options.threshold])
  return ref
}

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

/** Clamp + map helper for scrubbed sequences: maps p from [a,b] to [0,1]. */
export const seg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)))
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
export const lerp = (a, b, t) => a + (b - a) * t

/** Count-up hook for stat numerals. */
export function useCountUp(target, { duration = 1.4, enabled = true, from } = {}) {
  const start = from ?? (target > 100 ? target - 24 : 0)
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : start))
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || prefersReducedMotion()) return
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      io.disconnect()
      const obj = { v: start }
      gsap.to(obj, { v: target, duration, ease: 'power2.out', onUpdate: () => setValue(obj.v) })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration, enabled, start])
  return [ref, value]
}
