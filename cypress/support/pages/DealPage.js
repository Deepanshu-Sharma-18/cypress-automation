import FaqAccordion from "./components/FaqAccordion";
import Review from "./components/Review";

class DealPage {
  constructor(slug) {
    this.url = `/deals/${slug}`;
    this.faqAccordion = new FaqAccordion();
    this.review = new Review();
  }

  confirmWithoutMembership = ".confirm-membership";
  dontSaveMoney = "#dont-save";
  saveMoney = "#save-with-membership";

  relatedProducts = ".related.products .products";
  price = ".price";

  toolTipButtons = ".tool-tip-buttons";
  modal = ".rael-content";

  visit() {
    cy.visit(this.url);
    return this;
  }

  checkXCacheHeader(options = {}) {
    const {
      maxWarmupAttempts = 10,
      warmupDelay = 1000,
      validationDelay = 500,
    } = options;

    const fullUrl = Cypress.config().baseUrl + this.url;

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

  getFaqAccordion() {
    return this.faqAccordion;
  }

  getReview() {
    return this.review;
  }

  addToCart() {
    cy.get(this.confirmWithoutMembership).should("be.visible").click();
    cy.get(this.dontSaveMoney).should("be.visible").click();
    return this;
  }

  VerifyPriceConsistency() {
    cy.get(".related.products").should("be.visible");

    cy.get(".related.products ul.products li.product")
      .first()
      .then(($card) => {
        const cardRect = $card[0].getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardCenter = cardRect.left + cardWidth / 2;

        cy.wrap($card).within(() => {
          // Get the p.price container (which holds del and ins)
          cy.get("span.price p.price")
            .should("be.visible")
            .then(($priceContainer) => {
              const containerRect = $priceContainer[0].getBoundingClientRect();
              const containerCenter =
                containerRect.left + containerRect.width / 2;
              const horizontalOffset = Math.abs(containerCenter - cardCenter);

              // Check if p.price container is centered horizontally
              expect(horizontalOffset).to.be.lessThan(
                30,
                `Price container should be centered within 30px, but offset is ${horizontalOffset.toFixed(
                  2
                )}px`
              );

              // Log success for clarity
              cy.log(
                `✓ Price container is properly centered (offset: ${horizontalOffset.toFixed(
                  2
                )}px)`
              );

              // Now check the actual discounted price size
              cy.wrap($priceContainer)
                .find("ins")
                .then(($price) => {
                  const fontSize = parseFloat($price.css("font-size"));
                  const priceRect = $price[0].getBoundingClientRect();
                  const priceWidth = priceRect.width;

                  // Check font size is not too small
                  expect(fontSize).to.be.at.least(
                    16,
                    `Price font size ${fontSize}px is too small (minimum 16px)`
                  );

                  // Check font size is not too large
                  expect(fontSize).to.be.at.most(
                    32,
                    `Price font size ${fontSize}px is too large (maximum 32px)`
                  );

                  cy.log(`✓ Price font size is appropriate (${fontSize}px)`);

                  // Check price width relative to card
                  const widthRatio = (priceWidth / cardWidth) * 100;

                  expect(widthRatio).to.be.at.least(
                    10,
                    `Price is too narrow (${widthRatio.toFixed(
                      1
                    )}% of card width, minimum 10%)`
                  );

                  expect(widthRatio).to.be.at.most(
                    90,
                    `Price is too wide (${widthRatio.toFixed(
                      1
                    )}% of card width, maximum 90%)`
                  );

                  cy.log(
                    `✓ Price width is appropriate (${widthRatio.toFixed(
                      1
                    )}% of card width)`
                  );
                });
            });
        });
      });
  }

  VerifyButtonsBuyWithoutMembership() {
    cy.get(this.confirmWithoutMembership).should("be.visible").click();

    cy.get(this.modal).should("be.visible");
    cy.get(this.toolTipButtons).should("be.visible");

    cy.get(this.toolTipButtons).within(() => {
      const buttons = [this.dontSaveMoney, this.saveMoney];

      buttons.forEach((btn) => {
        cy.get(btn)
          .should("be.visible")
          .then(($btn) => {
            const buttonEl = $btn[0];
            const buttonRect = buttonEl.getBoundingClientRect();
            const buttonWidth = buttonRect.width;
            const textContent = $btn.text().trim();
            const computedStyle = window.getComputedStyle(buttonEl);

            expect(
              buttonWidth,
              `width ${buttonWidth.toFixed(2)}px is too small`
            ).to.be.at.least(100);

            const isTextOverflowing =
              buttonEl.scrollWidth > buttonEl.clientWidth;
            expect(
              isTextOverflowing,
              `text "${textContent}" is being clipped (scrollWidth: ${buttonEl.scrollWidth}px vs clientWidth: ${buttonEl.clientWidth}px)`
            ).to.be.false;

            expect(
              $btn,
              `text "${textContent}" is not fully visible`
            ).to.contain.text(textContent);
          });
      });
    });
  }
}

export default DealPage;
