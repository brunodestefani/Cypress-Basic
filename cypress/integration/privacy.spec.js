it('testa a página da política de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')    
    cy.contans('Talking About Testing').should('be.visible')
});