class HomePage {
  url = "/";

  dropdown = ".jet-mega-menu-mega-container";
  dropdownLinks = "#jet-mega-menu-item-846270 .elementor-icon-list-item a";
  visit() {
    cy.visit(this.url);
  }

  checkPageLoaded() {
    cy.url().should("include", Cypress.config().baseUrl);
    return this;
  }

  clickOnMyAccountMenu() {
    cy.wait(2000);

    cy.get("body").then(($body) => {
      const myAccountElements = $body.find(':contains("My Account")');
    });

    cy.get(".jet-mega-menu-item__label")
      .filter(":visible")
      .contains("My Account")
      .should("be.visible")
      .parent()
      .parent()
      .trigger("mouseover", { force: true });

    cy.wait(1000);
    return this;
  }

  verifyDropdownLinksStartWith() {
    cy.get(this.dropdown).should("exist").invoke("show").should("be.visible");

    cy.get(this.dropdownLinks)
      .should("have.length.greaterThan", 0)
      .each(($link) => {
        cy.wrap($link)
          .invoke("attr", "href")
          .then((href) => {
            const allowedDomains = [
              "https://www.photowhoa.com",
              "https://photowhoa.freshdesk.com",
            ];

            const isValid = allowedDomains.some((domain) =>
              href.startsWith(domain)
            );
            expect(isValid, `Link "${href}" should start with allowed domain`)
              .to.be.true;
          });
      });
    return this;
  }

  checkXCacheHeader(value) {
    // Load the page to ensure the header is set
    cy.request(this.url);

    cy.intercept("GET", Cypress.config().baseUrl).as("homePage");
    this.visit();

    cy.wait("@homePage").then((interception) => {
      const xCache = interception.response.headers["x-cache"];
      cy.log(`X-Cache: ${xCache}`);
      expect(xCache).to.equal(value);
    });

    return this;
  }
}

export default new HomePage();
