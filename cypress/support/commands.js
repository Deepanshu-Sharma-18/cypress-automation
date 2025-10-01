// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("checkNoMetaPixelDuplicate", () => {
  cy.window().then((win) => {
    const consoleWarnSpy = cy.spy(win.console, "warn");

    cy.wrap(null).then(() => {
      const calls = consoleWarnSpy.getCalls();

      calls.forEach((call) => {
        const warningMessage = call.args.join(" ");

        expect(warningMessage).to.not.include(
          "[Meta Pixel] - Duplicate Pixel ID"
        );
      });
    });
  });
});

Cypress.Commands.add("stubThirdPartyScripts", () => {
  // Block Google Analytics, gtag, GTM
  cy.intercept("GET", "**/analytics.js", { statusCode: 200 });
  cy.intercept("GET", "**/gtag/js**", { statusCode: 200 });
  cy.intercept("GET", "**/googletagmanager.com/**", { statusCode: 200 });

  // Block YouTube embeds
  cy.intercept("GET", "**/youtube.com/**", { statusCode: 200 });
});
