import HomePage from "../support/pages/HomePage";
import LoginPage from "../support/pages/LoginPage";

// <reference type="cypress" />
describe("Home Page Tests", () => {
  it("should validate X-Cache header as HIT", () => {
    HomePage.checkXCacheHeader("HIT");
  });

  it("should validate no Meta Pixel duplicate warnings in console", () => {
    cy.checkNoMetaPixelDuplicate();
  });

  it("should validate the dropdown links under My Account start with the base URL", () => {
    cy.stubThirdPartyScripts();
    LoginPage.visit();
    LoginPage.enterCredentials(
      "deepanshu.sharma@hbwsl.com",
      "Q5!DR&K6Lq0yqNC2cqQJJJX^"
    );

    LoginPage.submit();

    HomePage.clickOnMyAccountMenu();
    HomePage.verifyDropdownLinksStartWith();
  });
});
