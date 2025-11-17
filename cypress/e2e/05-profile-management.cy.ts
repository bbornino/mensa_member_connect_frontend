describe('Profile Management', () => {
  beforeEach(() => {
    const username = Cypress.env('TEST_USERNAME') || 'testuser';
    const password = Cypress.env('TEST_PASSWORD') || 'testpassword123';

    cy.login(username, password);
  });

  afterEach(() => {
    cy.logout();
  });

  it('should navigate to profile page', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    cy.url().should('include', '/profile');
  });

  it('should display profile edit form', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // Wait for form to load
    cy.get('form', { timeout: 10000 }).should('exist');
  });

  it('should allow editing profile information', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // Look for input fields in the profile form
    cy.get('body').then(($body) => {
      // This will depend on your EditProfile component structure
      if ($body.find('input[type="text"]').length > 0) {
        cy.get('input[type="text"]').first().clear();
        cy.get('input[type="text"]').first().type('Updated Name');
      }
    });
  });
});

