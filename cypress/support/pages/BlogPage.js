class BlogPage {
  url = "/blog/";
  visit() {
    cy.visit(this.url);
    return this;
  }

  checkXCacheHeader(value) {
    // Load the page to ensure the header is set
    cy.request(this.url);

    cy.intercept("GET", Cypress.config().baseUrl + this.url).as("blogPage");
    this.visit();

    cy.wait("@blogPage").then((interception) => {
      const xCache = interception.response.headers["x-cache"];
      cy.log(`X-Cache: ${xCache}`);
      expect(xCache).to.equal(value);
    });
    return this;
  }
}

export default new BlogPage();
