import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { NAV } from '../../data/navigation.js'
import { PheNodeLogo } from '../ui/Logos.jsx'
import { COMPANY } from '../../data/company.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  // Mobile sheet + desktop menus are keyed to the path they were opened on, so navigation closes them without an effect.
  const [openAt, setOpenAt] = useState(null)
  const [menuAt, setMenuAt] = useState(null)
  const open = openAt === location.pathname
  const menu = menuAt && menuAt.path === location.pathname ? menuAt.label : null
  const setOpen = (v) => setOpenAt((typeof v === 'function' ? v(open) : v) ? location.pathname : null)
  const setMenu = (label) => setMenuAt(label ? { label, path: location.pathname } : null)
  const closeTimer = useRef(0)
  const headerRef = useRef(null)

  // Which surface sits under the header: 'ink', 'paper' or 'midnight' (dark blue). Sampled on scroll/resize/route change.
  const [tone, setTone] = useState('ink')
  useEffect(() => {
    let frame = 0
    const sample = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
      const h = headerRef.current ? headerRef.current.offsetHeight : 72
      const probe = document.elementFromPoint(Math.min(window.innerWidth - 8, 24), h + 6)
      const themed = probe && probe.closest ? probe.closest('.theme-paper, .theme-ink') : null
      // 'midnight' is a dark section in the app's navy (home 04): the header behaves as on ink, with a navy bar when scrolled
      setTone(themed && themed.classList.contains('theme-paper') ? 'paper' : themed && themed.classList.contains('theme-midnight') ? 'midnight' : 'ink')
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(sample) }
    sample()
    const t = setTimeout(sample, 250)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // The page under the header can arrive after those samples (lazy routes, images): sample again whenever it changes size.
    const main = document.getElementById('main')
    const ro = main && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScroll) : null
    ro?.observe(main)
    return () => { clearTimeout(t); cancelAnimationFrame(frame); ro?.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const openMenu = (label) => { clearTimeout(closeTimer.current); setMenu(label) }
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setMenu(null), 140) }

  return (
    <header ref={headerRef} data-tone={open ? 'ink' : tone} className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,color] duration-500 ${open ? 'bg-ink text-paper border-b border-white/10' : tone === 'paper' ? (scrolled ? 'bg-phenode-white/85 text-ink backdrop-blur-md border-b border-ink/10' : 'bg-transparent text-ink border-b border-transparent') : (scrolled ? `${tone === 'midnight' ? 'bg-midnight/85' : 'bg-ink/85'} text-paper backdrop-blur-md border-b border-white/10` : 'bg-transparent text-paper border-b border-transparent')}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-paper focus:px-3 focus:py-2 focus:text-ink">Skip to content</a>
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[72px] 2xl:gap-6">
        <Link to="/" className="nav-logo flex items-center gap-3" aria-label="PheNode by Agrela — home">
          <PheNodeLogo height={20} />
          <span className="hidden font-mono text-[8px] tracking-[0.2em] uppercase opacity-60 lg:inline">by Agrela</span>
        </Link>

        {/* On the home intro these are hidden, then fade in one after another on the hero (lib/intro.js, index.css) */}
        <nav className="nav-links hidden items-center gap-1 xl:flex" aria-label="Primary">
          {NAV.map((item, i) => (
            <div key={item.label} className="relative" style={{ '--k': i }} onMouseEnter={() => item.children && openMenu(item.label)} onMouseLeave={scheduleClose}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-[14px] transition-colors 2xl:px-3 ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                aria-haspopup={item.children ? 'true' : undefined}
                aria-expanded={item.children ? menu === item.label : undefined}
                onFocus={() => item.children && openMenu(item.label)}
              >
                {item.label}
                {item.children && <ChevronDown size={14} className="opacity-60" aria-hidden="true" />}
              </NavLink>
              <AnimatePresence>
                {item.children && menu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-full mt-2 w-[340px] rounded-lg border border-white/10 bg-ink-2/95 p-2 shadow-2xl backdrop-blur-md"
                    onMouseEnter={() => openMenu(item.label)} onMouseLeave={scheduleClose}
                  >
                    {item.children.map((c) => (
                      <Link key={c.to + c.label} to={c.to} className="block rounded-md px-3 py-2.5 hover:bg-white/5" onBlur={scheduleClose}>
                        <div className="text-[14px] text-paper">{c.label}</div>
                        {c.text && <div className="text-[12.5px] text-stone">{c.text}</div>}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="nav-actions flex items-center gap-3">
          <a href={COMPANY.appUrl} className={`hidden shrink-0 whitespace-nowrap !px-4 !py-2 text-[14px] md:inline-flex ${tone === 'paper' && !open ? 'btn-ghost-ink' : 'btn-ghost'}`}>Sign in</a>
          <Link to="/contact?intent=demo" className={`hidden shrink-0 whitespace-nowrap !px-4 !py-2 text-[14px] md:inline-flex ${tone === 'paper' && !open ? 'btn-primary-ink' : 'btn-primary'}`}>Request a demo</Link>
          {/* the menu button also shows on desktop while the home intro is on screen */}
          <button type="button" className="nav-burger rounded-md p-2 xl:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="nav-sheet fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ink px-4 pb-10 pt-4 text-paper md:top-[72px] xl:hidden" role="dialog" aria-label="Menu">
            <div className="mx-auto w-full max-w-[880px]">
            <nav className="flex flex-col divide-y divide-white/10" aria-label="Mobile">
              {NAV.map((item) => (
                <div key={item.label} className="py-3">
                  <Link to={item.to} className="block py-2 text-[22px] font-medium tracking-tight">{item.label}</Link>
                  {item.children && (
                    <div className="mt-1 grid gap-1 pl-3">
                      {item.children.map((c) => <Link key={c.to + c.label} to={c.to} className="py-1.5 text-[15px] text-stone">{c.label}</Link>)}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/contact?intent=demo" className="btn-primary">Request a demo</Link>
              <a href={COMPANY.appUrl} className="btn-ghost">Sign in</a>
              <Link to="/design-your-system" className="btn-ghost">Design System</Link>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
