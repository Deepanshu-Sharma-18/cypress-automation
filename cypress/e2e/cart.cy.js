// <reference type="cypress" />

import Cart from "../support/pages/Cart.js";

import DealPage from "../support/pages/DealPage.js";

describe("Cart Page Tests", () => {
  it("should verify that success alert is dispalyed on cart when product is added", () => {
    const dealPage = new DealPage("vector-image-converter/");
    dealPage.visit();
    dealPage.addToCart();
    Cart.VerfiyProductAddedMessage("Vector Image Converter For Windows & Mac");
  });

  it("should verify that error alert is displayed on cart when product is added again", () => {
    const dealPage = new DealPage("vector-image-converter/");
    dealPage.visit();
    dealPage.addToCart();

    dealPage.visit();
    dealPage.addToCart();
    Cart.VerfiyProductNotAddedMessage(
      "You cannot add another “Vector Image Converter For Windows & Mac"
    );
  });

  it("should verify product is being added to cart", () => {
    const dealPage = new DealPage("vector-image-converter/");
    dealPage.visit();
    dealPage.addToCart();
    Cart.VerifyProductInCart(
      "Vector Image Converter For Windows & Mac",
      "19.99"
    );
  });

  it("should verify that the footer has no extra space", () => {
    Cart.visit();
    Cart.VerifyNoExtraSpaceFooter();
  });

  it("should verify that all the product thumbnails are consistent", () => {
    // Use desktop viewport for thumbnail testing
    cy.viewport(1280, 720);

    let dealPage = new DealPage("vector-image-converter/");
    dealPage.visit();
    dealPage.addToCart();
    cy.wait(5000);

    dealPage = new DealPage("wedding-photography-guide-bp4u/");
    dealPage.visit();
    dealPage.addToCart();
    cy.wait(5000);
    Cart.visit();
    Cart.VerifyCartThumbnailConsistency();
  });
});
