/**
 * Parts of the site that can be switched off without deleting them. Flip a flag and rebuild.
 */
export const FEATURES = {
  /**
   * The "Design your system" configurator page (/design-your-system) and everything that leads to it.
   * - Navigation: the navbar tab, the phone menu button, and the footer button and link.
   * - Home page: the hero button, the "Build your PheNode" section, and the configuration buttons in Perspective,
   *   Software, Scale and the final call to action.
   * - Other pages: the PheNode pages, the application pages (incl. their "Start: …" chips), the Applications page,
   *   and the configurator note on Contact.
   *
   * Off for now (Jake, Nov 15: "for the time being"). While off:
   * - the address sends visitors to Contact;
   * - a button left alone in its group takes the primary style;
   * - the home sections after Build are renumbered so the numbers stay consecutive (data/homeSections.js).
   *
   * Set to true to bring it all back.
   */
  designSystem: false,

  /**
   * The PheNode Summer 2025 Buyer's Guide. It covers its entry on Resources and the "Source: … Buyer's Guide"
   * credits under the spec tables (Wireless node and Base station pages) and in the node viewer. The Support page
   * now lists only the support documents, as on agrelaeco.com. Off for now (Jake, Nov 15). The PDF itself was moved out of the site, to media-src/docs/, so it isn't
   * published either: move it back to public/docs/ when turning this on.
   */
  buyersGuide: false,

  /**
   * Customer quotes (TestimonialSlot): home "Customer proof", the Software page and the application pages.
   * Off for now (Jake, Nov 15). Nadia's quotes (home "Customer proof", Company, and Support, where one replaced
   * the customer-quote placeholder) are not customer quotes and stay.
   */
  customerQuotes: false,

  /**
   * The individual case study pages (/case-studies/<slug>). Hidden for now (Jake, Nov 15): the Case Studies page, the
   * home "Case studies" section and the application pages link to each deployment's press releases instead, and the
   * pages' addresses go to /case-studies. Set to true to link the case study pages again.
   */
  caseStudyPages: false,

  /**
   * The home page's "Application experiences" section (#applications): its header and the four application chapters
   * (agriculture, ecology, urban, transportation). Hidden for now (Jake, Nov 16). While off, the home sections after it
   * are renumbered (Hardware becomes 06; data/homeSections.js), and "Choose your perspective" no longer says the page
   * below reorders: once a role is picked it points to the Applications page, which is still ordered for that role.
   * The Applications page and the four application pages are unaffected. Set to true to bring the section back.
   */
  homeApplications: false,

  /**
   * The home page's "Hardware" section (#hardware): the wireless node and base station explorers and the sensor cards.
   * Hidden for now (Jake, Nov 16). While off, the home sections after it are renumbered (Software becomes 06;
   * data/homeSections.js) and its 3D viewers aren't loaded on the home page. The PheNode pages are unaffected.
   * Set to true to bring the section back.
   */
  homeHardware: false,

  /**
   * In the home "Software" section: the three software screenshots, the Precipitation part (with its three screenshots),
   * "What the software does today" and "Configurable software". Hidden for now (Jake and his PM, Nov 16). While off,
   * the section keeps its title, the software recording and "Explore the software", right under the recording. The
   * Software page is unaffected. Set to true to bring them back.
   */
  homeSoftwareDetails: false,

  /**
   * The home page's "Case studies" section (the three deployments with their press releases). Hidden for now
   * (Jake, Nov 16); the Case Studies page is unaffected. Set to true to bring the section back (it takes the next number).
   */
  homeCaseStudies: false,
}
