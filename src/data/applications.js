/**
 * Application chapters, roles and "what do you need to understand" needs.
 * Chapter order is re-ranked by the visitor's selected role (see PersonalizationContext).
 * Titles, summaries, measurements and the agriculture CTA follow Jake's PM's notes (Nov 16, 2026), lightly copyedited
 * (Jake): plot-level / site-level hyphenated, "year over year" for YOY, sentence case. The hidden configurator's
 * role CTAs below (e.g. 'Instrument a trial') were not part of those notes.
 */
export const APPLICATIONS = [
  {
    id: 'transportation',
    kicker: 'Transportation & smart infrastructure',
    title: 'Measure whether restoration is actually working.',
    headline: 'Roadside intelligence',
    summary: 'Meadow restoration, re-naturalization, and slope remediation projects monitored along transportation corridors.',
    environment: 'corridor',
    measurements: ['Soil moisture retention change over time', 'Microclimate conditions', 'Rainfall and wind', 'Visual record of plant performance year over year', 'Rainfall vs. moisture infiltration depth'],
    benefits: ['Environmental conditions', 'Natural habitat', 'Infrastructure resilience', 'Safety'],
    sub: {
      id: 'fire-weather',
      kicker: 'Within transportation & infrastructure',
      title: 'Monitor conditions associated with increasing fire risk.',
      summary: 'High-frequency, local measurements of temperature, humidity, wind, rainfall and soil moisture contribute to fire-weather awareness and earlier detection of changing conditions along a corridor.',
      measurements: ['Air temperature', 'Relative humidity', 'Wind speed and gust', 'Rainfall', 'Soil moisture', 'Vegetation conditions (imaging)'],
    },
    cta: 'Plan a corridor deployment',
    route: '/applications/transportation',
  },
  {
    id: 'agriculture',
    kicker: 'Agricultural & crop research',
    title: 'From one plot to an entire research program.',
    headline: 'Plot-level monitoring',
    summary: 'Each plot can carry its own node. Environmental variability becomes part of the dataset instead of noise around it — replicated, normalized to your preferences, and comparable across trials.',
    environment: 'field',
    measurements: ['Plot-level measurements', 'Canopy microclimate', 'Solar radiation and ET', 'Rainfall', 'Growing degree days', 'Imaging', 'Granular and site-level derived measurements'],
    pipeline: {
      title: 'One data system from controlled environment to field.',
      stages: ['Growth chamber', 'Greenhouse', 'Field experiment'],
      text: 'The hardware is physically reconfigurable for indoor and outdoor operation, so the same monitoring approach — and your own standardization of the data — follows a program from chamber to greenhouse to field trial.',
    },
    cta: 'Monitor your field trials at plot level',
    route: '/applications/agriculture',
  },
  {
    id: 'ecology',
    kicker: 'Ecological research & restoration',
    title: 'Measure complex, ever-changing environments.',
    headline: 'Watch ecosystems change',
    summary: 'Phenology, microclimate and environmental change in grasslands, prairies, forests, wetlands and restoration sites — measured continuously.',
    environment: 'ecosystem',
    measurements: ['Microclimate (air T / RH / pressure)', 'Light and daylength', 'Soil moisture and temperature', 'Soil moisture retention change over time', 'Rainfall', 'Imaging for phenology', 'Restoration outcomes over seasons'],
    cta: 'Monitor a site',
    route: '/applications/ecology',
  },
  {
    id: 'urban',
    kicker: 'Urban environmental intelligence',
    title: 'A city doesn\'t have one temperature.',
    headline: 'Extreme heat, block by block',
    summary: 'Built surfaces, shade, vegetation and land cover create substantial differences in local conditions. Distributed monitoring shows where and when heat develops across neighborhoods, parks, corridors and campuses.',
    environment: 'city',
    measurements: ['Air temperature', 'Relative humidity', 'Solar radiation', 'Wind', 'Rainfall', 'Surface-adjacent soil moisture in green infrastructure', 'Granular derived heat stress and heat index measurements', 'Wind chill and frost point for winter months'],
    supports: ['Heat monitoring', 'Research', 'Planning', 'Infrastructure decisions', 'Mitigation strategies', 'Public-safety programs', 'Model development'],
    caveat: 'Better hyperlocal environmental information can support decisions intended to reduce heat-related risk. PheNode measures conditions; it does not predict outcomes.',
    cta: 'Plan an urban network',
    route: '/applications/urban',
  },
]

export const APPLICATION_BY_ID = Object.fromEntries(APPLICATIONS.map((a) => [a.id, a]))

/**
 * Roles for "Choose your perspective" (home 05). `lead` + `noun` complete "I'm …" in the sentence (hyphens in the
 * sentence words are non-breaking, so a word never splits across lines); `plural` reads
 * "Ordered for …"; `needs` are the questions suggested for the role, the first is the one shown when it is picked;
 * `group` sorts the role list. `order` re-ranks the Applications page.
 */
export const ROLE_GROUPS = [
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'ecology', label: 'Ecology & environment' },
  { id: 'infrastructure', label: 'Infrastructure & cities' },
  { id: 'data', label: 'Data, engineering & programs' },
  { id: 'other', label: 'Not listed' },
]

export const ROLES = [
  { id: 'environmental-scientist', name: 'Environmental scientist', group: 'ecology', lead: 'an', noun: 'environmental scientist', plural: 'environmental scientists', needs: ['environmental-intelligence', 'ecological', 'weather-networks', 'urban-heat'], order: ['ecology', 'agriculture', 'urban', 'transportation'] },
  { id: 'infrastructure', name: 'Transportation / infrastructure manager', group: 'infrastructure', lead: 'a', noun: 'transportation or infrastructure manager', plural: 'transportation and infrastructure managers', needs: ['roadside', 'fire-weather', 'restoration', 'weather-networks'], order: ['transportation', 'urban', 'ecology', 'agriculture'] },
  { id: 'agronomist', name: 'Agronomist', group: 'agriculture', lead: 'an', noun: 'agronomist', plural: 'agronomists', needs: ['soil', 'ag-microclimate', 'crop-research'], order: ['agriculture', 'ecology', 'urban', 'transportation'] },
  { id: 'breeder', name: 'Crop researcher / breeder', group: 'agriculture', lead: 'a', noun: 'crop researcher or breeder', plural: 'crop researchers and breeders', needs: ['crop-research', 'ag-microclimate', 'soil'], order: ['agriculture', 'ecology', 'transportation', 'urban'] },
  { id: 'ecologist', name: 'Ecologist', group: 'ecology', lead: 'an', noun: 'ecologist', plural: 'ecologists', needs: ['ecological', 'restoration', 'environmental-intelligence'], order: ['ecology', 'transportation', 'agriculture', 'urban'] },
  { id: 'restoration', name: 'Restoration specialist', group: 'ecology', lead: 'a', noun: 'restoration specialist', plural: 'restoration specialists', needs: ['restoration', 'soil', 'roadside', 'ecological'], order: ['ecology', 'transportation', 'agriculture', 'urban'] },
  { id: 'planner', name: 'Municipal / smart-city planner', group: 'infrastructure', lead: 'a', noun: 'municipal or smart‑city planner', plural: 'municipal and smart-city planners', needs: ['urban-heat', 'weather-networks', 'environmental-intelligence'], order: ['urban', 'transportation', 'ecology', 'agriculture'] },
  { id: 'fire', name: 'Fire / emergency management', group: 'infrastructure', lead: 'in', noun: 'fire or emergency management', plural: 'fire and emergency management', needs: ['fire-weather', 'weather-networks', 'roadside'], order: ['transportation', 'ecology', 'urban', 'agriculture'] },
  { id: 'data-scientist', name: 'Data scientist', group: 'data', lead: 'a', noun: 'data scientist', plural: 'data scientists', needs: ['environmental-intelligence', 'weather-networks', 'custom'], order: ['agriculture', 'urban', 'ecology', 'transportation'] },
  { id: 'program-manager', name: 'Research program manager', group: 'data', lead: 'a', noun: 'research program manager', plural: 'research program managers', needs: ['crop-research', 'environmental-intelligence', 'ecological'], order: ['agriculture', 'ecology', 'transportation', 'urban'] },
  { id: 'engineer', name: 'Engineer', group: 'data', lead: 'an', noun: 'engineer', plural: 'engineers', needs: ['custom', 'weather-networks', 'environmental-intelligence'], order: ['transportation', 'urban', 'agriculture', 'ecology'] },
  { id: 'other', name: 'Another field', group: 'other', lead: 'in', noun: 'another field', plural: null, needs: [], order: ['agriculture', 'transportation', 'ecology', 'urban'] },
]

/** Questions for home 05. `phrase` completes "I need to understand …"; `name` titles the suggested starting point. */
export const NEEDS = [
  { id: 'environmental-intelligence', name: 'Environmental intelligence', phrase: 'how conditions vary across a site', app: 'ecology', scene: 'ecosystem', sensors: ['ws-air', 'ws-lux', 'soil-standard'], insight: 'Conditions across a site, resolved in space and time instead of averaged away.' },
  { id: 'soil', name: 'Soil monitoring', phrase: 'soil moisture and salinity', app: 'agriculture', scene: 'field', sensors: ['soil-standard', 'soil-standard'], insight: 'Moisture, temperature and salinity per plot, at two depths per node.' },
  { id: 'fire-weather', name: 'Fire weather conditions', phrase: 'fire‑weather conditions', app: 'transportation', scene: 'corridor', sensors: ['ws-air', 'bs-wind', 'bs-rain'], insight: 'Where along a corridor humidity drops and wind rises first.' },
  { id: 'urban-heat', name: 'Urban heat', phrase: 'urban heat', app: 'urban', scene: 'city', sensors: ['ws-air', 'ws-lux', 'bs-solar'], insight: 'Which blocks run hottest, and when.' },
  { id: 'ag-microclimate', name: 'Agricultural microclimate', phrase: 'crop microclimate', app: 'agriculture', scene: 'field', sensors: ['ws-air', 'ws-lux', 'bs-solar'], insight: 'The canopy conditions each trial actually experienced.' },
  { id: 'roadside', name: 'Roadside intelligence', phrase: 'roadside restoration', app: 'transportation', scene: 'corridor', sensors: ['ws-air', 'soil-standard', 'bs-imager'], insight: 'Whether meadow and slope treatments are establishing — section by section.' },
  { id: 'restoration', name: 'Restoration monitoring', phrase: 'restoration outcomes', app: 'ecology', scene: 'ecosystem', sensors: ['soil-standard', 'ws-air', 'bs-imager'], insight: 'Restoration measured as it happens, season over season.' },
  { id: 'crop-research', name: 'Crop research', phrase: 'conditions in every trial plot', app: 'agriculture', scene: 'field', sensors: ['soil-standard', 'ws-air', 'bs-solar', 'bs-imager'], insight: 'Consistent environmental context for every replicate.' },
  { id: 'ecological', name: 'Ecological monitoring', phrase: 'ecosystem change', app: 'ecology', scene: 'ecosystem', sensors: ['ws-air', 'ws-lux', 'soil-standard'], insight: 'Phenology and microclimate, continuously.' },
  { id: 'weather-networks', name: 'Weather networks', phrase: 'local weather', app: 'urban', scene: 'corridor', sensors: ['bs-wind', 'bs-rain', 'ws-air'], insight: 'A distributed network instead of a single station.' },
  { id: 'custom', name: 'Custom environmental monitoring', phrase: 'readings from my own sensors', app: 'agriculture', scene: 'field', sensors: ['custom-sdi12', 'ws-air'], insight: 'Your sensor on an open interface, inside one data system.' },
]
