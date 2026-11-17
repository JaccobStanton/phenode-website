import { lazy, Suspense } from 'react'
import Page from '../components/layout/Page.jsx'
import IntroHero from '../sections/home/IntroHero.jsx'
import Hero from '../sections/home/Hero.jsx'
import WhatIsPheNode from '../sections/home/WhatIsPheNode.jsx'
import Hyperlocal from '../sections/home/Hyperlocal.jsx'
import HowItWorks from '../sections/home/HowItWorks.jsx'
import Perspective from '../sections/home/Perspective.jsx'
import Applications from '../sections/home/Applications.jsx'
import { FEATURES } from '../data/features.js'

const Hardware = lazy(() => import('../sections/home/Hardware.jsx'))
const Scale = lazy(() => import('../sections/home/Scale.jsx'))
const BuildTeaser = lazy(() => import('../sections/home/BuildTeaser.jsx'))
const Software = lazy(() => import('../sections/home/Software.jsx'))
const DataOwnership = lazy(() => import('../sections/home/DataOwnership.jsx'))
const Proof = lazy(() => import('../sections/home/Proof.jsx'))
const CaseStudiesTeaser = lazy(() => import('../sections/home/CaseStudiesTeaser.jsx'))
const FinalCTA = lazy(() => import('../sections/home/FinalCTA.jsx'))

const Fallback = ({ theme = 'ink' }) => <div className={`theme-${theme} min-h-[40vh]`} aria-hidden="true" />

export default function Home() {
  return (
    <Page>
      {/* Once per visit: "Capture Hyperlocal Environmental Intelligence", then it slides away to the hero */}
      <IntroHero />
      <Hero />
      <WhatIsPheNode />
      <Hyperlocal />
      <HowItWorks />
      <Perspective />
      {/* "Application experiences": hidden for now (FEATURES.homeApplications) */}
      {FEATURES.homeApplications && <Applications />}
      {/* "Hardware": hidden for now (FEATURES.homeHardware) */}
      {FEATURES.homeHardware && <Suspense fallback={<Fallback theme="paper" />}><Hardware /></Suspense>}
      {/* "Build your PheNode" only advertises the configurator: hidden while that page is off */}
      {FEATURES.designSystem && <Suspense fallback={<Fallback theme="paper" />}><BuildTeaser /></Suspense>}
      <Suspense fallback={<Fallback />}><Software /></Suspense>
      <Suspense fallback={<Fallback />}><Scale /></Suspense>
      <Suspense fallback={<Fallback theme="paper" />}><DataOwnership /></Suspense>
      <Suspense fallback={<Fallback />}><Proof /></Suspense>
      {/* "Case studies": hidden for now (FEATURES.homeCaseStudies) */}
      {FEATURES.homeCaseStudies && <Suspense fallback={<Fallback theme="paper" />}><CaseStudiesTeaser /></Suspense>}
      <Suspense fallback={<Fallback />}><FinalCTA /></Suspense>
    </Page>
  )
}
