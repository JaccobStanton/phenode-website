// Finds clickable elements whose hit area is covered by another element (e.g. an invisible decorative layer).
// Usage: npx vite preview --port 4173 & node scripts/hit-scan.mjs [baseUrl] [route ...]
import { launch, homeReady } from './browser.mjs'
const base = process.argv[2] && process.argv[2].startsWith('http') ? process.argv[2] : 'http://localhost:4173'
const args = process.argv.slice(2).filter((a) => a.startsWith('/'))
const routes = args.length ? args : ['/', '/phenode', '/applications', '/applications/agriculture', '/case-studies', '/resources', '/support', '/contact', '/company']
const browser = await launch()
let issues = 0
for (const [w, h] of [[1440, 900], [1024, 768], [820, 1180], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.addInitScript(() => localStorage.setItem('agrela.personalization.v1', JSON.stringify({ roleId: 'infrastructure' })))
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'networkidle' })
    await homeReady(page)
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
    await page.waitForTimeout(1200)
    const found = new Map()
    const H = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < H; y += Math.round(h * 0.7)) {
      await page.evaluate((yy) => scrollTo(0, yy), y)
      await page.waitForTimeout(250)
      const res = await page.evaluate(() => {
        const out = []
        const header = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
        for (const el of document.querySelectorAll('a[href], button, [role="button"], input, select, textarea, summary')) {
          const b = el.getBoundingClientRect()
          if (b.width < 8 || b.height < 8 || b.top < header + 2 || b.bottom > innerHeight - 2 || b.left < 0 || b.right > innerWidth) continue
          const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.pointerEvents === 'none' || Number(cs.opacity) === 0) continue
          let hit = 0, n = 0; const by = new Set()
          // sample each line box separately, so a link that wraps onto two lines isn't probed in the empty corner
          for (const rb of el.getClientRects()) {
            if (rb.width < 4 || rb.height < 4) continue
            for (const fx of [0.15, 0.32, 0.5, 0.68, 0.85]) for (const fy of [0.3, 0.5, 0.7]) {
              const t = document.elementFromPoint(rb.left + fx * rb.width, rb.top + fy * rb.height); n++
              if (t && (t === el || el.contains(t))) hit++
              else if (t) by.add(t.tagName + '.' + String(t.className).slice(0, 60))
            }
          }
          if (hit < n) out.push({ el: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40), cover: `${n - hit}/${n}`, by: [...by].slice(0, 2) })
        }
        return out
      })
      for (const x of res) found.set(x.el + '|' + x.by.join(','), x)
    }
    if (found.size) { issues += found.size; console.log(`${w} ${r}`); for (const x of found.values()) console.log('   ', JSON.stringify(x)) }
  }
  await page.close()
}
console.log('covered elements:', issues)
await browser.close()
