class SearchBar {
  searchSelector = '.elementor-search-form__input[type="search"]';
  searchResultContainerSelector = ".blog-search-results .final-results";
  resultContainerSelector = ".products";

  getSearchInput() {
    return cy.get(this.searchSelector).filter(":visible");
  }

  enterSearchTerm(term) {
    this.getSearchInput().clear().type(term);
    return this;
  }

  submitSearch() {
    this.getSearchInput().type("{enter}");
    return this;
  }

  verifySearchResultContainer() {
    cy.get(this.searchResultContainerSelector, { timeout: 15000 }).should(
      "be.visible"
    );
    return this;
  }

  verifySearchResultRecommended(term) {
    cy.get(this.searchResultContainerSelector).should("contain.text", term);
    return this;
  }

  verifySearchResult(term) {
    cy.get(this.resultContainerSelector).its("length").should("be.gt", 0);
    cy.get(this.resultContainerSelector).first().should("contain.text", term);
    return this;
  }
}

export default SearchBar;
