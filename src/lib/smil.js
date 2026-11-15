/**
 * SVG SMIL animations (<animate>, <animateMotion>) keep running — and keep the main thread busy — even when
 * they are scrolled off-screen. This pauses every animated <svg> while it is out of view and resumes it when it
 * comes back, including SVGs that mount later (lazy sections, route changes).
 */
export function installSmilPauser() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return
  const seen = new WeakSet()
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const svg = e.target
      if (typeof svg.pauseAnimations !== 'function') continue
      if (e.isIntersecting) svg.unpauseAnimations()
      else svg.pauseAnimations()
    }
  }, { rootMargin: '150px 0px' })
  const scan = () => {
    document.querySelectorAll('animate, animateMotion, animateTransform').forEach((a) => {
      const svg = a.ownerSVGElement
      // only top-level SVGs have their own timeline; nested ones follow their root
      let root = svg
      while (root?.ownerSVGElement) root = root.ownerSVGElement
      if (root && !seen.has(root)) { seen.add(root); io.observe(root) }
    })
  }
  let queued = false
  const mo = new MutationObserver(() => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => { queued = false; scan() })
  })
  mo.observe(document.body, { childList: true, subtree: true })
  scan()
}
