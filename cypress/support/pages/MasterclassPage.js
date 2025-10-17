class MasterclassPage {
  masterclassUrl = "/deals/photoshop-masking-tutorial/";

  visit() {
    cy.visit(this.masterclassUrl);
    return this;
  }

  checkXCacheHeader(options = {}) {
    const {
      maxWarmupAttempts = 10,
      warmupDelay = 1000,
      validationDelay = 500,
    } = options;

    const fullUrl = Cypress.config().baseUrl + this.masterclassUrl;

    Cypress.log({ name: "Cache Check", message: "🔥 Phase 1: Cache Warm-up" });

    const warmupCache = (attempt = 1) => {
      if (attempt > 1) {
        cy.wait(warmupDelay);
      }

      cy.request(fullUrl).then((res) => {
        const xCache = res.headers["x-cache"] || "N/A";

        Cypress.log({
          name: "Warm-up",
          message: `${attempt}/${maxWarmupAttempts} - X-Cache: ${xCache}`,
        });

        if (xCache.includes("HIT")) {
          Cypress.log({
            name: "Success",
            message: `✓ Cache HIT achieved on attempt ${attempt}`,
          });
          // Don't return anything, don't recurse
        } else if (attempt < maxWarmupAttempts) {
          Cypress.log({
            name: "Retry",
            message: "Cache MISS - retrying...",
          });
          // Recurse immediately
          warmupCache(attempt + 1);
        } else {
          throw new Error(
            `Failed to warm cache after ${maxWarmupAttempts} attempts. Last X-Cache: ${xCache}`
          );
        }
      });
    };

    warmupCache();

    // Validation phase
    Cypress.log({ name: "Cache Check", message: "✅ Phase 2: Validation" });
    cy.wait(validationDelay);

    cy.request(fullUrl).then((res) => {
      const xCache = res.headers["x-cache"] || "N/A";
      Cypress.log({
        name: "Validation",
        message: `X-Cache: ${xCache}`,
      });
      expect(xCache, "Cache should be HIT after warm-up").to.include("HIT");
    });

    return this;
  }
}

export default new MasterclassPage();
