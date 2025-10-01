import FaqAccordion from "./components/FaqAccordion";

class DealPage {
  constructor(slug) {
    this.url = `/deals/${slug}`;
    this.faqAccordion = new FaqAccordion();
  }

  visit() {
    cy.visit(this.url);
    return this;
  }

  checkXCacheHeader(value) {
    // Load the page to ensure the header is set
    cy.request(this.url);

    cy.intercept("GET", Cypress.config().baseUrl + this.url).as("dealPage");

    this.visit();
    cy.wait("@dealPage").then((interception) => {
      const xCache = interception.response.headers["x-cache"];
      cy.log(`X-Cache: ${xCache}`);
      expect(xCache).to.equal(value);
    });

    return this;
  }

  getFaqAccordion() {
    return this.faqAccordion;
  }

  // verifyFaqExists() {
  //   FaqAccordion.verifyFaqSectionExists();
  //   return this;
  // }

  // scrollToFaq() {
  //   FaqAccordion.scrollToFaqSection();
  //   return this;
  // }

  // clickFirstFaqAccordion() {
  //   FaqAccordion.clickFirstAccordion();
  //   return this;
  // }

  // verifyFirstFaqContentVisible() {
  //   FaqAccordion.verifyAccordionContentVisible(0);
  //   return this;
  // }
}

export default DealPage;
