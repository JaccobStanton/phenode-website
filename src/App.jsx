import { lazy, Suspense, useEffect, useRef } from 'react'
import { BrowserRouter, HashRouter, MemoryRouter, Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom'
import Nav from './components/layout/Nav.jsx'
import Footer from './components/layout/Footer.jsx'
import { PersonalizationProvider } from './context/PersonalizationContext.jsx'
import { ScrollTrigger, prefersReducedMotion } from './lib/motion.js'
import { clearIntroHeader } from './lib/intro.js'
import { FEATURES } from './data/features.js'
import { PHENODE_PARTS } from './data/navigation.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const PheNodePage = lazy(() => import('./pages/PheNode.jsx'))
const ApplicationsIndex = lazy(() => import('./pages/applications/Index.jsx'))
const ApplicationPage = lazy(() => import('./pages/applications/Application.jsx'))
const CaseStudies = lazy(() => import('./pages/CaseStudies.jsx'))
const CaseStudy = lazy(() => import('./pages/CaseStudy.jsx'))
const DesignYourSystem = lazy(() => import('./pages/DesignYourSystem.jsx'))
const Resources = lazy(() => import('./pages/Resources.jsx'))
const Support = lazy(() => import('./pages/Support.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Company = lazy(() => import('./pages/Company.jsx'))
const Legal = lazy(() => import('./pages/Legal.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

// Anything the visitor does to scroll themselves ends scrollToPart's hold on the target.
const TAKE_OVER = ['wheel', 'touchstart', 'keydown', 'pointerdown']

/**
 * Scrolls to the element with this id (a part of the PheNode page, say) and moves focus to its heading. The element
 * may not be in the page yet (a lazy page still loading), so it's looked for on every frame for a few seconds. From
 * another page it jumps straight there; on the same page it glides.
 *
 * For four seconds after, until the visitor scrolls themselves, it makes sure the part is where it should be: a change
 * in the layout above it (images arriving, the PheNode hero shortening its track) re-aligns it, and so does a glide
 * that stopped short (a ScrollTrigger refresh during a smooth scroll ends it where it is). Returns a function that
 * stops all of this.
 */
function scrollToPart(id, glide) {
  const behavior = glide && !prefersReducedMotion() ? 'smooth' : 'instant'
  const started = performance.now()
  let frame = 0, hold = 0, quiet = 0, refresh = 0, ro = null, onScroll = null
  const stop = () => {
    cancelAnimationFrame(frame); clearTimeout(hold); clearTimeout(quiet); clearTimeout(refresh); ro?.disconnect()
    if (onScroll) window.removeEventListener('scroll', onScroll)
    TAKE_OVER.forEach((type) => window.removeEventListener(type, stop))
  }
  const find = () => {
    const el = document.getElementById(id)
    if (!el) {
      if (performance.now() - started < 4000) frame = requestAnimationFrame(find)
      return
    }
    const go = () => el.scrollIntoView({ behavior, block: 'start' })
    go()
    // keyboard and screen-reader users continue from the part they asked for (same pattern as home 05)
    const heading = el.matches('h1, h2, h3') ? el : el.querySelector('h1, h2, h3') || el
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
    heading.setAttribute('data-focus-target', '')
    heading.focus({ preventScroll: true })
    TAKE_OVER.forEach((type) => window.addEventListener(type, stop, { passive: true }))
    const main = document.getElementById('main')
    if (main && typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(go); ro.observe(main) }
    // Once the scrolling pauses, check the landing; go again if it's off (up to three times) and the page can scroll on.
    let tries = 0
    const check = () => {
      const want = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
      const off = el.getBoundingClientRect().top - want
      const atEnd = off > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1
      if (Math.abs(off) > 2 && !atEnd && tries++ < 3) go()
    }
    onScroll = () => { clearTimeout(quiet); quiet = setTimeout(check, 160) }
    window.addEventListener('scroll', onScroll, { passive: true })
    quiet = setTimeout(check, 160)
    hold = setTimeout(stop, 4000)
    if (!glide) refresh = setTimeout(() => ScrollTrigger.refresh(), 120) // a new page: let ScrollTrigger measure it
  }
  find()
  return stop
}

function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const seen = useRef({ path: null, key: null })
  useEffect(() => {
    if (pathname !== '/') clearIntroHeader()
    // The same page: a link to a part of it, or to its top ("Overview" on the PheNode page). StrictMode's second run of
    // this effect in development has the same key, so it doesn't count.
    const samePage = seen.current.path === pathname && seen.current.key !== key
    seen.current = { path: pathname, key }
    if (!samePage) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (hash) {
      let id = hash.slice(1)
      try { id = decodeURIComponent(id) } catch { /* a malformed escape: use it as written */ }
      return scrollToPart(id, samePage)
    }
    if (samePage) { window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' }); return undefined }
    // Give lazy content a tick to mount before ScrollTrigger measures.
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(t)
  }, [pathname, hash, key])
  return null
}

/** The parts of the PheNode page were pages of their own until Nov 16: their old addresses lead to the part. */
function PheNodePartRedirect() {
  const { part } = useParams()
  const { hash } = useLocation()
  if (!PHENODE_PARTS.some((p) => p.id === part)) return <NotFound />
  // their "#specs" links: the spec tables in the part
  const to = hash === '#specs' && (part === 'base-station' || part === 'wireless-node') ? `${part}-specs` : part
  return <Navigate to={`/phenode#${to}`} replace />
}

function Loading() {
  return <div className="theme-ink flex min-h-[60vh] items-center justify-center font-mono text-[11px] tracking-[0.2em] uppercase text-stone" aria-live="polite">Loading</div>
}

const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

export default function App() {
  return (
    <Router>
      <PersonalizationProvider>
        <ScrollManager />
        <Nav />
        <main id="main">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* one long page since Nov 16: Overview, Base station, Wireless sensor node, Data platform, Software */}
              <Route path="/phenode" element={<PheNodePage />} />
              <Route path="/phenode/:part" element={<PheNodePartRedirect />} />
              <Route path="/applications" element={<ApplicationsIndex />} />
              <Route path="/applications/:id" element={<ApplicationPage />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              {/* switched off for now (data/features.js): the deployments link to their press releases */}
              <Route path="/case-studies/:slug" element={FEATURES.caseStudyPages ? <CaseStudy /> : <Navigate to="/case-studies" replace />} />
              {/* switched off for now (data/features.js): the address goes to Contact, and the page's code isn't loaded */}
              <Route path="/design-your-system" element={FEATURES.designSystem ? <DesignYourSystem /> : <Navigate to="/contact" replace />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/company" element={<Company />} />
              <Route path="/legal/:doc" element={<Legal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </PersonalizationProvider>
    </Router>
  )
}
