class Cart {
  url = "/cart/";
  cartProductName = "td.product-name";
  cartProductPrice = "td.product-subtotal";
  messageAlert = ".woocommerce-message";
  errorAlert = ".woocommerce-error";

  cartTable = "table.woocommerce-cart-form__contents";
  cartImages = "tbody img.attachment-woocommerce_thumbnail";

  footer = "#footer";

  visit() {
    cy.visit(this.url);
    return this;
  }

  VerifyProductInCart(title, price) {
    cy.get(this.cartProductName, { timeout: 10000 })
      .should("be.visible")
      .first()
      .should("contain.text", title);

    cy.get(this.cartProductPrice, { timeout: 10000 })
      .should("be.visible")
      .first()
      .should("contain.text", price);
    return this;
  }

  VerfiyProductAddedMessage(msg) {
    cy.get(this.messageAlert, { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", msg);
    return this;
  }

  VerfiyProductNotAddedMessage(msg) {
    cy.get(this.errorAlert, { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", msg);

    return this;
  }

  VerifyNoExtraSpaceFooter() {
    cy.get(this.footer).should("exist");

    cy.get("body").then(($body) => {
      const bodyBottom = $body[0].getBoundingClientRect().bottom;

      cy.get(this.footer).then(($footer) => {
        const footerBottom = $footer[0].getBoundingClientRect().bottom;

        expect(Math.abs(footerBottom - bodyBottom)).to.be.lessThan(2);
      });
    });
  }

  VerifyCartThumbnailConsistency() {
    const thumbnailDimensions = [];

    cy.get(this.cartTable, { timeout: 30000 }).should("be.visible");

    cy.get(this.cartImages, { timeout: 30000 }).each(($img, index) => {
      cy.wrap($img)
        .should("be.visible")
        .and(($el) => {
          // Wait until image is fully loaded
          expect($el[0].complete).to.be.true;
          expect($el[0].naturalWidth).to.be.greaterThan(0);
        })
        .then(($element) => {
          // Give a small delay for layout to settle
          cy.wait(100);

          const width = $element[0].clientWidth;
          const height = $element[0].clientHeight;

          thumbnailDimensions.push({
            index,
            width,
            height,
            aspectRatio: (width / height).toFixed(2),
          });

          cy.log(
            `Image ${index}: ${width}px × ${height}px (Aspect Ratio: ${(
              width / height
            ).toFixed(2)})`
          );
        });
    });

    cy.then(() => {
      const firstImage = thumbnailDimensions[0];
      cy.log(`Reference Image: ${firstImage.width}px × ${firstImage.height}px`);

      const tolerance = 1;
      thumbnailDimensions.forEach((img, idx) => {
        expect(
          img.width,
          `Image ${idx} width should be ~${firstImage.width}px but got ${img.width}px`
        ).to.be.within(
          firstImage.width - tolerance,
          firstImage.width + tolerance
        );

        expect(
          img.height,
          `Image ${idx} height should be ~${firstImage.height}px but got ${img.height}px`
        ).to.be.within(
          firstImage.height - tolerance,
          firstImage.height + tolerance
        );
      });
    });
  }
}

export default new Cart();
