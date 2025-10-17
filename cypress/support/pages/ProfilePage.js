class ProfilePage {
  url = "account/edit-account/";

  currentPassword = "#password_current";
  newPassword = "#password_1";
  confirmPassword = "#password_2";
  submit = 'input[type="submit"]';
  firstName = "#account_first_name";
  lastName = "#account_last_name";

  messageAlert = ".woocommerce-message";

  visit() {
    cy.visit(this.url);
    return this;
  }

  enterFirstAndLastName(first, last) {
    cy.get(this.firstName).should("be.visible").type(first);
    cy.get(this.lastName).should("be.visible").type(last);
    return this;
  }

  changePassword(currpass, newpass) {
    cy.get(this.currentPassword).should("be.visible").type(currpass);
    cy.get(this.newPassword).should("be.visible").type(newpass);
    cy.get(this.confirmPassword).should("be.visible").type(newpass);

    cy.get(this.submit).should("be.visible").click();

    cy.wait(2000);

    cy.get(this.messageAlert).should(
      "contain.text",
      "Account details changed successfully."
    );
    cy.task("updateCurrentPassword", newpass);

    return this;
  }
}

export default new ProfilePage();
