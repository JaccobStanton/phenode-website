/**
 * Google Analytics for the live site, through Firebase (project agrela-website, measurement ID G-K56W00D5EV; Jake,
 * Nov 18). main.jsx calls startAnalytics() once per page load. It does nothing unless all of these hold:
 *
 * - a production build (import.meta.env.PROD), so never `npm run dev`;
 * - with the site's real addresses (no VITE_ROUTER), so never the hash-routed Claude preview, whose content policy
 *   blocks Google's scripts anyway. In those builds the Firebase code isn't even in the output;
 * - not served from this computer (`npm run preview`, test servers) or from Netlify's preview copy (NOT_LIVE);
 * - in a browser Analytics can work in (isSupported(): cookies and IndexedDB available, not an extension page).
 *
 * The Firebase code (about 16 KB compressed, three chunks of its own) is fetched only then, once the page has loaded
 * and the browser is idle, so it never holds up the first screen; Google's own script (gtag.js) follows. If either is
 * blocked (an ad blocker, offline), the site carries on without them.
 *
 * Page views: the site changes pages without reloading. Google Analytics logs a page_view for each change through its
 * enhanced measurement ("Page changes based on browser history events", on by default in the web stream's settings).
 * Nothing here logs page views by hand: Analytics would then count each change twice, since it sends the history ones
 * even with send_page_view turned off.
 */

// Firebase's web config identifies the project to Google; it isn't a secret (Firebase ships it to every visitor).
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDGTR5ArbPZ7EzSLFQ5fsiu0TqZ5qJa4fY',
  authDomain: 'agrela-website.firebaseapp.com',
  projectId: 'agrela-website',
  storageBucket: 'agrela-website.firebasestorage.app',
  messagingSenderId: '332742244182',
  appId: '1:332742244182:web:40cbbee723a9d7a630c8f7',
  measurementId: 'G-K56W00D5EV',
}

// Hosts that serve this build but aren't the live site: this computer, and Netlify (it builds every push to main).
const NOT_LIVE = /^(localhost|127(\.\d{1,3}){3}|\[::1\]|0\.0\.0\.0)$|\.local$|\.netlify\.app$/

export function startAnalytics() {
  if (!import.meta.env.PROD || import.meta.env.VITE_ROUTER) return
  if (NOT_LIVE.test(window.location.hostname)) return
  const start = async () => {
    try {
      const [{ initializeApp }, { getAnalytics, isSupported }] = await Promise.all([import('firebase/app'), import('firebase/analytics')])
      if (await isSupported()) getAnalytics(initializeApp(FIREBASE_CONFIG))
    } catch (e) {
      // Blocked, offline, or a build made without the firebase package (`npm install`): no analytics for this visit.
      // Said in the console, because on Nov 19 it failed silently on the live site (built before npm install).
      console.warn('Google Analytics did not start:', e)
    }
  }
  const whenIdle = () => (window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 4000 }) : setTimeout(start, 1000))
  if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
}
