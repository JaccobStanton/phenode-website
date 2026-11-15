import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useReducedMotion } from '../../lib/motion.js'

/**
 * SentenceSelect: a word in a sentence that opens a list to change it (home 05).
 * Select-only combobox (WAI-ARIA APG). Focus stays on the word.
 * - Arrow keys, Home / End and Page Up / Down move through the options; typing a letter jumps to it.
 * - Enter or Space picks the option, Escape closes, Tab picks and moves on.
 * The list sits under the line the word ends on, inside `anchorRef` (the sentence), and stays within its width.
 *
 * groups: [{ id, label, options: [{ id, label, icon? }] }]
 * Spans throughout: the word and its list sit inside the sentence's text.
 */
export default function SentenceSelect({ label, value, text, groups, onChange, anchorRef, width = 640 }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const listId = `ss${uid}-list`
  const labelId = `ss${uid}-label`
  const options = groups.flatMap((g) => g.options)
  const current = Math.max(0, options.findIndex((o) => o.id === value))
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(current)
  const [pos, setPos] = useState(null)
  const comboRef = useRef(null)
  const listRef = useRef(null)
  const typed = useRef({ s: '', t: 0 })
  const reduced = useReducedMotion()
  const optId = (i) => `${listId}-${options[i]?.id}`

  const show = (i) => { setActive(i); setOpen(true) }
  // Picking the option already shown still reports it: on the example sentence, that is how a visitor confirms it.
  const choose = (i) => { setOpen(false); if (options[i]) onChange(options[i].id) }

  const place = useCallback(() => {
    const host = anchorRef.current, combo = comboRef.current
    if (!host || !combo) return
    const rects = combo.getClientRects()
    if (!rects.length) return
    const hr = host.getBoundingClientRect()
    const last = rects[rects.length - 1]
    const w = Math.min(width, hr.width)
    // under the word's last line, starting where that line of it starts; never past the sentence's right edge
    const left = Math.max(0, Math.min(last.left - hr.left, hr.width - w))
    setPos({ left, top: last.bottom - hr.top + 10, width: w })
  }, [anchorRef, width])

  useLayoutEffect(() => { if (open) place() }, [open, place, text])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!comboRef.current?.contains(e.target) && !listRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('resize', place)
    // A list that opens past the bottom of the screen scrolls into view, but never so far that the word goes under the header.
    const raf = requestAnimationFrame(() => {
      const r = listRef.current?.getBoundingClientRect(), c = comboRef.current?.getBoundingClientRect()
      if (!r || !c) return
      const over = r.bottom - (window.innerHeight - 16)
      if (over > 0) window.scrollBy({ top: Math.min(over, Math.max(0, c.top - 96)), behavior: reduced ? 'auto' : 'smooth' })
    })
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('resize', place); cancelAnimationFrame(raf) }
  }, [open, place, reduced])

  // On phones the list scrolls: keep the active option inside it (without scrolling the page)
  useEffect(() => {
    const list = listRef.current
    if (!open || !list || list.scrollHeight <= list.clientHeight) return
    const el = document.getElementById(optId(active))
    if (!el) return
    const top = el.offsetTop, h = el.offsetHeight
    if (top < list.scrollTop) list.scrollTop = top - 8
    else if (top + h > list.scrollTop + list.clientHeight) list.scrollTop = top + h - list.clientHeight + 8
  })

  // Typing jumps to the next option starting with those letters (one letter again cycles through them)
  const match = (ch, from) => {
    const now = Date.now(), t = typed.current
    t.s = now - t.t > 700 ? ch : t.s + ch
    t.t = now
    const q = t.s.toLowerCase()
    const start = t.s.length === 1 ? from + 1 : from
    for (let k = 0; k < options.length; k++) {
      const i = (start + k) % options.length
      if (options[i].label.toLowerCase().startsWith(q)) return i
    }
    return -1
  }

  const onKeyDown = (e) => {
    const n = options.length, { key } = e
    const printable = key.length === 1 && key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey
    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') { e.preventDefault(); show(current) }
      else if (key === 'Home') { e.preventDefault(); show(0) }
      else if (key === 'End') { e.preventDefault(); show(n - 1) }
      else if (printable) { const i = match(key, current); if (i >= 0) { e.preventDefault(); show(i) } }
      return
    }
    switch (key) {
      case 'ArrowDown': e.preventDefault(); if (!e.altKey) setActive((a) => Math.min(n - 1, a + 1)); break
      case 'ArrowUp': e.preventDefault(); if (e.altKey) choose(active); else setActive((a) => Math.max(0, a - 1)); break
      case 'Home': e.preventDefault(); setActive(0); break
      case 'End': e.preventDefault(); setActive(n - 1); break
      case 'PageDown': e.preventDefault(); setActive((a) => Math.min(n - 1, a + 10)); break
      case 'PageUp': e.preventDefault(); setActive((a) => Math.max(0, a - 10)); break
      case 'Enter': case ' ': e.preventDefault(); choose(active); break
      case 'Escape': e.preventDefault(); setOpen(false); break
      case 'Tab': choose(active); break
      default: if (printable) { const i = match(key, active); if (i >= 0) { e.preventDefault(); setActive(i) } }
    }
  }

  // the chevron stays on the line with the last word
  const words = text.split(' ')
  const lastWord = words.pop()
  return (
    <>
      {/* names the word and its list; hidden, so it is read once, as their name, not again as part of the sentence */}
      <span id={labelId} hidden>{label}</span>
      <span
        ref={comboRef}
        role="combobox"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open ? optId(active) : undefined}
        className="sentence-slot"
        onClick={() => (open ? setOpen(false) : show(current))}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
      >
        <span key={text} className="sentence-word">
          {words.length > 0 && `${words.join(' ')} `}
          <span className="whitespace-nowrap">{lastWord}<ChevronDown aria-hidden="true" className="sentence-chevron" /></span>
        </span>
      </span>
      <span
        ref={listRef}
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        hidden={!open}
        // clicks inside the list never take focus from the word, so it stays open and readable by assistive tech
        onMouseDown={(e) => e.preventDefault()}
        className="sentence-list absolute z-40 block max-h-[min(70vh,560px)] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-ink-2/95 p-1.5 text-left font-sans text-[15px] font-normal not-italic leading-normal tracking-normal whitespace-normal text-paper shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
        style={pos ? { left: pos.left, top: pos.top, width: pos.width } : undefined}
      >
        <span className="block sm:columns-2 sm:gap-1.5">
          {groups.map((g) => (
            <span key={g.id} role="group" aria-labelledby={`${listId}-g-${g.id}`} className="block break-inside-avoid pb-1">
              <span id={`${listId}-g-${g.id}`} role="presentation" className="block px-3 pb-1.5 pt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone">{g.label}</span>
              {g.options.map((o) => {
                const i = options.indexOf(o)
                const on = o.id === value
                const Icon = o.icon
                return (
                  <span
                    key={o.id}
                    id={optId(i)}
                    role="option"
                    aria-selected={on}
                    onClick={() => choose(i)}
                    onMouseMove={() => { if (active !== i) setActive(i) }}
                    className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150 ${i === active ? 'bg-white/[0.08] text-paper' : 'text-paper/80'}`}
                  >
                    {Icon && <Icon size={16} strokeWidth={1.7} aria-hidden="true" className="shrink-0 text-phenode-blue-light" />}
                    <span className="min-w-0 flex-1">{o.label}</span>
                    {on && <Check size={15} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-phenode-blue-light" />}
                  </span>
                )
              })}
            </span>
          ))}
        </span>
      </span>
    </>
  )
}
