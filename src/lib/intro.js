/**
 * The home intro (sections/home/IntroHero.jsx) and the header it shares the screen with.
 *
 * While the intro is on screen the header is reduced to the logo, Sign in, Request a demo and the menu button; the
 * page tabs appear once the visitor is on the hero below it. That state lives on <html> as a data attribute, so the
 * header's CSS (index.css, "Header with the home intro") can follow it without the intro and the nav knowing about
 * each other:
 *   data-intro="top" | "past"   the intro is in view | the visitor is on the hero or further down
 */

// TEMPORARY (Jake, Nov 13): show the intro on every visit and never remove it, so it can be reviewed.
// Set to false to restore once per visit.
export const ALWAYS_SHOW = true

const SEEN = 'agrela:intro-seen' // sessionStorage: the intro shows once per visit (a new tab or window is a new visit)

export const hasSeen = () => { try { return window.sessionStorage.getItem(SEEN) === '1' } catch { return false } }
export const markSeen = () => { try { window.sessionStorage.setItem(SEEN, '1') } catch { /* storage blocked: it simply shows again next time */ } }
export const introWillShow = () => ALWAYS_SHOW || !hasSeen()

/**
 * The intro's "Explore PheNode" slide. While it carries the page down, <html> has data-intro-slide; when it lands,
 * INTRO_LANDED fires on window. The hero below waits for the landing to play its entrance (sections/home/Hero.jsx),
 * so the visitor sees it arrive rather than finding it already there.
 */
export const INTRO_LANDED = 'agrela:intro-landed'

/** Whether the app is starting on the home page (BrowserRouter, or the preview's HashRouter). */
function startingOnHome() {
  if (import.meta.env.VITE_ROUTER === 'hash') return /^#?\/?(\?.*)?$/.test(window.location.hash)
  if (import.meta.env.VITE_ROUTER === 'memory') return false
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const path = window.location.pathname
  return path === `${base}/` || path === base || path === `${base}/index.html`
}

/**
 * At start-up, before the first paint. The home page loads lazily, so without this the full header (with its tabs)
 * would show for a moment and then reduce when the intro mounts.
 */
export function primeIntroHeader() {
  if (typeof window === 'undefined' || !startingOnHome() || !introWillShow()) return
  document.documentElement.dataset.intro = 'top'
}

/** Leaving the home page: back to the full header (in case the intro never got to clean up). */
export function clearIntroHeader() {
  delete document.documentElement.dataset.intro
}
