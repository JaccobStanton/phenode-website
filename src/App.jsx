import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, HashRouter, MemoryRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/layout/Nav.jsx'
import Footer from './components/layout/Footer.jsx'
import { PersonalizationProvider } from './context/PersonalizationContext.jsx'
import { ScrollTrigger } from './lib/motion.js'
import { clearIntroHeader } from './lib/intro.js'
import { FEATURES } from './data/features.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const PheNodeOverview = lazy(() => import('./pages/phenode/Overview.jsx'))
const WirelessNodePage = lazy(() => import('./pages/phenode/WirelessNode.jsx'))
const BaseStationPage = lazy(() => import('./pages/phenode/BaseStation.jsx'))
const DataPlatformPage = lazy(() => import('./pages/phenode/DataPlatform.jsx'))
const SoftwarePage = lazy(() => import('./pages/phenode/Software.jsx'))
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

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (pathname !== '/') clearIntroHeader()
    if (hash) {
      const el = document.querySelector(hash)
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // Give lazy content a tick to mount before ScrollTrigger measures.
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(t)
  }, [pathname, hash])
  return null
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
              <Route path="/phenode" element={<PheNodeOverview />} />
              <Route path="/phenode/wireless-node" element={<WirelessNodePage />} />
              <Route path="/phenode/base-station" element={<BaseStationPage />} />
              <Route path="/phenode/data-platform" element={<DataPlatformPage />} />
              <Route path="/phenode/software" element={<SoftwarePage />} />
              <Route path="/applications" element={<ApplicationsIndex />} />
              <Route path="/applications/:id" element={<ApplicationPage />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:slug" element={<CaseStudy />} />
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
