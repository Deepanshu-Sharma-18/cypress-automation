import SearchBar from "./components/SearchBar";
import Subscription from "./components/Subscription";
class HomePage {
  url = "/";

  dropdown = ".jet-mega-menu-mega-container";
  dropdownLinks = "#jet-mega-menu-item-846270 .elementor-icon-list-item a";
  hamburgerMenu =
    ".e-con-inner > #pw-mobile-menu > :nth-child(1) > .jet-mega-menu > .jet-mega-menu-toggle";
  hamburgetMenuList = ".jet-mega-menu-list";
  hamburgerItemStore =
    ".e-con-inner > #pw-mobile-menu > :nth-child(1) > .jet-mega-menu > .jet-mega-menu-container > .jet-mega-menu-list > #jet-mega-menu-item-295301 > .jet-mega-menu-item__inner";
  hamburgerItemStoreExpanded =
    ".e-con-inner > #pw-mobile-menu > :nth-child(1) > .jet-mega-menu > .jet-mega-menu-container > .jet-mega-menu-list > #jet-mega-menu-item-295301 > .jet-mega-menu-mega-container > .jet-mega-menu-mega-container__inner > .elementor > #pw-mega-menu";

  cart = 'a[href="/cart"]';
  header = '[data-elementor-type="header"]';

  constructor() {
    this.searchBar = new SearchBar();
    this.Subscription = new Subscription();
  }

  visit() {
    cy.visit(this.url);
  }

  checkPageLoaded() {
    cy.url().should("include", Cypress.config().baseUrl);
    return this;
  }

  clickOnMyAccountMenu() {
    cy.wait(2000);

    cy.get("body").then(($body) => {
      const myAccountElements = $body.find(':contains("My Account")');
    });

    cy.get(".jet-mega-menu-item__label")
      .filter(":visible")
      .contains("My Account")
      .should("be.visible")
      .parent()
      .parent()
      .trigger("mouseover", { force: true });

    cy.wait(1000);
    return this;
  }

  verifyDropdownLinksStartWith() {
    cy.get(this.dropdown).should("exist").invoke("show").should("be.visible");

    cy.get(this.dropdownLinks)
      .should("have.length.greaterThan", 0)
      .each(($link) => {
        cy.wrap($link)
          .invoke("attr", "href")
          .then((href) => {
            const allowedDomains = [
              "https://www.photowhoa.com",
              "https://photowhoa.freshdesk.com",
            ];
            const isValid = allowedDomains.some((domain) =>
              href.startsWith(domain)
            );
            expect(isValid, `Link "${href}" should start with allowed domain`)
              .to.be.true;
          });
      });
    return this;
  }

  /**
   * Checks X-Cache header - warms up cache until HIT, then validates
   * @param {Object} options - Configuration options
   * @returns {HomePage} - For method chaining
   */
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

  enterSearchTerm(term) {
    this.searchBar.enterSearchTerm(term);
    return this;
  }

  verifySearchResultContainer() {
    this.searchBar.verifySearchResultContainer();
    return this;
  }

  verifySearchResultRecommended(term) {
    this.searchBar.verifySearchResultRecommended(term);
    return this;
  }

  submitSearch() {
    this.searchBar.submitSearch();
    return this;
  }

  verifySearchResult(term) {
    this.searchBar.verifySearchResult(term);
    return this;
  }

  ClickHamburgerMenu() {
    cy.get(this.hamburgerMenu, { timeout: 15000 }).should("be.visible").click();
  }
  VerifyHamburgerMenuItems() {
    cy.get(this.hamburgetMenuList).should("be.visible");
  }

  ToggleHamburgerMenuItemStore() {
    cy.get(this.hamburgerItemStore)
      .scrollIntoView()
      .should("be.visible")
      .click();
  }

  VerifyOpenCloseStoreMenuItem(toggle) {
    if (toggle) {
      cy.get(this.hamburgerItemStore).should(
        "have.attr",
        "aria-expanded",
        "true"
      );
    } else {
      cy.get(this.hamburgerItemStore).should(
        "have.attr",
        "aria-expanded",
        "false"
      );
    }
  }

  VerifyCartIconCenterAligned() {
    cy.get(this.cart).then(($cart) => {
      const cartRect = $cart[0].getBoundingClientRect();
      const cartCenterY = cartRect.top + cartRect.height / 2;

      cy.get(this.header).then(($header) => {
        const headerRect = $header[0].getBoundingClientRect();
        const headerCenterY = headerRect.top + headerRect.height / 2;

        const difference = Math.abs(cartCenterY - headerCenterY);
        expect(difference).to.be.lessThan(15);
      });
    });
  }

  verifyVideoIsPlaying() {
    cy.visit("/cart/");
    cy.get('a[href="https://www.photowhoa.com"]').click();

    cy.get("iframe.elementor-background-video-embed", {
      timeout: 10000,
    }).should("be.visible");

    cy.window({ log: false })
      .should((win) => {
        expect(win.YT).to.exist;
        expect(win.YT.Player).to.exist;
      })
      .then((win) => {
        const player = new win.YT.Player("widget2", {
          events: {
            onReady: (event) => {
              const state = event.target.getPlayerState();
              if (state !== 1) {
                // not playing
                event.target.playVideo();
                Cypress.log({ name: "YT Player", message: "Started video" });
              } else {
                Cypress.log({
                  name: "YT Player",
                  message: "Video is already playing",
                });
              }
            },
          },
        });
      });
  }

  getSubscription() {
    return this.Subscription;
  }
}

export default new HomePage();
