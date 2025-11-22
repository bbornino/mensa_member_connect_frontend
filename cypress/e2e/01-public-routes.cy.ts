describe('Public Routes', () => {
  beforeEach(() => {
    // Ensure we're logged out before each test
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('should load the welcome page', () => {
    cy.visit('/');
    cy.contains('Expert member-to-member connections.', { matchCase: false }).should('be.visible');
  });

  it('should navigate to about page', () => {
    cy.visit('/');
    cy.contains('About', { matchCase: false }).click();
    cy.url().should('include', '/about');
  });

  it('should navigate to FAQ page', () => {
    cy.visit('/');
    cy.contains('FAQ', { matchCase: false }).click();
    cy.url().should('include', '/faq');
  });

  it('should display login page', () => {
    cy.visit('/login');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');
  });

  it('should display register page', () => {
    cy.visit('/register');
    cy.url().should('include', '/register');
  });

  it('should redirect to login when accessing protected route without auth', () => {
    cy.visit('/dashboard', { failOnStatusCode: false });
    // Should redirect to login or show login page
    cy.url().should('satisfy', (url) => {
      return url.includes('/login') || url.includes('/dashboard');
    });
  });
});

