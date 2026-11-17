// Runs axe-core on every route (desktop + mobile) and prints violations.
import { launch, homeReady } from './browser.mjs'
import fs from 'node:fs'
const axe = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8')
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/phenode', '/applications', '/applications/agriculture', '/case-studies', '/resources', '/support', '/contact', '/company', '/legal/privacy']
const browser = await launch()
let total = 0
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  for (const r of routes) {
    await page.goto('http://localhost:4173' + r, { waitUntil: 'networkidle' })
    await homeReady(page)
    // the home intro's words and button fade in for 2.6 s; axe would measure their contrast mid-fade
    await page.waitForTimeout(r === '/' ? 2600 : 500)
    await page.addScriptTag({ content: axe })
    const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'], rules: { 'color-contrast': { enabled: true } } }))
    const v = res.violations
    total += v.length
    if (v.length) {
      console.log(`\n${w}px ${r}: ${v.length} violation(s)`)
      v.forEach((x) => console.log(`  - [${x.impact}] ${x.id}: ${x.help} (${x.nodes.length}) e.g. ${x.nodes[0].target[0]}`))
    }
  }
  await page.close()
}
console.log(`\nTotal violations: ${total}`)
await browser.close()
