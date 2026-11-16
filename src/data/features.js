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
}
