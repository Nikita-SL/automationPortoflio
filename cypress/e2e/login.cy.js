describe('User logs in', () => {
    it('should login with valid credentials', () => {
        cy.visit('http://localhost:3000/login');
        cy.get('[data-cy=username]').type('RegisteredUser');
        cy.get('[data-cy=password]').type('RegisteredUser');
        cy.get('[data-cy=submit]').click();
        cy.url().should('include', '/dashboard');
    });
});