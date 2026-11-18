// scripts/hero-lab-safari.js — not for node: paste into Safari's console. See README › Scripts.
// Hero lab, round 2 (Nov 18): checks the fixed hero in Safari. Paste into Safari's console on the home page
// (npm run build, then npm run preview → http://localhost:4173/), press Return, and leave Safari in front, with the
// console docked in the same window, for about three minutes. It opens and closes two components under each variant and
// shows a table at the end. "worst" = the longest frame (ms), ">50" = frames longer than 50 ms, "fps" = frames per
// second, each over the 1.3 s after a click; "first" = ms from the click to the next frame. Samples taken while the
// window wasn't drawing (another app in front) are dropped and counted under "dropped".
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const find = () => document.querySelector('section[aria-label="Understand your environment"]')
  if (!find()) window.dispatchEvent(new Event('scroll')) // the hero arrives with the rest of the home page
  for (let i = 0; i < 50 && !find(); i++) await sleep(100)
  const hero = find()
  if (!hero) { console.log('Open the home page first (http://localhost:4173/).'); return }
  const station = hero.querySelector('[class*="max-w-[760px]"]')
  const style = document.createElement('style')
  document.head.append(style)
  const H = 'section[aria-label="Understand your environment"]'
  const CSS = {
    spotOff: `${H} [style*="mask-image"]{display:none!important}`,
    headerBlurOff: `header{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}`,
    promoted: `${H} [style*="scale("]{will-change:transform!important} ${H} [class*="max-w-[760px]"]{will-change:transform!important}`,
    zoomOff: `${H} [style*="scale("]{transform:none!important;transition:none!important}`,
  }
  let noGlide = false
  const animate = Element.prototype.animate
  Element.prototype.animate = function (k, o) { return animate.call(this, k, noGlide && this === station ? { ...o, duration: 0 } : o) }

  // [name, css keys, glide off, old grain back on]
  const VARIANTS = [
    ['baseline (fixed hero)', []],
    ['old grain back on', [], false, true],
    ['spotlight (css mask): off', ['spotOff']],
    ['layers promoted (will-change)', ['promoted']],
    ['zoom: off', ['zoomOff']],
    ['glide: off', [], true],
    ['header blur: off', ['headerBlurOff']],
    ['baseline (again)', []],
  ]
  const PARTS = ['radiation', 'solar']

  const measure = async (act, ms = 1300) => {
    const r0 = station.getBoundingClientRect()
    const gaps = []
    let first = null, moved = null, done = false, hidden = document.hidden
    const t0 = performance.now()
    let last = t0
    const tick = () => {
      const t = performance.now()
      gaps.push(t - last); last = t
      hidden = hidden || document.hidden
      if (first === null) first = t - t0
      if (moved === null) { const r = station.getBoundingClientRect(); if (Math.abs(r.left - r0.left) >= 1 || Math.abs(r.top - r0.top) >= 1) moved = t - t0 }
      if (t - t0 < ms) requestAnimationFrame(tick); else done = true
    }
    act()
    requestAnimationFrame(tick)
    while (!done) await sleep(40)
    const worst = Math.max(...gaps)
    return { ok: !hidden && worst < 1000, first, moved, worst, long: gaps.filter((g) => g > 50).length, fps: gaps.length / (ms / 1000) }
  }
  const open = (id) => () => hero.querySelector(`[data-part="${id}"]`).click()
  const close = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

  window.scrollTo(0, hero.getBoundingClientRect().top + window.scrollY)
  await sleep(3500) // the hero's entrance
  for (const id of PARTS) { open(id)(); await sleep(1800); close(); await sleep(1800) } // warm-up: hi-res render loaded

  const panel = document.createElement('div')
  panel.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:99999;max-width:min(980px,calc(100vw - 32px));padding:12px 14px;border-radius:10px;background:#fff;color:#111;font:12px/1.45 ui-monospace,Menlo,monospace;box-shadow:0 8px 30px rgba(0,0,0,.4);pointer-events:none'
  document.body.append(panel)
  const rows = []
  for (const [name, keys, glideOff, grain] of VARIANTS) {
    panel.textContent = `Hero lab: ${rows.length + 1} of ${VARIANTS.length} (${name}). Please don't touch the mouse or keyboard.`
    style.textContent = keys.map((k) => CSS[k]).join('\n')
    noGlide = Boolean(glideOff)
    hero.classList.toggle('grain', Boolean(grain))
    await sleep(600)
    const o = [], c = []
    let dropped = 0
    for (const id of PARTS) {
      for (let rep = 0; rep < 2; rep++) {
        const a = await measure(open(id)); await sleep(700)
        const b = await measure(close); await sleep(1200)
        if (a.ok) o.push(a); else dropped++
        if (b.ok) c.push(b); else dropped++
      }
    }
    const avg = (a, k) => (a.length ? Math.round(a.reduce((s, x) => s + (x[k] ?? 0), 0) / a.length) : 'n/a')
    rows.push({ variant: name, 'open first': avg(o, 'first'), 'open worst': avg(o, 'worst'), 'open >50': avg(o, 'long'), 'open fps': avg(o, 'fps'), 'close first': avg(c, 'first'), 'close worst': avg(c, 'worst'), 'close >50': avg(c, 'long'), 'close fps': avg(c, 'fps'), dropped })
    console.log(`done: ${name}`)
  }
  style.remove(); noGlide = false; Element.prototype.animate = animate; hero.classList.remove('grain')
  const head = Object.keys(rows[0])
  const text = [navigator.userAgent, head.join('\t'), ...rows.map((r) => head.map((h) => r[h]).join('\t'))].join('\n')
  console.table(rows)
  console.log(text)
  panel.style.pointerEvents = 'auto'
  panel.innerHTML = '<b>Hero lab: done.</b> Copy the results and paste them to Claude. '
  const btn = document.createElement('button')
  btn.textContent = 'Copy results'
  btn.style.cssText = 'margin:0 8px;padding:4px 10px;border-radius:6px;border:1px solid #111;background:#1A75E0;color:#fff;font:inherit;cursor:pointer'
  const x = document.createElement('button')
  x.textContent = 'Close'
  x.style.cssText = 'padding:4px 10px;border-radius:6px;border:1px solid #999;background:#fff;color:#111;font:inherit;cursor:pointer'
  const pre = document.createElement('pre')
  pre.textContent = text
  pre.style.cssText = 'margin:8px 0 0;max-height:40vh;overflow:auto;white-space:pre;user-select:text'
  btn.onclick = async () => {
    try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied' } catch {
      const r = document.createRange(); r.selectNodeContents(pre); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); btn.textContent = 'Selected: press ⌘C'
    }
  }
  x.onclick = () => panel.remove()
  panel.append(btn, x, pre)
})()
