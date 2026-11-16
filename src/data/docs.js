/**
 * Support documentation: one list by version, as on https://www.agrelaeco.com/support (Jake, Nov 15, 2026:
 * "It's all in the quick start guide"). Titles are word for word from that page. The newest version is "Current",
 * the older ones "Archived".
 *
 * The PDFs are copies of the ones agrelaeco.com hosts (Jake, Nov 15), in /public/docs/ (current) and
 * /public/docs/archive/ (older). `source` is the agrelaeco.com file each was copied from. The Claude preview
 * build links to those instead (VITE_DOCS_SOURCE=agrelaeco), because the preview can't hold files over 15 MB.
 */
const LOCAL = `${import.meta.env.BASE_URL}docs/`
const SOURCE = 'https://www.agrelaeco.com/_files/ugd/'
const fromSource = import.meta.env.VITE_DOCS_SOURCE === 'agrelaeco'
const doc = (title, file, source, size) => ({ title, file, size, source: SOURCE + source, href: fromSource ? SOURCE + source : LOCAL + file })

export const SUPPORT_DOCS = [
  {
    version: 'v3', current: true,
    docs: [
      doc('PheNode Quick Start Guide v3 (Fall 2026)', 'phenode-quick-start-guide-v3-fall-2026.pdf', 'ae5d22_112ecc8584754a0796ae6ab084eb6e13.pdf', '15.8 MB'),
    ],
  },
  {
    version: 'v2',
    docs: [
      doc('PheNode Quick Start Guide v2.1 (Fall 2024)', 'archive/phenode-quick-start-guide-v2.1-fall-2024.pdf', 'ae5d22_5213aac3e5df4c64989e364390cc9f6b.pdf', '11.7 MB'),
      doc('PheNode Quick Start Guide v2.0 (April 2024)', 'archive/phenode-quick-start-guide-v2.0-april-2024.pdf', 'ae5d22_d8c7f0d7705a44af86691fb60c77777d.pdf', '11.7 MB'),
    ],
  },
  {
    version: 'v1',
    docs: [
      doc('PheNode User Manual v1.1 (January 2024)', 'archive/phenode-user-manual-v1.1-january-2024.pdf', 'ae5d22_1115ef19f6ee41168d06da7fb6f0ae9d.pdf', '24.7 MB'),
      doc('PheNode User Manual v1.0 (May 2023)', 'archive/phenode-user-manual-v1.0-may-2023.pdf', 'ae5d22_11b14f1078794ad3bdfbba69f0d57256.pdf', '8.7 MB'),
    ],
  },
]
