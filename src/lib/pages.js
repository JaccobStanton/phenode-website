/**
 * The site's pages, each its own chunk. App.jsx renders them lazily; `preloadPage` starts loading one early — when a
 * link to it is pointed at, focused or touched (usePreloadOnIntent in App.jsx) — so the page is usually ready by the
 * time the click lands (Nov 17, performance pass).
 */
export const PAGES = {
  home: () => import('../pages/Home.jsx'),
  phenode: () => import('../pages/PheNode.jsx'),
  applications: () => import('../pages/applications/Index.jsx'),
  application: () => import('../pages/applications/Application.jsx'),
  caseStudies: () => import('../pages/CaseStudies.jsx'),
  resources: () => import('../pages/Resources.jsx'),
  support: () => import('../pages/Support.jsx'),
  contact: () => import('../pages/Contact.jsx'),
  company: () => import('../pages/Company.jsx'),
  legal: () => import('../pages/Legal.jsx'),
  notFound: () => import('../pages/NotFound.jsx'),
}

const BY_PATH = {
  '/': 'home', '/phenode': 'phenode', '/applications': 'applications', '/case-studies': 'caseStudies', '/resources': 'resources',
  '/support': 'support', '/contact': 'contact', '/company': 'company',
}

const started = new Set()

/** Starts loading the page a link points to (a router path like "/phenode#software"); unknown paths are ignored. */
export function preloadPage(to) {
  const path = (to || '').split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  const page = BY_PATH[path] || (path.startsWith('/applications/') ? 'application' : path.startsWith('/legal/') ? 'legal' : null)
  if (!page || started.has(page)) return
  started.add(page)
  PAGES[page]().catch(() => started.delete(page)) // offline or a failed request: try again on the next intent
}
