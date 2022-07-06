Cypress.Commands.add("fillMandatoryFieldsAndSubmit", function () {
    cy.get("#firstName").type("Bruno")
    cy.get("#lastName").type("Destefani")
    cy.get("#email").type("bruno@bruno.com")
    cy.get("#open-text-area").type('Teste')
    // cy.get('button[type="submit"]').click();
    cy.contains('button', 'Enviar').click()
  });
  