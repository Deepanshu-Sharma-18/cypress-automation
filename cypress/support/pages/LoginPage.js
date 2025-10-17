class LoginPage {
  url = "/login/";
  usernameInput = '[name="log"]';
  passwordInput = '[name="pwd"]';
  submitButton = '[name="wp-submit"] > .elementor-button-text';
  visit() {
    cy.visit(this.url);

    return this;
  }

  enterCredentials(email, password) {
    cy.get(this.usernameInput).type(email);
    cy.get(this.passwordInput).type(password);

    return this;
  }

  submit() {
    cy.get(this.submitButton).click();

    cy.wait(5000);

    cy.url().then((url) => {
      if (url.includes("/wp-login")) {
        cy.pause();

        cy.wait(5000);
      } else {
        cy.log("Not on /wp-login — skipping");
      }
    });

    return this;
  }
}

export default new LoginPage();
