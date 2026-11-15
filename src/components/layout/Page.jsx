import { useEffect } from 'react'

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

/** Standard inner-page hero (ink). */
export function PageHero({ eyebrow, title, lede, children, theme = 'ink' }) {
  return (
    <section className={`theme-${theme} relative pt-32 pb-16 md:pt-44 md:pb-24`}>
      <div className="container-x">
        {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
        <h1 className="display-lg max-w-[18ch]">{title}</h1>
        {lede && <p className="lede mt-6 max-w-[56ch]">{lede}</p>}
        {children}
      </div>
    </section>
  )
}
