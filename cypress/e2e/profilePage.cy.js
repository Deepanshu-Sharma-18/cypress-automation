// <reference type="cypress" />

import ProfilePage from "../support/pages/ProfilePage";
import LoginPage from "../support/pages/LoginPage";
describe("Profile Page Tests", () => {
  it("should reset password", () => {
    const resetPassword = `Test@${Date.now()}`;
    LoginPage.visit();
    LoginPage.enterCredentials(
      Cypress.env("username"),
      Cypress.env("password")
    );
    LoginPage.submit();

    ProfilePage.visit();
    ProfilePage.enterFirstAndLastName("Deepanshu", "Sharma");
    ProfilePage.changePassword(Cypress.env("password"), resetPassword);
  });
});
