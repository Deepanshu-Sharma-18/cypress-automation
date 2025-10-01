import CategoryPage from "../support/pages/CategoryPage";

// <reference type="cypress" />
describe("Category Page Tests", () => {
  it("should validate X-Cache header as HIT", () => {
    CategoryPage.checkXCacheHeader("HIT");
  });
});
