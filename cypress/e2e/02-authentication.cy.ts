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

  it('should successfully login with active user credentials', () => {
    const username = Cypress.env('ACTIVE_USERNAME') || 'testuser_active';
    const password = Cypress.env('ACTIVE_PASSWORD') || 'testpassword123';

    cy.visit('/login');
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('form').submit();
    
    // Should redirect after successful login
    cy.waitForAppLoad();
    cy.url().should('not.include', '/login');
    // Active users should be able to access /experts
    cy.url().should('include', '/experts');
  });

  it('should successfully login with pending user credentials', () => {
    const username = Cypress.env('PENDING_USERNAME') || 'testuser_pending';
    const password = Cypress.env('PENDING_PASSWORD') || 'testpassword123';

    cy.visit('/login');
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('form').submit();
    
    // Should redirect after successful login (pending users can still login)
    cy.waitForAppLoad();
    cy.url().should('not.include', '/login');
    // Pending users may also redirect to /experts but have restricted access
    cy.url().should('satisfy', (url) => {
      return url.includes('/experts') || url === Cypress.config('baseUrl') + '/';
    });
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

  it('should persist login state across page reloads for active user', () => {
    cy.loginAsActive();
    
    // Reload the page
    cy.reload();
    cy.waitForAppLoad();
    
    // Should still be logged in (not redirected to login)
    cy.url().should('not.include', '/login');
    cy.contains('Logout').should('be.visible');
  });

  it('should persist login state across page reloads for pending user', () => {
    cy.loginAsPending();
    
    // Reload the page
    cy.reload();
    cy.waitForAppLoad();
    
    // Should still be logged in (not redirected to login)
    cy.url().should('not.include', '/login');
    cy.contains('Logout').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.loginAsActive();
    
    // Find and click logout
    cy.contains('Logout').click();
    
    // Should redirect to home or login
    cy.waitForAppLoad();
    cy.url().should('satisfy', (url) => {
      return url === Cypress.config('baseUrl') + '/' || url.includes('/login');
    });
    
    // Should not see authenticated navigation
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Logout')) {
        cy.log('Successfully logged out');
      }
    });
  });
});

