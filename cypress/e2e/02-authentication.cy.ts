describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
  });

  it('should show error for invalid login credentials', () => {
    cy.visit('/login');
    cy.get('#username').type('invaliduser');
    cy.get('#password').type('wrongpassword');
    cy.get('form').submit();
    
    // Should show error message or stay on login page
    cy.wait(1000);
    cy.url().should('include', '/login');
  });

  it('should successfully login with valid credentials', () => {
    // Note: You'll need to have test credentials set up in your backend
    // or use environment variables
    const username = Cypress.env('TEST_USERNAME') || 'testuser';
    const password = Cypress.env('TEST_PASSWORD') || 'testpassword123';

    cy.visit('/login');
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('form').submit();
    
    // Should redirect after successful login
    cy.waitForAppLoad();
    cy.url().should('not.include', '/login');
  });

  it('should allow password visibility toggle', () => {
    cy.visit('/login');
    cy.get('#password').type('secretpassword');
    cy.get('#password').should('have.attr', 'type', 'password');
    
    // Click show/hide toggle
    cy.contains('Show').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    
    cy.contains('Hide').click();
    cy.get('#password').should('have.attr', 'type', 'password');
  });

  it('should persist login state across page reloads', () => {
    const username = Cypress.env('TEST_USERNAME') || 'testuser';
    const password = Cypress.env('TEST_PASSWORD') || 'testpassword123';

    cy.login(username, password);
    
    // Reload the page
    cy.reload();
    cy.waitForAppLoad();
    
    // Should still be logged in (not redirected to login)
    cy.url().should('not.include', '/login');
  });

  it('should logout successfully', () => {
    const username = Cypress.env('TEST_USERNAME') || 'testuser';
    const password = Cypress.env('TEST_PASSWORD') || 'testpassword123';

    cy.login(username, password);
    
    // Find and click logout
    cy.contains('Logout').click();
    
    // Should redirect to home or login
    cy.waitForAppLoad();
    cy.url().should('satisfy', (url) => {
      return url === Cypress.config('baseUrl') + '/' || url.includes('/login');
    });
  });
});

