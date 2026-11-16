import { FEATURES } from './features.js'

/**
 * Home page section order, for the numbered eyebrows ("07 — Hardware"). The hero counts as 01 (it shows no number).
 * Sections that are switched off (data/features.js) drop out, so the numbers on the page stay consecutive.
 */
const ORDER = [
  'hero', 'what-is', 'hyperlocal', 'how-it-works', 'perspective', 'applications', 'hardware',
  FEATURES.designSystem && 'build',
  'software', 'scale', 'data-ownership', 'proof', 'case-studies',
].filter(Boolean)

/** The section's number as shown, e.g. homeNo('hardware') → "07". */
export const homeNo = (id) => String(ORDER.indexOf(id) + 1).padStart(2, '0')
