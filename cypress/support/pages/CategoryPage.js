class CategoryPage {
  productCategoryUrl = "/product-category/photoshop-bundle/";

  visit() {
    cy.visit(this.productCategoryUrl);
    return this;
  }

  checkXCacheHeader(value) {
    //Load the page to ensure the header is set
    cy.request(this.productCategoryUrl);

    cy.intercept("GET", Cypress.config().baseUrl + this.productCategoryUrl).as(
      "categoryPage"
    );

    this.visit();
    cy.wait("@categoryPage").then((interception) => {
      const xCache = interception.response.headers["x-cache"];
      cy.log(`X-Cache: ${xCache}`);
      expect(xCache).to.equal(value);
    });
    return this;
  }
}

export default new CategoryPage();
