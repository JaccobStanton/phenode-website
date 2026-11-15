// Viewport screenshots at a list of scroll positions or element selectors on one route.
// Usage: node scripts/sectionshots.mjs <route> <width> <sel-or-y>... e.g. node scripts/sectionshots.mjs / 1440 0 '#what-is-phenode' '#hyperlocal'
import { chromium } from 'playwright'
import fs from 'node:fs'

const [route = '/', widthArg = '1440', ...targets] = process.argv.slice(2)
const width = Number(widthArg)
const height = width < 500 ? 844 : width < 1100 ? 1366 : 900
const base = process.env.BASE || 'http://localhost:4173'
const out = process.env.SHOT_DIR || 'shots/sections'
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('ERR_TUNNEL')) errors.push(m.text()) })
await page.goto(base + route, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
await page.waitForTimeout(800)
// warm scroll so lazy sections mount
const total = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < total; y += height * 0.7) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(90) }
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300)

let i = 0
for (const t of targets) {
  i++
  if (/^-?\d+(\.\d+)?$/.test(t)) {
    await page.evaluate((y) => window.scrollTo(0, y), Number(t))
  } else if (t.startsWith('+')) {
    await page.evaluate((dy) => window.scrollBy(0, dy), Number(t.slice(1)))
  } else {
    const ok = await page.evaluate((sel) => { const el = document.querySelector(sel); if (!el) return false; const y = el.getBoundingClientRect().top + window.scrollY; window.scrollTo(0, y); return true }, t)
    if (!ok) { console.log('missing', t); continue }
    if (process.env.OFFSET) await page.evaluate((dy) => window.scrollBy(0, dy), Number(process.env.OFFSET))
  }
  await page.waitForTimeout(Number(process.env.WAIT || 900))
  const file = `${out}/${width}-${String(i).padStart(2, '0')}-${t.replace(/[^a-z0-9]+/gi, '_')}.png`
  await page.screenshot({ path: file })
  console.log('shot', file)
}
if (errors.length) { console.log('ERRORS:'); errors.forEach((e) => console.log(' ', e)) }
await browser.close()
