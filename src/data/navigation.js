/**
 * The parts of the PheNode page (/phenode), in page order. They were separate pages until Jake made them one scroll
 * page (Nov 16): the header menu, the footer and the page itself all follow this list, each part at /phenode#<id>, and
 * the old addresses (/phenode/<id>) lead to the same place (App.jsx). Order: Jake, Nov 16 (base station first).
 */
export const PHENODE_PARTS = [
  { id: 'base-station', label: 'Base Station', text: 'Control box, sensor frame, imager' },
  { id: 'wireless-node', label: 'Wireless Sensor Node', text: 'Solar, LoRaWAN, two agnostic sensor ports' },
  { id: 'data-platform', label: 'Data Platform', text: 'From measurement to dataset' },
  { id: 'software', label: 'Software', text: 'Dashboard, downloads, API' },
]

export const NAV = [
  {
    label: 'PheNode', to: '/phenode',
    children: [
      { label: 'Overview', to: '/phenode', text: 'The whole system in one view' },
      ...PHENODE_PARTS.map((p) => ({ label: p.label, to: `/phenode#${p.id}`, text: p.text })),
    ],
  },
  { label: 'How It Works', to: '/phenode#data-platform' },
  {
    label: 'Applications', to: '/applications',
    children: [
      { label: 'Transportation & Infrastructure', to: '/applications/transportation', text: 'Roadside intelligence, fire weather' },
      { label: 'Agricultural Research', to: '/applications/agriculture', text: 'Plot-level, chamber to field' },
      { label: 'Ecological Research', to: '/applications/ecology', text: 'Phenology, restoration, microclimate' },
      { label: 'Urban Environmental Intelligence', to: '/applications/urban', text: 'Extreme heat, block by block' },
    ],
  },
  { label: 'Case Studies', to: '/case-studies' },
  {
    label: 'Resources', to: '/resources',
    children: [
      { label: 'Resources', to: '/resources', text: 'Guides, press, learning' },
      { label: 'Support & Documentation', to: '/support', text: 'Current and archived docs' },
      { label: 'Company', to: '/company', text: 'Agrela Ecosystems' },
    ],
  },
]

export const FOOTER = [
  { heading: 'PheNode', links: [['Overview', '/phenode'], ...PHENODE_PARTS.map((p) => [p.label, `/phenode#${p.id}`])] },
  { heading: 'Applications', links: [['Transportation & Infrastructure', '/applications/transportation'], ['Agricultural Research', '/applications/agriculture'], ['Ecological Research', '/applications/ecology'], ['Urban Environmental Intelligence', '/applications/urban'], ['Case Studies', '/case-studies']] },
  { heading: 'Agrela', links: [['Resources', '/resources'], ['Support', '/support'], ['Company', '/company'], ['Contact', '/contact']] },
  { heading: 'Legal', links: [['Privacy Policy', '/legal/privacy'], ['Terms of Service', '/legal/terms']] },
]
