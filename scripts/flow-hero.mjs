// Hero part explorer: idle tour frame, then hover on the image, then hover on the index strip.
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
const shot = async (name) => { await page.waitForTimeout(700); await page.screenshot({ path: `${out}/hero-${width}-${name}.png` }); console.log('shot', name) }
await page.waitForTimeout(4200); await shot('idle-tour')
const hero = page.locator('section[aria-labelledby="hero-title"]')
await hero.getByRole('button', { name: 'Ambient air' }).first().hover(); await shot('hover-image-air')
await hero.getByRole('button', { name: 'Imager' }).last().hover(); await shot('hover-strip-imager')
await page.mouse.move(10, 10); await shot('after-leave')
if (errors.length) { console.log('ERRORS:'); errors.forEach((e) => console.log(' ', e)) }
await browser.close()
