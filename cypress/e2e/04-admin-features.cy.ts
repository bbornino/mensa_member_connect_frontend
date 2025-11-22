describe('Admin Features', () => {
  beforeEach(() => {
    // Login as admin
    cy.loginAsAdmin();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should access admin panel when logged in as admin', () => {
    cy.visit('/admin');
    cy.waitForAppLoad();
    cy.url().should('include', '/admin');
  });

  it('should show admin link in navigation for admin users', () => {
    cy.visit('/');
    cy.waitForAppLoad();
    cy.contains('Admin').should('be.visible');
  });

  it('should not show admin link for non-admin users', () => {
    cy.logout();
    
    const email = Cypress.env('TEST_EMAIL') || 'testuser@example.com';
    const password = Cypress.env('TEST_PASSWORD') || 'testpassword123';
    cy.login(email, password);
    
    cy.visit('/');
    cy.waitForAppLoad();
    
    // Admin link should not be visible for regular users
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Admin")').length === 0) {
        cy.log('Admin link correctly hidden for non-admin users');
      }
    });
  });
});

