// Walks the configurator end to end and screenshots each step. Usage: node scripts/flow-configurator.mjs [width]
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
await page.goto('http://localhost:4173/design-your-system', { waitUntil: 'networkidle' })
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
const shot = async (name) => { await page.waitForTimeout(700); await page.screenshot({ path: `${out}/${width}-${name}.png` }); console.log('shot', name) }
const scrollTo = async (sel) => page.evaluate((s) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90) }, sel)
await scrollTo('[aria-label="Configurator steps"]')
await page.getByRole('button', { name: 'Agricultural research' }).click(); await shot('01-application')
await page.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(400)
await page.getByRole('button', { name: /^Field/ }).click(); await shot('02-scale')
await page.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(600); await shot('03-base')
await page.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(400)
await page.getByRole('button', { name: 'More Wireless nodes' }).click(); await page.getByRole('button', { name: 'More Wireless nodes' }).click(); await shot('04-nodes')
await page.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(400); await shot('05-configure')
await page.locator('[aria-label^="Node 4,"]').first().click({ force: true }); await page.waitForTimeout(900); await shot('05b-node-selected')
await page.getByRole('button', { name: 'Back to template' }).click()
await page.getByRole('button', { name: 'Continue' }).click(); await page.waitForTimeout(400); await shot('06-software')
await page.getByRole('switch', { name: /API access/ }).click()
await page.getByRole('button', { name: 'Review your system' }).click(); await page.waitForTimeout(600); await shot('07-summary')
await page.getByRole('button', { name: /Talk to Agrela about this system/ }).click(); await page.waitForTimeout(600)
await page.evaluate(() => window.scrollBy(0, 500)); await shot('08-form')
if (errors.length) { console.log('ERRORS:'); errors.forEach((e) => console.log(' ', e)) }
await browser.close()
