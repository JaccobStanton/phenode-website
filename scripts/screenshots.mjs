// Screenshot every route at desktop / tablet / mobile widths against a running preview server.
// Usage: node scripts/screenshots.mjs [baseUrl] [routes...]
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const base = process.argv[2] || 'http://localhost:4173'
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/phenode', '/applications', '/applications/transportation', '/applications/agriculture', '/applications/ecology', '/applications/urban', '/case-studies', '/case-studies/the-ray-i85', '/design-your-system', '/resources', '/support', '/contact', '/company', '/legal/privacy']
const sizes = { desktop: [1440, 900], tablet: [1024, 1366], mobile: [390, 844] }
const out = process.env.SHOT_DIR || 'shots'
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
for (const [name, [w, h]] of Object.entries(sizes)) {
  if (process.env.SIZES && !process.env.SIZES.split(',').includes(name)) continue
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name} console: ${m.text()}`) })
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
    await page.waitForTimeout(600)
    // Scroll through the page so scroll-triggered content reveals, then back to top.
    const total = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < total; y += h * 0.6) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120) }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    const file = path.join(out, `${name}${r === '/' ? '-home' : r.replace(/\//g, '-')}.png`)
    await page.screenshot({ path: file, fullPage: !!process.env.FULL })
    console.log('shot', file)
  }
  if (errors.length) { console.log('ERRORS:'); errors.forEach((e) => console.log(' ', e)) }
  await ctx.close()
}
await browser.close()
