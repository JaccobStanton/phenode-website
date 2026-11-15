/**
 * Support documentation index. Organized by product and version; archived versions stay downloadable.
 * File paths are placeholders until the real documents are dropped into /public/docs/.
 */
export const DOC_PRODUCTS = [
  {
    id: 'phenode',
    name: 'PheNode base station',
    versions: [
      {
        version: '2025.1', date: '2025-06', current: true,
        docs: [
          { title: 'PheNode Summer 2025 Buyer\'s Guide', type: 'Guide', file: '/docs/phenode-buyers-guide-summer-2025.pdf', size: '5.4 MB' },
          { title: 'Quick-start guide', type: 'Quick start', file: '/docs/phenode-quick-start-2025.1.pdf', size: '—', placeholder: true },
          { title: 'Installation guide — frame, pole and tower mounting', type: 'Installation', file: '/docs/phenode-installation-2025.1.pdf', size: '—', placeholder: true },
          { title: 'Product manual', type: 'Manual', file: '/docs/phenode-manual-2025.1.pdf', size: '—', placeholder: true },
          { title: 'Sensor specifications', type: 'Technical reference', file: '/docs/phenode-sensor-specs-2025.1.pdf', size: '—', placeholder: true },
        ],
      },
      {
        version: '2024.2', date: '2024-09', current: false,
        docs: [
          { title: 'Product manual (archived)', type: 'Manual', file: '/docs/archive/phenode-manual-2024.2.pdf', size: '—', placeholder: true },
          { title: 'Installation guide (archived)', type: 'Installation', file: '/docs/archive/phenode-installation-2024.2.pdf', size: '—', placeholder: true },
        ],
      },
    ],
  },
  {
    id: 'wireless-node',
    name: 'Agrela wireless sensor',
    versions: [
      {
        version: 'v2 firmware', date: '2025-07', current: true,
        docs: [
          { title: 'Wireless sensor quick-start', type: 'Quick start', file: '/docs/wireless-sensor-quick-start-v2.pdf', size: '—', placeholder: true },
          { title: 'Soil probe connection guide', type: 'Installation', file: '/docs/wireless-sensor-soil-probes.pdf', size: '—', placeholder: true },
          { title: 'Firmware release notes', type: 'Firmware', file: '/docs/wireless-sensor-firmware-notes.pdf', size: '—', placeholder: true },
        ],
      },
      {
        version: 'v1 firmware', date: '2024-03', current: false,
        docs: [
          { title: 'Wireless sensor manual (archived)', type: 'Manual', file: '/docs/archive/wireless-sensor-manual-v1.pdf', size: '—', placeholder: true },
        ],
      },
    ],
  },
  {
    id: 'software',
    name: 'PheNode software',
    versions: [
      {
        version: 'Current release', date: '2026', current: true,
        docs: [
          { title: 'Dashboard user guide', type: 'Software guide', file: '/docs/software-user-guide.pdf', size: '—', placeholder: true },
          { title: 'Data downloads and cleaning preferences', type: 'Software guide', file: '/docs/software-downloads-guide.pdf', size: '—', placeholder: true },
          { title: 'API reference', type: 'Technical reference', file: '/docs/software-api-reference.pdf', size: '—', placeholder: true },
          { title: 'Dockerized backend — deployment notes', type: 'Technical reference', file: '/docs/software-backend-notes.pdf', size: '—', placeholder: true },
        ],
      },
    ],
  },
]
