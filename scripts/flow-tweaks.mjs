// Visual checks for the Oct 7 tweaks: hero data path, 02 buttons + stacked elevation, 03 copy/buttons/map key, button hovers.
// Usage: npx vite preview --port 4173 & node scripts/flow-tweaks.mjs
import { chromium } from 'playwright'
import fs from 'node:fs'
const out = 'shots/tweaks'; fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })

async function run(width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${out}/${width}-hero.png` })
  // walk the page so reveals fire
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)) } })
  const shot = async (sel, name, offset = -100) => {
    await page.locator(sel).first().scrollIntoViewIfNeeded()
    await page.evaluate((o) => window.scrollBy(0, o), offset)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}/${width}-${name}.png` })
  }
  await shot('#what-is-phenode a:has-text("Explore the system")', '02-buttons', -360)
  const sizes = await page.evaluate(() => {
    const r = (t) => { const a = [...document.querySelectorAll('a')].find((x) => x.textContent.trim() === t); if (!a) return null; const b = a.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)] }
    const img = document.querySelector('#what-is-phenode img'); const ib = img.getBoundingClientRect()
    return { explore: r('Explore the system'), how: r('How it works'), see: r('See it in your environment'), node: r('The wireless node'), elevation: [Math.round(ib.width), Math.round(ib.height)], section02: Math.round(document.querySelector('#what-is-phenode').getBoundingClientRect().height) }
  })
  console.log(width, JSON.stringify(sizes))
  if (width < 1024) await shot('#what-is-phenode img', '02-elevation', -120)
  await shot('#hyperlocal [aria-label="Map key"]', '03-key', -360)
  await shot('#hyperlocal a:has-text("See it in your environment")', '03-buttons', -420)
  if (width >= 1024) {
    const see = page.locator('#hyperlocal a:has-text("See it in your environment")')
    await see.hover(); await page.waitForTimeout(500)
    const b = await see.boundingBox()
    await page.screenshot({ path: `${out}/${width}-hover-see.png`, clip: { x: b.x - 40, y: b.y - 40, width: 640, height: b.height + 80 } })
    const ex = page.locator('#what-is-phenode a:has-text("Explore the system")')
    await ex.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -200)); await ex.hover(); await page.waitForTimeout(500)
    const e = await ex.boundingBox()
    await page.screenshot({ path: `${out}/${width}-hover-explore.png`, clip: { x: e.x - 40, y: e.y - 40, width: 560, height: e.height + 80 } })
    const how = page.locator('#what-is-phenode a:has-text("How it works")')
    await how.hover(); await page.waitForTimeout(500)
    await page.screenshot({ path: `${out}/${width}-hover-how.png`, clip: { x: e.x - 40, y: e.y - 40, width: 560, height: e.height + 80 } })
  }
  await page.close()
}
await run(1440, 900)
await run(820, 1180)
await run(390, 844)
await browser.close()
