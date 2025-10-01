class BlogCategoryPage {
  url = "/blog/category/photography-tips/";
  visit() {
    cy.visit(this.url);
    return this;
  }

  checkXCacheHeader(value) {
    // Load the page to ensure the header is set
    cy.request(this.url);

    cy.intercept("GET", Cypress.config().baseUrl + this.url).as(
      "blogCategoryPage"
    );
    this.visit();

    cy.wait("@blogCategoryPage").then((interception) => {
      const xCache = interception.response.headers["x-cache"];
      cy.log(`X-Cache: ${xCache}`);
      expect(xCache).to.equal(value);
    });
    return this;
  }
}

export default new BlogCategoryPage();
