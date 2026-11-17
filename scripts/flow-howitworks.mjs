// Visual check for home 04 "How PheNode works": the sticky journey at each stage, plus layout fit.
// Usage: npx vite preview --port 4173 & node scripts/flow-howitworks.mjs [baseUrl] [WxH ...]
import { launch, homeReady } from './browser.mjs'
import fs from 'node:fs'
const out = 'shots/howitworks'; fs.mkdirSync(out, { recursive: true })
const base = process.argv[2] && process.argv[2].startsWith('http') ? process.argv[2] : 'http://localhost:4173'
const sizes = process.argv.slice(2).filter((a) => /^\d+x\d+$/.test(a)).map((s) => s.split('x').map(Number))
const browser = await launch()
const STAGES = 8
// invert easeInOut so each shot lands in the middle of a stage
const inv = (y) => (y < 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt(2 * (1 - y)) / 2)

async function run(width, height, { reduced = false } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await homeReady(page)
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
  const tag = `${width}x${height}${reduced ? '-reduced' : ''}`
  const geo = await page.evaluate(() => {
    const w = document.querySelector('#how-it-works > div'); const r = w.getBoundingClientRect()
    return { top: r.top + window.scrollY, h: r.height, sticky: getComputedStyle(w.firstElementChild).position === 'sticky' }
  })
  if (geo.sticky && !reduced) {
    for (let i = 0; i < STAGES; i++) {
      const prog = 0.02 + inv(i / (STAGES - 1)) * 0.96
      const y = geo.top + prog * (geo.h - height)
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
      await page.waitForTimeout(1500)
      const m = await page.evaluate(() => {
        const c = document.querySelector('#how-it-works .container-x').getBoundingClientRect()
        const panel = document.querySelector('#how-it-works [data-stage]')
        const pr = panel && panel.getBoundingClientRect()
        const h2 = document.querySelector('#how-it-works h2').getBoundingClientRect()
        const btn = [...document.querySelectorAll('#how-it-works a')].pop().getBoundingClientRect()
        return { content: [Math.round(c.top), Math.round(c.bottom)], h2Top: Math.round(h2.top), lastBtnBottom: Math.round(btn.bottom), stage: panel?.dataset.stage, panel: pr && [Math.round(pr.width), Math.round(pr.height)] }
      })
      console.log(tag, 'stage', i, JSON.stringify(m), m.lastBtnBottom > height ? 'OVERFLOW' : '')
      await page.screenshot({ path: `${out}/${tag}-stage${i}.png` })
    }
  } else {
    // not pinned below lg: walk through the section and capture it top to bottom
    const sec = page.locator('#how-it-works')
    await sec.scrollIntoViewIfNeeded()
    await page.evaluate((t) => window.scrollTo(0, t), geo.top)
    const steps = Math.max(1, Math.ceil(geo.h / (height * 0.8)))
    for (let k = 0; k <= steps; k++) {
      await page.evaluate((yy) => window.scrollTo(0, yy), geo.top + k * height * 0.8 - 60)
      await page.waitForTimeout(1400)
      const st = await page.evaluate(() => document.querySelector('#how-it-works [data-stage]')?.dataset.stage)
      console.log(tag, 'step', k, 'stage', st)
      await page.screenshot({ path: `${out}/${tag}-step${k}.png` })
    }
  }
  if (errors.length) console.log(tag, 'ERRORS', [...new Set(errors)])
  await page.close()
}
const list = sizes.length ? sizes : [[1440, 900], [1280, 720], [820, 1180], [390, 844]]
for (const [w, h] of list) await run(w, h)
if (!sizes.length) await run(1440, 900, { reduced: true })
await browser.close()
