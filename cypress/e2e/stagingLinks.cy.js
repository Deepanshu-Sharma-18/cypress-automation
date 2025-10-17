describe("No staging URLs present on production site", () => {
  const disallowedDomains = [
    "staging.photowhoa.com",
    "staging2.photowhoa.com",
    "cwv.photowhoa.com",
  ];

  beforeEach(() => {
    cy.intercept({ method: "GET" }, (req) => {
      req.continue((res) => {
        // Only check text-based responses
        const contentType = res.headers["content-type"] || "";
        if (
          contentType.includes("text") ||
          contentType.includes("json") ||
          contentType.includes("javascript")
        ) {
          disallowedDomains.forEach((domain) => {
            if (res.body && res.body.toString().includes(domain)) {
              throw new Error(
                `🚨 Found disallowed staging domain in response: ${domain}\nURL: ${req.url}`
              );
            }
          });
        }
      });
    });
  });

  it("Visits key pages and checks for staging URLs", () => {
    const pagesToCheck = [
      "/",
      "/blog/",
      "/blog/category/photography-tips/",
      "/cart/",
      "/product-category/active-product/?orderby=date",
      "/plus/",
      "/login/",
    ];

    pagesToCheck.forEach((page) => {
      cy.visit(page);
      cy.wait(2000); // Allow assets to load
    });
  });
});
