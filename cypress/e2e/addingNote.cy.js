describe('Adding a note', () => {
    it('should add a note', () => {
        const noteContent = `note${Date.now()}`;
        cy.visit('http://localhost:3000/login');
        cy.get('[data-cy=username]').type('RegisteredUser');
        cy.get('[data-cy=password]').type('RegisteredUser');
        cy.get('[data-cy=submit]').click();
        cy.get('[data-cy=new-note]').click();
        cy.get('[data-cy=note-content]').type(noteContent);
        cy.get('[data-cy=save-note]').click();
        cy.url().should('include', '/dashboard');
        cy.get('[data-cy=note]').should('contain', noteContent);
    });
});