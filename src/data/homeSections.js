/**
 * Home page section order, for the numbered eyebrows ("06 — Software"). The hero counts as 01 (it shows no number).
 * The Application experiences, Hardware, Build your PheNode and Case studies sections were hidden on Nov 15–16 and
 * deleted on Nov 17 (Jake), so the numbers run 02–09.
 */
const ORDER = ['hero', 'what-is', 'hyperlocal', 'how-it-works', 'perspective', 'software', 'scale', 'data-ownership', 'proof']

/** The section's number as shown, e.g. homeNo('software') → "06". */
export const homeNo = (id) => String(ORDER.indexOf(id) + 1).padStart(2, '0')
