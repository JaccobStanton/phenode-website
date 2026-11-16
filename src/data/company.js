/**
 * Public company facts. Sources: Danforth Plant Science Center press (2026), agrelaeco.com,
 * PheNode Summer 2025 Buyer's Guide.
 */
export const COMPANY = {
  name: 'Agrela Ecosystems',
  short: 'Agrela',
  product: 'PheNode',
  founded: 2016,
  origin: 'Founded by plant scientists at the Donald Danforth Plant Science Center, St.\u00a0Louis', // no line break inside "St. Louis"
  commercialSince: 2023,
  website: 'https://www.agrelaeco.com',
  appUrl: 'https://phenode.live', // the PheNode software (customer sign-in)
  supportEmail: 'support@agrelaeco.com',
  leadership: [
    { name: 'Nadia Shakoor, PhD', title: 'Co-founder & CSO' },
    { name: 'Bill Kezele', title: 'President' },
  ],
  publicPartners: [
    { name: 'The Ray', detail: 'Vegetation, soil and air monitoring along interstate rights-of-way' },
    { name: 'Georgia Department of Transportation', detail: '18-mile pilot along Interstate 85 in West Georgia' },
    { name: 'Washington State Department of Transportation', detail: 'Expanded roadside deployment' },
    { name: 'Donald Danforth Plant Science Center', detail: 'Agricultural research' },
  ],
  founderQuote: {
    text: 'PheNode was designed to fill a gap that we felt every day as researchers.',
    name: 'Nadia Shakoor, PhD',
    title: 'Co-founder & CSO, Agrela Ecosystems',
    source: 'Danforth Plant Science Center, 2026',
  },
}
