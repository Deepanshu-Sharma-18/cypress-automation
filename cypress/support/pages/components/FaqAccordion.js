class FaqAccordion {
  faqTitle = "h2.elementor-heading-title";
  accordionItem = ".rael-faq-container.rael-faq-layout-accordion";
  accordionHeader = ".rael-accordion-title";
  accordionContent = ".rael-accordion-content";

  verifyFaqSectionExists() {
    cy.contains(this.faqTitle, "Frequently Asked Questions").should(
      "be.visible"
    );
    return this;
  }

  scrollToFaqSection() {
    cy.contains(this.faqTitle, "Frequently Asked Questions").scrollIntoView();
    return this;
  }

  clickFirstAccordion() {
    cy.get(this.accordionItem)
      .first()
      .find(this.accordionHeader)
      .first()
      .click();
    return this;
  }

  verifyAccordionContentVisible(index = 0) {
    cy.get(this.accordionItem)
      .eq(index)
      .find(this.accordionContent)
      .should("be.visible")
      .and("not.be.empty");
    return this;
  }
}

export default FaqAccordion;
