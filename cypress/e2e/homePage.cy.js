import SearchBar from "../support/pages/components/SearchBar";
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
      Cypress.env("username"),
      Cypress.env("password")
    );

    LoginPage.submit();

    HomePage.clickOnMyAccountMenu();
    HomePage.verifyDropdownLinksStartWith();
  });

  it("should validate the search functionality", () => {
    HomePage.visit();
    HomePage.enterSearchTerm("The Ultimate Wedding Photography Guide");
    cy.wait(3000);
    HomePage.verifySearchResultContainer();
    HomePage.verifySearchResultRecommended(
      "The Ultimate Wedding Photography Guide"
    );
    HomePage.submitSearch();
    HomePage.verifySearchResult("The Ultimate Wedding Photography Guide");
  });

  it("should validate opening of nav bar on mobile devices", () => {
    cy.viewport(414, 896);
    HomePage.visit();
    HomePage.ClickHamburgerMenu();
    HomePage.VerifyHamburgerMenuItems();
  });

  it('should validate opening & closing of "Store" submenu on mobile devices', () => {
    cy.viewport(414, 896);
    HomePage.visit();
    HomePage.ClickHamburgerMenu();

    HomePage.ToggleHamburgerMenuItemStore();

    HomePage.VerifyOpenCloseStoreMenuItem(true);
    HomePage.ToggleHamburgerMenuItemStore();
    HomePage.VerifyOpenCloseStoreMenuItem(false);
  });

  it("should verify that the video is playing in the hero section when naviating from deep", () => {
    cy.viewport(414, 896);
    HomePage.verifyVideoIsPlaying();
  });

  it("should verify that the cart Icon is in the center of header", () => {
    HomePage.visit();
    HomePage.VerifyCartIconCenterAligned();
  });

  it("should verify that the subscription is visible and working", () => {
    HomePage.visit();

    cy.window().trigger("focus");
    cy.document().trigger("visibilitychange");
    cy.wait(1000);

    HomePage.getSubscription()
      .verifySubscriptionVisible()
      .enterEmail("aqwe@aws.com")
      .submitEmail()
      .verifySuccess();
  });
});
