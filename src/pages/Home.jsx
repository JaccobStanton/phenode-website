import { lazy, Suspense, startTransition, useEffect, useState } from 'react'
import Page from '../components/layout/Page.jsx'
import IntroHero from '../sections/home/IntroHero.jsx'
import { introWillShow, WANT_REST } from '../lib/intro.js'

const loadAfterIntro = () => import('../sections/home/AfterIntro.jsx')
const AfterIntro = lazy(loadAfterIntro)

// How long the intro has the device to itself before the rest of the page is fetched and built: its words are in by
// then ("Hyperlocal", the page's largest paint, starts at 0.55 s).
const REST_AFTER_MS = 1200
// What the visitor can do that means they're on their way down (or about to be): fetch the rest at once.
const INTENT = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown', WANT_REST]

/** A screen tall while the rest of the page isn't there yet, so the intro can scroll away and nothing jumps. */
const Placeholder = () => <div className="min-h-[100svh]" aria-hidden="true" data-rest-placeholder="" />

/**
 * The home page: the intro ("Capture Hyperlocal Environmental Intelligence", the first screen), then the hero and
 * sections 02–09 (sections/home/AfterIntro.jsx, a chunk of its own).
 *
 * The intro fills the screen, so it gets the device to itself first (Nov 17, performance pass): the rest of the page
 * is fetched about a second after it starts, when the browser is idle, or as soon as the visitor scrolls, touches the
 * screen, presses a key or chooses "Explore PheNode" (which waits for the hero, sections/home/IntroHero.jsx). It's then
 * built as a transition, in small slices, so the intro's animation keeps running meanwhile. Without the intro (it was
 * seen earlier in the visit) the hero is the first screen, and it all loads at once.
 */
export default function Home() {
  const [rest, setRest] = useState(() => !introWillShow())

  useEffect(() => {
    if (rest) return undefined
    let started = false, timer = 0, idle = 0
    const stop = () => {
      clearTimeout(timer)
      if (idle) window.cancelIdleCallback?.(idle)
      INTENT.forEach((e) => window.removeEventListener(e, go))
    }
    function go() {
      if (started) return
      started = true
      stop()
      const show = () => startTransition(() => setRest(true))
      loadAfterIntro().then(show, show)
    }
    INTENT.forEach((e) => window.addEventListener(e, go, { passive: true }))
    timer = setTimeout(() => {
      if (window.requestIdleCallback) idle = window.requestIdleCallback(go, { timeout: 1000 })
      else go()
    }, REST_AFTER_MS)
    return stop
  }, [rest])

  return (
    <Page>
      {/* Once per visit: "Capture Hyperlocal Environmental Intelligence", then it slides away to the hero */}
      <IntroHero />
      <Suspense fallback={<Placeholder />}>{rest ? <AfterIntro /> : <Placeholder />}</Suspense>
    </Page>
  )
}
