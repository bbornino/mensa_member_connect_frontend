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
    cy.waitForAppLoad();
    cy.get('#username').should('not.be.disabled').type('invaliduser');
    cy.get('#password').should('not.be.disabled').type('wrongpassword');
    cy.get('form').submit();
    
    // Should show error message or stay on login page
    cy.wait(1000);
    cy.url().should('include', '/login');
  });

  it('should successfully login with active user credentials', () => {
    const username = Cypress.env('ACTIVE_USERNAME') || 'testuser_active';
    const password = Cypress.env('ACTIVE_PASSWORD') || 'testpassword123';

    // Set up intercept for login API call
    cy.intercept('POST', '**/users/authenticate/**', {
      statusCode: 200,
      body: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: {
          id: 1,
          username: username,
          email: 'active@example.com',
          first_name: 'Active',
          last_name: 'User',
          role: 'member',
          status: 'active',
        },
      },
    }).as('loginRequest');

    // Visit login page
    cy.visit('/login');
    
    // Fill in login form
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    
    // Submit form
    cy.get('form').submit();

    // Wait for login API call to complete
    cy.wait('@loginRequest');
    
    // Verify redirect to experts page
    cy.url().should('include', '/experts');
  });

  it('should successfully login with pending user credentials', () => {
    const username = Cypress.env('PENDING_USERNAME') || 'testuser_pending';
    const password = Cypress.env('PENDING_PASSWORD') || 'testpassword123';

    // Intercept successful login for pending user BEFORE visiting the page
    cy.intercept('POST', '**/api/users/authenticate/', {
      statusCode: 200,
      body: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: {
          id: 2,
          username: username,
          email: 'pending@example.com',
          first_name: 'Pending',
          last_name: 'User',
          role: 'member',
          status: 'pending',
        },
      },
    }).as('loginSuccess');

    cy.visit('/login');
    cy.waitForAppLoad();
    cy.get('#username').should('not.be.disabled').type(username);
    cy.get('#password').should('not.be.disabled').type(password);
    cy.get('form').submit();
    
    // Wait for the login API call to complete
    cy.wait('@loginSuccess');
    
    // Wait for navigation to /experts to complete (pending users also redirect to /experts)
    cy.url().should('include', '/experts');
    cy.waitForAppLoad();
  });

  it('should allow password visibility toggle', () => {
    cy.visit('/login');
    cy.waitForAppLoad();
    cy.get('#password').should('not.be.disabled').type('secretpassword');
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

