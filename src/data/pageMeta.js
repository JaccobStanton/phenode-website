import { APPLICATIONS } from './applications.js'

/**
 * Every page with an address of its own: its path, title and description (Nov 24, for search engines and link
 * previews). One list for both sides:
 * - the build (sitePages in vite.config.js) writes each page its own HTML file with these in the <head> (title,
 *   description, canonical, Open Graph and Twitter tags), so crawlers and link previews see them without running the
 *   site's code, and lists the pages in sitemap.xml;
 * - Page.jsx sets the same tags as the visitor moves from page to page.
 * Plain data only, no JSX: vite.config.js imports this file.
 *
 * A new page needs its entry here (the build stops if a route in App.jsx has none: without its own HTML file, Firebase
 * would answer the page's address with a 404). So does a new legal document or application, which the build can't
 * check: their pages share a route (/legal/:doc, /applications/:id).
 *
 * `title` shows as "<title> — PheNode by Agrela" (null: the home page, HOME_TITLE). `share` is the description for
 * link previews when it differs from the search description (the home page's).
 */
export const SITE_NAME = 'PheNode by Agrela'
export const HOME_TITLE = 'PheNode by Agrela — Hyperlocal Environmental Intelligence'

export const PAGE_META = [
  {
    path: '/', title: null,
    description: 'PheNode is a flexible, scalable environmental monitoring platform: wireless sensor nodes, a solar-powered base station, and software that turns field measurements into usable data, normalized to your preferences.',
    share: 'Wireless sensor nodes, a solar-powered base station and software, built as one system. Measure where conditions actually change.',
  },
  { path: '/phenode', title: 'PheNode', description: 'PheNode: a solar-powered base station, wireless sensor nodes, a data platform and software — one configurable environmental monitoring system.' },
  { path: '/applications', title: 'Applications', description: 'PheNode applications: transportation and smart infrastructure, agricultural research, ecological research and restoration, urban environmental intelligence.' },
  ...APPLICATIONS.map((a) => ({ path: `/applications/${a.id}`, title: a.kicker, description: a.summary })),
  { path: '/case-studies', title: 'Case studies', description: 'PheNode deployments: roadside monitoring with The Ray and the Georgia and Washington State departments of transportation, and agricultural research at the Danforth Center.' },
  { path: '/resources', title: 'Resources', description: 'PheNode guides, press and learning resources from Agrela Ecosystems.' },
  { path: '/resources/api', title: 'API', description: 'API instructions for phenode.live: request an access token, then request sensor data for your PheNode and a time range.' },
  { path: '/support', title: 'Support & documentation', description: 'PheNode support documentation in PDF format: quick start guides and user manuals, current and archived.' },
  { path: '/contact', title: 'Talk to Agrela', description: 'Contact Agrela Ecosystems about PheNode: demos, pricing and deployments.' },
  { path: '/company', title: 'Company', description: 'Agrela Ecosystems: founded in 2016 at the Donald Danforth Plant Science Center, maker of the PheNode environmental monitoring platform.' },
  { path: '/legal/privacy', title: 'Privacy Policy', description: 'Agrela Ecosystems’ privacy policy for this website: the information it collects, such as IP addresses and cookies, how that information is used and protected, and how to reach us.' },
  { path: '/legal/terms', title: 'Terms of Service', description: 'Agrela Ecosystems’ Terms of Service for PheNode and its services: support, user data, orders and payments, shipping, returns, installation, warranty and liability.' },
]

/** The full title for a page title ("PheNode — PheNode by Agrela"), or the home page's. */
export const pageTitle = (title) => (title ? `${title} — ${SITE_NAME}` : HOME_TITLE)

const BY_PATH = new Map(PAGE_META.map((m) => [m.path, m]))

/**
 * The entry for a router path ("/phenode", "/phenode/", "/PheNode": React Router ignores case), or null (an unknown
 * address: the Not found page).
 */
export const metaFor = (pathname) => BY_PATH.get((pathname.replace(/\/+$/, '') || '/').toLowerCase()) ?? null
