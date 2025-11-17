describe('Protected Routes', () => {
  beforeEach(() => {
    const username = Cypress.env('TEST_USERNAME') || 'testuser';
    const password = Cypress.env('TEST_PASSWORD') || 'testpassword123';

    cy.login(username, password);
  });

  afterEach(() => {
    cy.logout();
  });

  it('should access dashboard when authenticated', () => {
    cy.visit('/dashboard');
    cy.waitForAppLoad();
    cy.url().should('include', '/dashboard');
  });

  it('should access profile page when authenticated', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    cy.url().should('include', '/profile');
  });

  it('should access experts page when authenticated', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();
    cy.url().should('include', '/experts');
  });

  it('should navigate to expert detail page', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();
    
    // Try to find and click on an expert (if available)
    // This will depend on your Experts component structure
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.url().should('match', /\/expert\/\d+/);
      } else {
        cy.log('No experts available to test detail page');
      }
    });
  });

  it('should show navigation menu for authenticated users', () => {
    cy.visit('/');
    cy.waitForAppLoad();
    
    // Check for authenticated navigation items
    cy.contains('Experts').should('be.visible');
    cy.contains('Profile').should('be.visible');
    cy.contains('Logout').should('be.visible');
  });
});

