import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { PAGE_META, pageTitle } from './src/data/pageMeta.js'

const base = process.env.VITE_BASE || '/'

// The site's public address: the share image, the canonical addresses and the sitemap use it. phenode.com since the
// site went live there (Nov 24; it was the web.app address before). VITE_SITE_URL overrides it.
const DEFAULT_SITE_URL = 'https://phenode.com'

/**
 * Fills in %SITE_URL% in index.html (Nov 18). Link-preview crawlers (Slack, LinkedIn…) need the share image as a full
 * address. Runs before Vite reads the page's tags, so the image is left as the external address it now is.
 */
function siteUrl(url) {
  return {
    name: 'agrela:site-url',
    transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', url) },
  }
}

/**
 * Search engines and link previews (Nov 24): after the build, every page in src/data/pageMeta.js gets an HTML file
 * of its own (dist/phenode/index.html …): the same app, with that page's title, description, canonical address and
 * Open Graph / Twitter tags in the <head>, so crawlers and link previews that don't run the site's code see them.
 * Also writes 404.html (the app, which shows its Not found page; Firebase Hosting serves it with a 404 status for any
 * unknown address now that firebase.json has no catch-all rewrite), sitemap.xml and robots.txt (with the sitemap).
 * Production addresses only: builds with VITE_ROUTER (the hash-routed preview) or a sub-path base are left as they are.
 *
 * The build stops if src/App.jsx and pageMeta.js disagree: a page without its entry would have no HTML file, and
 * Firebase would answer its address with a 404 (the page still shows, but search engines drop it and link previews
 * read "Not found"); an entry without a page would be a "Not found" page listed in the sitemap.
 */
function sitePages(siteUrl) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const setTag = (html, attr, key, value) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
    if (!re.test(html)) throw new Error(`sitePages: index.html has no <meta ${attr}="${key}">`)
    return html.replace(re, (_, a, b) => `${a}${esc(value)}${b}`)
  }
  const setTitle = (html, title) => html.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(title)}</title>`)
  const forPage = (html, meta) => {
    const title = pageTitle(meta.title)
    const url = siteUrl + meta.path
    let out = setTitle(html, title)
    out = setTag(out, 'name', 'description', meta.description)
    for (const [attr, key, value] of [
      ['property', 'og:title', title], ['property', 'og:description', meta.share ?? meta.description],
      ['name', 'twitter:title', title], ['name', 'twitter:description', meta.share ?? meta.description],
    ]) out = setTag(out, attr, key, value)
    return out.replace(/(\s*)(<meta property="og:site_name")/, (_, ws, tag) => `${ws}<link rel="canonical" href="${esc(url)}" />${ws}<meta property="og:url" content="${esc(url)}" />${ws}${tag}`)
  }
  let root
  return {
    name: 'agrela:site-pages',
    apply: 'build',
    configResolved(config) { root = config.root },
    buildStart() {
      if (process.env.VITE_ROUTER || base !== '/') return
      // App.jsx's routes, apart from redirects (<Navigate>) and the catch-all: "/phenode", "/applications/:id" …
      const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8')
      const routes = [...app.matchAll(/<Route path="([^"]+)" element=\{<(\w+)/g)].filter(([, p, el]) => p !== '*' && el !== 'Navigate').map(([, p]) => p)
      if (!routes.length) return this.warn('sitePages: found no <Route path=…> in src/App.jsx, so the routes weren\'t checked against src/data/pageMeta.js')
      const listed = new Set(PAGE_META.map((m) => m.path))
      const patterns = routes.map((r) => new RegExp(`^${r.replace(/:\w+/g, '[^/]+')}$`))
      const noEntry = routes.filter((r) => !r.includes(':') && !listed.has(r))
      const noRoute = [...listed].filter((p) => !patterns.some((re) => re.test(p)))
      if (noEntry.length) this.error(`src/App.jsx has a page at ${noEntry.join(', ')} with no entry in src/data/pageMeta.js: add one (its title and description), so the page gets an HTML file of its own`)
      if (noRoute.length) this.error(`src/data/pageMeta.js lists ${noRoute.join(', ')}, which src/App.jsx has no page for`)
    },
    writeBundle(options) {
      if (process.env.VITE_ROUTER || base !== '/') return
      const dir = options.dir
      const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8')
      for (const meta of PAGE_META) {
        const file = path.join(dir, meta.path, 'index.html')
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, forPage(html, meta))
      }
      // the Not found page: kept out of search results; no canonical address
      const charset = '<meta charset="UTF-8" />'
      if (!html.includes(charset)) throw new Error(`sitePages: index.html has no ${charset}`)
      fs.writeFileSync(path.join(dir, '404.html'), setTitle(html, pageTitle('Not found')).replace(charset, `${charset}\n    <meta name="robots" content="noindex" />`))
      const urls = PAGE_META.map((m) => `  <url><loc>${esc(siteUrl + m.path)}</loc></url>`).join('\n')
      fs.writeFileSync(path.join(dir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      fs.writeFileSync(path.join(dir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
    },
  }
}

/**
 * Preloads the Latin subset of Inter (the face of every headline and paragraph) from index.html, so the first text
 * paints in it rather than in a fallback that then swaps (Nov 17, performance pass). Only the Latin subset: the
 * others (Cyrillic, Greek, Vietnamese…) load by unicode-range if a page ever needs them.
 */
function preloadMainFont() {
  return {
    name: 'agrela:preload-main-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const font = Object.values(ctx.bundle || {}).find((a) => a.type === 'asset' && /inter-latin-wght-normal-[\w-]+\.woff2$/.test(a.fileName))
        if (!font) return html
        return [{ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${font.fileName}`, crossorigin: '' }, injectTo: 'head' }]
      },
    },
  }
}

/**
 * The landing page's own code, fetched alongside the app's when a visit starts (Nov 17, performance pass). Pages are
 * lazy chunks (src/lib/pages.js), so the browser would only learn about the page's chunk once the app's code has run,
 * a round trip later. A small inline script in index.html matches the address against these pages and adds
 * <link rel="modulepreload"> for that page's chunk and the chunks it imports that index.html doesn't load already.
 * Production addresses only (the hosted preview's hash addresses skip it).
 */
const LANDING_PAGES = [
  ['^/$', 'src/pages/Home.jsx'],
  ['^/phenode/?$', 'src/pages/PheNode.jsx'],
  ['^/applications/?$', 'src/pages/applications/Index.jsx'],
  ['^/applications/[^/]+/?$', 'src/pages/applications/Application.jsx'],
  ['^/case-studies/?$', 'src/pages/CaseStudies.jsx'],
  ['^/resources/?$', 'src/pages/Resources.jsx'],
  ['^/support/?$', 'src/pages/Support.jsx'],
  ['^/resources/api/?$', 'src/pages/Api.jsx'],
  ['^/contact/?$', 'src/pages/Contact.jsx'],
  ['^/company/?$', 'src/pages/Company.jsx'],
  ['^/legal/[^/]+/?$', 'src/pages/Legal.jsx'],
]

function preloadLandingPage() {
  return {
    name: 'agrela:preload-landing-page',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (process.env.VITE_ROUTER) return html // hash or memory router: not the production addresses
        const bundle = ctx.bundle || {}
        const chunks = Object.values(bundle).filter((c) => c.type === 'chunk')
        const entry = chunks.find((c) => c.isEntry)
        if (!entry) return html
        const have = new Set() // the entry and everything it imports: index.html loads these already
        const walk = (f) => { if (have.has(f)) return; have.add(f); bundle[f]?.imports?.forEach(walk) }
        walk(entry.fileName)
        const table = []
        for (const [re, mod] of LANDING_PAGES) {
          const page = chunks.find((c) => c.facadeModuleId && c.facadeModuleId.replaceAll('\\', '/').endsWith(`/${mod}`))
          if (!page) throw new Error(`preloadLandingPage: no chunk for ${mod}`)
          const files = []
          const add = (f) => { if (have.has(f) || files.includes(f)) return; files.push(f); bundle[f]?.imports?.forEach(add) }
          add(page.fileName)
          table.push([re, files])
        }
        const code = `(function(){var p=location.pathname.replace(/\\/index\\.html$/,"/"),t=${JSON.stringify(table)};for(var i=0;i<t.length;i++)if(new RegExp(t[i][0]).test(p)){t[i][1].forEach(function(f){var l=document.createElement("link");l.rel="modulepreload";l.crossOrigin="";l.href=${JSON.stringify(base)}+f;document.head.appendChild(l)});break}})()`
        // before the app's own script and stylesheet: an inline script after a stylesheet waits for it to load
        const at = html.indexOf('<script type="module"')
        if (at < 0) throw new Error('preloadLandingPage: no module script in index.html')
        return `${html.slice(0, at)}<script>${code}</script>\n    ${html.slice(at)}`
      },
    },
  }
}

// VITE_BASE lets the same build be hosted at a sub-path (e.g. a hosted preview).
export default defineConfig(({ mode }) => {
  const site = (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')
  return {
    base,
    plugins: [siteUrl(site), react(), tailwindcss(), preloadMainFont(), preloadLandingPage(), sitePages(site)],
    build: {
      target: 'es2020',
      sourcemap: mode !== 'production',
      // three.js (about 1 MB, loaded only when a visitor opens a 3D model) is the one chunk near this; anything else this big
      // is a regression
      chunkSizeWarningLimit: 1000,
      // Hashed build files (JS, CSS, fonts) go in their own folder, apart from public/assets (images, video, models,
      // which keep their names), so the host can cache exactly these for a year (firebase.json; Nov 17).
      assetsDir: 'static',
      rollupOptions: {
        output: {
          // Named vendor chunks. Rolldown's chunk groups with priorities rather than manualChunks: with manualChunks, React
          // itself landed in the Motion chunk, so every page downloaded Motion (Nov 17). GSAP (scroll-driven sections, on
          // every page) is apart from Motion (only the home hero's close-ups use it now that the header doesn't).
          advancedChunks: {
            groups: [
              { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/, priority: 40 },
              { name: 'three', test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/, priority: 30 },
              { name: 'gsap', test: /[\\/]node_modules[\\/]gsap[\\/]/, priority: 20 },
              { name: 'motion', test: /[\\/]node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/, priority: 10 },
            ],
          },
        },
      },
    },
  }
})
