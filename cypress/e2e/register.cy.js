describe('User Registration', () => {
  it('should register a new user and redirect to login', () => {
    const username = `user${Date.now()}`;
    cy.visit('http://localhost:3000/register');
    cy.get('[data-cy=username]').type(username);
    cy.get('[data-cy=password]').type('testpass');
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy=username]').should('exist');
  });

  it('should focus the username input when clicked', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('[data-cy=username]').click().should('be.focused');
  });
}); 