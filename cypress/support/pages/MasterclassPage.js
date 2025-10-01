class MasterclassPage {
  masterclassUrl = "/deals/photoshop-masking-tutorial/";
  visit() {
    cy.visit(this.masterclassUrl);
    return this;
  }
  checkXCacheHeader(value) {
    // Load the page to ensure the header is set
    cy.request(this.masterclassUrl);

    cy.intercept("GET", Cypress.config().baseUrl + this.masterclassUrl).as(
      "masterclassPage"
    );
    this.visit();
    cy.wait("@masterclassPage").then((interception) => {
      const xCache = interception.response.headers["x-cache"];
      cy.log(`X-Cache: ${xCache}`);
      expect(xCache).to.equal(value);
    });
    return this;
  }
}
export default new MasterclassPage();
