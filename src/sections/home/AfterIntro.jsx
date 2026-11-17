import { lazy, Suspense, startTransition, useEffect, useState } from 'react'
import { ScrollTrigger } from '../../lib/scroll.js'
import Hero from './Hero.jsx'
import WhatIsPheNode from './WhatIsPheNode.jsx'
import Hyperlocal from './Hyperlocal.jsx'
import HowItWorks from './HowItWorks.jsx'
import Perspective from './Perspective.jsx'

const loadSoftware = () => import('./Software.jsx')
const loadScale = () => import('./Scale.jsx')
const loadDataOwnership = () => import('./DataOwnership.jsx')
const loadProof = () => import('./Proof.jsx')
const loadFinalCTA = () => import('./FinalCTA.jsx')

// The home page below the intro, top to bottom: the hero (01), sections 02–09 and the closing section. The last five
// are chunks of their own (`load`). `theme`: the colour of the space kept for a section until it's in.
const SECTIONS = [
  { C: Hero },
  { C: WhatIsPheNode },
  { C: Hyperlocal },
  { C: HowItWorks },
  { C: Perspective },
  { C: lazy(loadSoftware), load: loadSoftware },
  { C: lazy(loadScale), load: loadScale },
  { C: lazy(loadDataOwnership), load: loadDataOwnership, theme: 'paper' },
  { C: lazy(loadProof), load: loadProof },
  { C: lazy(loadFinalCTA), load: loadFinalCTA },
]

const Fallback = ({ theme = 'ink' }) => <div className={`theme-${theme} min-h-[40vh]`} aria-hidden="true" />

const idle = (fn) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 300 }) : setTimeout(fn, 32))
const cancelIdle = (id) => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id))

/**
 * The home page below the intro (pages/Home.jsx loads it as a chunk of its own).
 *
 * Built a section at a time (Nov 17, performance pass): the hero first, then each next section in the browser's next
 * quiet moment, top to bottom, so no single step holds up the page for long — together they took one long task. Top
 * to bottom also means every scroll-driven section measures its place with everything above it already there. The
 * code of the last five is fetched as soon as this mounts. Once all are in, ScrollTrigger measures the page again.
 *
 * The Application experiences, Hardware, Build your PheNode and Case studies sections were deleted on Nov 17 (Jake).
 */
export default function AfterIntro() {
  const [count, setCount] = useState(1) // how many sections are in

  useEffect(() => {
    SECTIONS.forEach((s) => s.load?.().catch(() => {})) // fetch the five chunks now; a failure retries on mount
  }, [])

  useEffect(() => {
    if (count >= SECTIONS.length) {
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => cancelAnimationFrame(frame)
    }
    let live = true, id = 0
    const next = SECTIONS[count]
    const ready = next.load ? next.load().catch(() => {}) : Promise.resolve()
    ready.then(() => { if (live) id = idle(() => startTransition(() => setCount((c) => c + 1))) })
    return () => { live = false; cancelIdle(id) }
  }, [count])

  return SECTIONS.map(({ C, load, theme }, i) => {
    if (i >= count) return <Fallback key={i} theme={theme} />
    return load ? <Suspense key={i} fallback={<Fallback theme={theme} />}><C /></Suspense> : <C key={i} />
  })
}
