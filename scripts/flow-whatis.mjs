// 02 What is PheNode: pinned copy + scrolling elevation, then the system chain; plus hero hover (no box over the glow).
import { launch, homeReady } from './browser.mjs'
import fs from 'node:fs'
const width = Number(process.argv[2] || 1440)
const out = 'shots/whatis'; fs.mkdirSync(out, { recursive: true })
const browser = await launch()
const page = await browser.newPage({ viewport: { width, height: width < 500 ? 844 : 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await homeReady(page)
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
if (width >= 1024) {
  await page.locator('section[aria-label="Understand your environment"]').getByRole('button', { name: 'Control box' }).hover()
  await page.waitForTimeout(900); await page.screenshot({ path: `${out}/${width}-hero-hover.png` })
}
const top = await page.evaluate(() => document.querySelector('#what-is-phenode').getBoundingClientRect().top + scrollY)
const h = await page.evaluate(() => document.querySelector('#what-is-phenode').offsetHeight)
console.log('section height', h)
const steps = width < 500 ? 6 : 5
for (let i = 0; i < steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), top + (h - 700) * (i / (steps - 1)))
  await page.waitForTimeout(1100)
  await page.screenshot({ path: `${out}/${width}-step${i}.png` })
}
if (errors.length) console.log('ERRORS', errors)
await browser.close()
