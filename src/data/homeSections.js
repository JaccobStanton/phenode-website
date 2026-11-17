import { FEATURES } from './features.js'

/**
 * Home page section order, for the numbered eyebrows ("06 — Software"). The hero counts as 01 (it shows no number).
 * Sections that are switched off (data/features.js) drop out, so the numbers on the page stay consecutive.
 */
const ORDER = [
  'hero', 'what-is', 'hyperlocal', 'how-it-works', 'perspective',
  FEATURES.homeApplications && 'applications',
  FEATURES.homeHardware && 'hardware',
  FEATURES.designSystem && 'build',
  'software', 'scale', 'data-ownership', 'proof',
  FEATURES.homeCaseStudies && 'case-studies',
].filter(Boolean)

/** The section's number as shown, e.g. homeNo('software') → "06" while the home Applications and Hardware sections are hidden. */
export const homeNo = (id) => String(ORDER.indexOf(id) + 1).padStart(2, '0')
