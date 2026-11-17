/**
 * Case studies. Only publicly reported facts are stated for named partners.
 * `placeholder: true` marks entries awaiting customer permission — the UI labels them clearly.
 * `press` lists the public press releases for each deployment; they are the cards' only links (the case study pages
 * were hidden on Nov 15 and deleted on Nov 17, with the fields only they used: challenge, deployment, result, timeline).
 * Sources: the press releases below; Danforth Plant Science Center press release (2026).
 * The ecology placeholder was removed (Jake, Nov 15: no other use-case press to share yet).
 * `photo` is the card photo on the Case Studies page (Jake's photos, Nov 15): public/assets/<name>-<w>.webp, 16:10.
 */
export const CASE_STUDIES = [
  {
    slug: 'the-ray-i85',
    project: 'Roadside vegetation and soil monitoring on an interstate right-of-way',
    location: 'Interstate 85, West Georgia',
    partner: 'The Ray · Georgia Department of Transportation',
    application: 'transportation',
    year: '2023–',
    summary: 'An 18-mile pilot along Interstate 85 where PheNode monitors vegetation, soil and air conditions along the highway right-of-way — a first for interstate roadside monitoring.',
    // Jake's wording (Nov 15)
    data: ['Environmental and soil data captured for restoration and remediation projects'],
    photo: { name: 'case-studies/the-ray-i85/card', widths: [800, 1200, 1600], alt: 'A PheNode in a roadside wildflower meadow on The Ray Highway, a pink wildflower in front' },
    press: [
      { publisher: 'The Ray', date: 'November 2023', title: 'Leading Transportation Partnership Deploys Agrela’s Vegetation Monitoring Technology on The Ray Highway – First for Interstate Roadside', href: 'https://www.theray.org/our-news/leading-transportation-partnership-deploys-agrelas-vegetation-monitoring-technology-on-the-ray-highway-first-for-interstate-roadside' },
      // Jake's share.google link opens this AP News page (3BL Media release, Nov 16, 2023)
      { publisher: 'AP News', date: 'November 2023', title: 'Leading Transportation Partnership Deploys Agrela’s Vegetation Monitoring Technology on the Ray Highway – First for Interstate Roadside', href: 'https://apnews.com/press-release/3bl-media/georgia-plants-transportation-d58ca32fd396a4fd767d0dce333d7581' },
    ],
    placeholder: false,
  },
  {
    slug: 'danforth-center-research',
    project: 'Environmental monitoring for agricultural research',
    location: 'St. Louis, Missouri',
    partner: 'Donald Danforth Plant Science Center',
    application: 'agriculture',
    year: '2016–',
    summary: 'PheNode was born at the Danforth Center, where researchers needed flexible, field-deployable environmental data. The Center continues to use the platform for agricultural research.',
    data: ['Soil moisture, temperature and EC', 'Air temperature, humidity and pressure', 'Solar radiation and light', 'Rainfall', 'Imaging'],
    photo: { name: 'case-studies/danforth-center-research/card', widths: [800, 1200], alt: 'A PheNode in tall grass in front of research greenhouses' },
    press: [
      { publisher: 'Danforth Plant Science Center', date: 'August 2023', title: 'Agrela Ecosystems Ignites Innovation in Data-Driven Agriculture', href: 'https://www.danforthcenter.org/news/agrela-ecosystems-ignites-innovation-in-data-driven-agriculture/' },
    ],
    placeholder: false,
  },
  {
    slug: 'wsdot-expansion',
    project: 'Expanded roadside deployment',
    location: 'Scatter Creek Rest Area, Interstate 5, Washington',
    partner: 'The Ray · Washington State Department of Transportation',
    application: 'transportation',
    year: '2025–',
    summary: 'Following the Georgia pilot, PheNode has been deployed with the Washington State Department of Transportation as the platform expands nationally into transportation infrastructure.',
    // as reported by The Ray (Jan 2026): automated stations capturing real-time microclimate data
    data: ['Microclimate data for vegetation establishment and habitat viability'],
    photo: { name: 'case-studies/wsdot-expansion/card', widths: [800, 1200, 1600], alt: 'A PheNode on a pole in tall grass beneath a large conifer' },
    press: [
      { publisher: 'The Ray', date: 'January 2026', title: 'The Ray Deploys Natural Capital at WSDOT’s Scatter Creek Site', href: 'https://www.theray.org/our-news/the-ray-deploys-advanced-natural-capital-work-at-wsdots-scatter-creek-site' },
    ],
    // public now (The Ray's release); the case study page's own text is still a placeholder
    placeholder: false,
  },
]

