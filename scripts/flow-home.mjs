// Exercises homepage interactions: role selection, solution explorer, software module toggles, hardware hotspots, mobile menu.
import { chromium } from 'playwright'
import fs from 'node:fs'
const width = Number(process.argv[2] || 1440)
const height = width < 500 ? 844 : 900
const out = 'shots/flow'; fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage({ viewport: { width, height } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('ERR_TUNNEL')) errors.push(m.text()) })
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
const shot = async (name) => { await page.waitForTimeout(800); await page.screenshot({ path: `${out}/home-${width}-${name}.png` }); console.log('shot', name) }
const scrollTo = async (sel, dy = -80) => page.evaluate(([s, d]) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + d) }, [sel, dy])

if (width < 500) {
  await page.getByRole('button', { name: 'Open menu' }).click(); await shot('menu')
  await page.getByRole('button', { name: 'Close menu' }).click()
}
await scrollTo('#perspective')
await page.getByRole('button', { name: 'Transportation / infrastructure manager' }).click(); await shot('role-selected')
await page.getByRole('button', { name: /Fire weather conditions/ }).click(); await page.waitForTimeout(500)
await scrollTo('[aria-label="Environmental questions"]', -60); await shot('explorer-open')
await scrollTo('#applications'); await shot('applications-reordered')
await scrollTo('#hardware', 300); await page.waitForTimeout(2500)
await page.getByRole('button', { name: 'Battery + USB-C' }).last().click(); await shot('hotspot')
await scrollTo('#software', 1600)
await page.getByRole('switch', { name: /API access/ }).click(); await shot('software-modules')
if (errors.length) { console.log('ERRORS:'); errors.forEach((e) => console.log(' ', e)) }
await browser.close()
