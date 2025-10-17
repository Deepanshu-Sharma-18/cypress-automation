class Review {
  reviewTab = "#tab-title-reviews";
  reviewForm = "#review_form";

  VerifyReviewTab() {
    cy.get(this.reviewTab).should("be.visible");
    return this;
  }

  ClickReviewTab() {
    cy.get(this.reviewTab).click();
    return this;
  }

  VerifyReviewFormVisible() {
    cy.get(this.reviewForm).should("be.visible");
    return this;
  }
}

export default Review;
