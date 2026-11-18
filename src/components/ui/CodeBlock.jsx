import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/** Shell variables ($API_URL, $ACCESS_TOKEN…) in light cyan; everything else as written. */
function highlight(code) {
  return code.split(/(\$[A-Z_][A-Z0-9_]*)/).map((part, i) => (i % 2 ? <span key={i} className="text-data-2">{part}</span> : part))
}

/**
 * A command to copy (the API page, Nov 18): dark, in the mono face, with a Copy button that puts exactly `code` on
 * the clipboard. Long lines scroll sideways inside the block (it takes keyboard focus for that), never the page.
 * `name` finishes the button's name for screen readers ("Copy the request URL"), since a page has several.
 * Where the clipboard can't be written (an older browser, a page without permission), the button selects the code
 * instead, so ⌘C / Ctrl+C copies it.
 */
export default function CodeBlock({ code, name, label = 'Shell' }) {
  const [copied, setCopied] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    if (!copied) return undefined
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      const range = document.createRange()
      range.selectNodeContents(box.current)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-ink text-paper">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 py-1.5 pr-1.5 pl-4">
        <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-stone">{label}</span>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[11.5px] tracking-[0.06em] text-paper/80 transition-colors hover:bg-white/10 hover:text-paper">
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
          {name && <span className="sr-only"> {name}</span>}
        </button>
        <span className="sr-only" role="status">{copied ? 'Copied to the clipboard' : ''}</span>
      </div>
      {/* focusable: a box that scrolls sideways has to be reachable by keyboard */}
      <pre tabIndex={0} className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.75] text-paper/90 sm:px-5 sm:text-[13px]">
        <code ref={box}>{highlight(code)}</code>
      </pre>
    </div>
  )
}
