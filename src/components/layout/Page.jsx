import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Img } from '../ui/primitives.jsx'
import { metaFor, pageTitle } from '../../data/pageMeta.js'

const setContent = (selector, value) => document.querySelector(selector)?.setAttribute('content', value)

/**
 * Sets the browser title and the page's description, share and canonical tags as the visitor moves between pages.
 * They come from data/pageMeta.js, the list the build also writes each page's own HTML from (so a page opened directly
 * already has them). `title` / `description` override the list: Contact's "Request a demo", the Not found page.
 */
export default function Page({ title, description, children }) {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = metaFor(pathname)
    const fullTitle = pageTitle(title !== undefined ? title : meta?.title)
    const text = description ?? meta?.description
    document.title = fullTitle
    if (text) setContent('meta[name="description"]', text)
    if (!meta) return
    setContent('meta[property="og:title"]', fullTitle)
    setContent('meta[name="twitter:title"]', fullTitle)
    setContent('meta[property="og:description"]', meta.share ?? text)
    setContent('meta[name="twitter:description"]', meta.share ?? text)
    // the canonical address: the page's path on the site's own address (the built HTML has it; not in development)
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.href = new URL(meta.path, canonical.href).href
      setContent('meta[property="og:url"]', canonical.href)
    }
  }, [pathname, title, description])
  return children
}

/**
 * Inner-page hero on paper: eyebrow, title and lede, with a photo beside them (Jake, Nov 15: no empty space next to
 * the title). From 1024 px the photo takes the right five columns and is exactly as tall as the text, cropped to fit;
 * `photo.position` (CSS object-position) keeps the subject in frame; `photo.widths` lists the exported sizes. Below that the photo follows the text at 3:2.
 * Used by the pages in the Resources menu (Resources, Support, API, Company). `art` takes the photo's place with any
 * picture of its own (the API page's drawing); `meta` is a small line under the lede (the API page's date).
 */
export function PageHero({ eyebrow, title, lede, photo, art, meta }) {
  return (
    <section className="theme-paper pt-28 pb-10 md:pt-40">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-xl mt-4 text-balance">{title}</h1>
          <p className="lede mt-6 max-w-[60ch] text-pretty md:mt-8">{lede}</p>
          {meta && <p className="mt-5 font-mono text-[11px] tracking-[0.1em] text-stone-2">{meta}</p>}
        </div>
        {(photo || art) && (
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-ink/5 lg:col-span-5 lg:aspect-auto lg:min-h-[15rem]">
            {art || <Img name={photo.name} widths={photo.widths ?? [800, 1200, 1600]} sizes="(min-width: 1024px) 38vw, 100vw" alt={photo.alt} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: photo.position }} />}
          </div>
        )}
      </div>
    </section>
  )
}
