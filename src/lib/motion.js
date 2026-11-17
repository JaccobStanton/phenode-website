import { useEffect, useRef, useState } from 'react'

/*
 * Motion helpers without GSAP: reduced motion, reveal on scroll into view, easing math and count-up. The scroll-driven
 * helpers that need GSAP's ScrollTrigger live in lib/scroll.js, so pages without scroll-driven sections (case studies,
 * contact, resources…) never download GSAP (Nov 17, performance pass).
 */

let refresher = null
/** Re-measures the page's scroll-driven animations, if it has any (lib/scroll.js registers itself when it loads). */
export const refreshScroll = () => refresher?.()
export const setScrollRefresher = (fn) => { refresher = fn }

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
    let frame = 0
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (now) => {
        const k = Math.min(1, (now - t0) / (duration * 1000))
        setValue(start + (target - start) * easeOut(k)) // cubic ease-out (was GSAP's power2.out, the same curve)
        if (k < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
  }, [target, duration, enabled, start])
  return [ref, value]
}
