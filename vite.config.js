import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const base = process.env.VITE_BASE || '/'

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
export default defineConfig(({ mode }) => ({
  base,
  plugins: [react(), tailwindcss(), preloadMainFont(), preloadLandingPage()],
  build: {
    target: 'es2020',
    sourcemap: mode !== 'production',
    // three.js (about 1 MB, loaded only when a visitor opens a 3D model) is the one chunk near this; anything else this big
    // is a regression
    chunkSizeWarningLimit: 1000,
    // Hashed build files (JS, CSS, fonts) go in their own folder, apart from public/assets (images, video, models,
    // which keep their names), so netlify.toml can cache exactly these for a year (Nov 17).
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
}))
