import { useEffect } from 'react'
import { Img } from '../ui/primitives.jsx'

/** Sets the document title/description per page. */
export default function Page({ title, description, children }) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} — PheNode by Agrela` : 'PheNode by Agrela — Hyperlocal environmental intelligence'
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content')
    if (meta && description) meta.setAttribute('content', description)
    return () => { document.title = prev; if (meta && prevDesc) meta.setAttribute('content', prevDesc) }
  }, [title, description])
  return children
}

/**
 * Inner-page hero on paper: eyebrow, title and lede, with a photo beside them (Jake, Nov 15: no empty space next to
 * the title). From 1024 px the photo takes the right five columns and is exactly as tall as the text, cropped to fit;
 * `photo.position` (CSS object-position) keeps the subject in frame; `photo.widths` lists the exported sizes. Below that the photo follows the text at 3:2.
 * Used by the pages in the Resources menu (Resources, Support, Company).
 */
export function PageHero({ eyebrow, title, lede, photo }) {
  return (
    <section className="theme-paper pt-28 pb-10 md:pt-40">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-xl mt-4 text-balance">{title}</h1>
          <p className="lede mt-6 max-w-[60ch] text-pretty md:mt-8">{lede}</p>
        </div>
        {photo && (
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-ink/5 lg:col-span-5 lg:aspect-auto lg:min-h-[15rem]">
            <Img name={photo.name} widths={photo.widths ?? [800, 1200, 1600]} sizes="(min-width: 1024px) 38vw, 100vw" alt={photo.alt} loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: photo.position }} />
          </div>
        )}
      </div>
    </section>
  )
}
