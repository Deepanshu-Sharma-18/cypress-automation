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
});
