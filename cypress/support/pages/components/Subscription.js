class Subscription {
  constructor(page = "homepage") {
    this.selectors = {
      homepage: {
        emailInput: 'footer input.form-input-element[data-type="email"]',
        submit: 'footer form button[type="submit"]',
        success: "footer .landing-page-form-message",
      },
      blog: {
        emailInput:
          ".elementor-element-6b5f09a1 #primary-Email-c00d42c0fc4b5a6785684e12025ab04b input",
        submit:
          ".elementor-element-6b5f09a1 #form-button-c00d42c0fc4b5a6785684e12025ab04b",
        success: ".elementor-element-6b5f09a1 .landing-page-form-message",
      },
    };

    this.active = this.selectors[page] || this.selectors.default;
  }

  verifySubscriptionVisible() {
    cy.get(this.active.emailInput, { timeout: 30000 }).scrollIntoView();
    cy.get(this.active.emailInput).should("be.visible");

    cy.get(this.active.submit).should("be.visible");

    return this;
  }

  enterEmail(email) {
    cy.get(this.active.emailInput).type(email);
    return this;
  }

  submitEmail() {
    cy.get(this.active.submit)
      .contains("Send Me Deals")
      .should("be.visible")
      .click();
    return this;
  }

  verifySuccess() {
    cy.get(this.active.success)
      .should("contain.text", "Success! You've been added to the list.")
      .should("be.visible");
    return this;
  }
}

export default Subscription;
