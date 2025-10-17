import DealPage from "../support/pages/DealPage";
import MasterclassPage from "../support/pages/MasterclassPage";

// <reference type="cypress" />
describe("Deal Page Tests", () => {
  it("should validate X-Cache header as HIT for regular deals", () => {
    const dealPage = new DealPage("portrait-photography-poses/");
    dealPage.checkXCacheHeader("HIT");
  });

  it("should validate X-Cache header as HIT for masterclasses", () => {
    MasterclassPage.checkXCacheHeader("HIT");
  });

  it("should validate FAQ exists on the deal page", () => {
    const dealPage = new DealPage("vector-image-converter/");
    const faqAccordion = dealPage.getFaqAccordion();
    dealPage.visit();
    faqAccordion.verifyFaqSectionExists();
    faqAccordion.scrollToFaqSection();
  });

  it("should expand the first FAQ accordion and verify content is visible", () => {
    const dealPage = new DealPage("vector-image-converter/");
    const faqAccordion = dealPage.getFaqAccordion();
    dealPage.visit();
    faqAccordion.scrollToFaqSection();
    faqAccordion.clickFirstAccordion();
    faqAccordion.verifyAccordionContentVisible(0);
  });

  it("should validate if leave review is visible on the deal page", () => {
    const dealPage = new DealPage("vector-image-converter/");
    dealPage.visit();
    dealPage.getReview().ClickReviewTab().VerifyReviewFormVisible();
  });

  it("should validate the consistency of prices in related products", () => {
    const dealPage = new DealPage("vector-image-converter/");
    dealPage.visit();
    dealPage.VerifyPriceConsistency();
  });

  it("should verify that continue without membership has consitent buttons in the modal", () => {
    const dealPage = new DealPage("vector-image-converter/");
    dealPage.visit();
    dealPage.VerifyButtonsBuyWithoutMembership();
  });
});
