import { FEATURES } from './features.js'

// The Design System tab and footer link only show while that page is switched on (data/features.js)
export const NAV = [
  {
    label: 'PheNode', to: '/phenode',
    children: [
      { label: 'Overview', to: '/phenode', text: 'The whole system in one view' },
      { label: 'Wireless Sensor Node', to: '/phenode/wireless-node', text: 'Solar, LoRaWAN, two agnostic sensor ports' },
      { label: 'Base Station', to: '/phenode/base-station', text: 'Control box, sensor frame, imager' },
      { label: 'Data Platform', to: '/phenode/data-platform', text: 'From measurement to dataset' },
      { label: 'Software', to: '/phenode/software', text: 'Dashboard, downloads, API' },
    ],
  },
  { label: 'How It Works', to: '/phenode/data-platform' },
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
  ...(FEATURES.designSystem ? [{ label: 'Design System', to: '/design-your-system' }] : []),
  {
    label: 'Resources', to: '/resources',
    children: [
      { label: 'Resources', to: '/resources', text: 'Guides, press, specifications' },
      { label: 'Support & Documentation', to: '/support', text: 'Current and archived docs' },
      { label: 'Company', to: '/company', text: 'Agrela Ecosystems' },
    ],
  },
]

export const FOOTER = [
  { heading: 'PheNode', links: [['Overview', '/phenode'], ['Wireless Sensor Node', '/phenode/wireless-node'], ['Base Station', '/phenode/base-station'], ['Data Platform', '/phenode/data-platform'], ['Software', '/phenode/software'], ['Specifications', '/phenode#specifications']] },
  { heading: 'Applications', links: [['Transportation & Infrastructure', '/applications/transportation'], ['Agricultural Research', '/applications/agriculture'], ['Ecological Research', '/applications/ecology'], ['Urban Environmental Intelligence', '/applications/urban'], ['Case Studies', '/case-studies']] },
  { heading: 'Agrela', links: [...(FEATURES.designSystem ? [['Design System', '/design-your-system']] : []), ['Resources', '/resources'], ['Support', '/support'], ['Company', '/company'], ['Contact', '/contact']] },
  { heading: 'Legal', links: [['Privacy Policy', '/legal/privacy'], ['Terms of Service', '/legal/terms']] },
]
