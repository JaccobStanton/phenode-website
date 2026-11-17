// Shared by the scripts here: the browser, and waiting for the home page to finish building.
import { chromium } from 'playwright'

/** Playwright's own Chromium (`npx playwright install chromium`), or the one at CHROMIUM_PATH. */
export const launch = () => chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})

/**
 * The home page builds everything below the intro a moment after it loads, a section at a time (src/pages/Home.jsx,
 * src/sections/home/AfterIntro.jsx): on the home page, wait for its last section. Elsewhere it returns at once.
 */
export async function homeReady(page) {
  const { pathname, hash } = new URL(page.url())
  if (pathname !== '/' || (hash && hash !== '#/')) return
  await page.waitForFunction(() => document.getElementById('final'), null, { timeout: 20000 }).catch(() => {})
  await page.waitForTimeout(400)
}
