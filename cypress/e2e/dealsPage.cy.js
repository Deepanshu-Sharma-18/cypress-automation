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
});
