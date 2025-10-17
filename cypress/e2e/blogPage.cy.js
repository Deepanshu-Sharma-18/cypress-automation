import BlogCategoryPage from "../support/pages/BlogCategoryPage";
import BlogPage from "../support/pages/BlogPage";

// <reference type="cypress" />
describe("Blog Page Tests", () => {
  it("should validate X-Cache header as HIT for blog", () => {
    BlogPage.checkXCacheHeader("HIT");
  });

  it("should validate X-Cache header as HIT for blog category", () => {
    BlogCategoryPage.checkXCacheHeader("HIT");
  });

  it("should validate X-Cache header as HIT for blog category with query params", () => {
    BlogCategoryPage.checkXCacheHeaderWithQuery("HIT");
  });

  it("should validate the subscription functionality", () => {
    cy.window().trigger("focus");
    cy.document().trigger("visibilitychange");
    cy.wait(1000);

    BlogCategoryPage.visit();
    BlogCategoryPage.getSubscription()
      .verifySubscriptionVisible()
      .enterEmail("aqwe@aws.com")
      .submitEmail()
      .verifySuccess();
  });
});
