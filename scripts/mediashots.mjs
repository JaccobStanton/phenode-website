// Screenshots of every section that carries real PheNode software media (captures of 7 Oct 2026).
// Usage: npx vite preview --port 4173 & node scripts/mediashots.mjs [width]
import { chromium } from 'playwright'
import fs from 'node:fs'
const width = Number(process.argv[2] || 1440)
const out = 'shots/media'; fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage({ viewport: { width, height: width < 500 ? 844 : 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('ERR_TUNNEL')) errors.push(m.text()) })
page.on('requestfailed', (r) => errors.push('FAILED ' + r.url()))
page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
const go = async (path) => { await page.goto('http://localhost:4173' + path, { waitUntil: 'networkidle' }); await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' }) }
const at = async (sel, name, offset = -80) => {
  const el = page.locator(sel).first()
  await el.scrollIntoViewIfNeeded(); await page.evaluate(async (o) => { window.scrollBy(0, o) }, offset)
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${out}/${width}-${name}.png` }); console.log('shot', name)
}
const video = (sel) => page.evaluate((s) => { const v = document.querySelector(s); return v && { paused: v.paused, t: +v.currentTime.toFixed(2), src: v.currentSrc.split('/').pop(), w: v.videoWidth } }, sel)

await go('/')
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } })
await at('#software video', 'home-video', -200)
console.log('home video', JSON.stringify(await video('#software video')))
await at('#software figure', 'home-cards', -150)

// the PheNode page is one long page since Nov 16: its parts are #base-station, #wireless-node, #data-platform, #software
await go('/phenode'); await at('#software', 'software-hero', 0)
await at('[aria-label="Software views"]', 'software-views', -120)
for (const [name, re] of [['diagnostics', /System diagnostics/], ['downloads', /^\s*11\s*Downloads/], ['base', /^\s*02\s*Base station/]]) {
  const b = page.getByRole('button', { name: re }).first()
  if (await b.count()) { await b.click(); await page.waitForTimeout(900); await page.screenshot({ path: `${out}/${width}-software-views-${name}.png` }); console.log('shot views', name) } else console.log('no button', name)
}
await at('text=On a phone, too.', 'software-phone', -160)

await at('text=What the base station reports.', 'base-station-sw', -100)
await page.evaluate(() => window.scrollBy(0, 700)); await page.waitForTimeout(1500)
await page.screenshot({ path: `${out}/${width}-base-station-sw-2.png` })
console.log('base video', JSON.stringify(await video('#base-station video')))
await at('text=Every node, on the map and on the chart.', 'node-sw', -100)
await page.evaluate(() => window.scrollBy(0, 800)); await page.waitForTimeout(1200)
await page.screenshot({ path: `${out}/${width}-node-sw-2.png` })
await at('text=Same columns, every site, every season.', 'data-downloads', -100)
await at('text=Because the data shares one schema, it lines up.', 'data-compare', -100)
await go('/case-studies/danforth-center-research'); await at('main figure', 'case-danforth', -150)
if (errors.length) { console.log('ERRORS:'); [...new Set(errors)].forEach((e) => console.log(' ', e)) }
await browser.close()
