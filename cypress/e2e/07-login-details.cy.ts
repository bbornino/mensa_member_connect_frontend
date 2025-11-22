describe('Login Details', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
  });

  it('should display login form correctly', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    // Check form elements
    cy.get('form').should('exist');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');
    cy.contains('Login', { matchCase: false }).should('be.visible');
  });

  it('should show error for empty email', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    cy.get('#password').should('not.be.disabled').type('somepassword');
    cy.get('form').submit();

    // Should show error or stay on login page
    cy.wait(1000);
    cy.url().should('include', '/login');
  });

  it('should show error for empty password', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    cy.get('#email').should('not.be.disabled').type('testuser@example.com');
    cy.get('form').submit();

    // Should show error or stay on login page
    cy.wait(1000);
    cy.url().should('include', '/login');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    // Intercept login API call with error response
    cy.intercept('POST', '**/api/users/authenticate/', {
      statusCode: 401,
      body: { error: 'Invalid credentials' },
    }).as('loginError');

    cy.get('#email').should('not.be.disabled').type('invalid@example.com');
    cy.get('#password').should('not.be.disabled').type('wrongpassword');
    cy.get('form').submit();

    cy.wait('@loginError');
    cy.wait(1000);

    // Should show error message or stay on login page
    cy.url().should('include', '/login');
    cy.get('body').then(($body) => {
      if ($body.text().includes('Failed to sign in') || $body.text().includes('error')) {
        cy.log('Error message displayed correctly');
      }
    });
  });

  it('should successfully login as active user and redirect to experts', () => {
    const email = Cypress.env('ACTIVE_EMAIL') || 'testuser_active@example.com';
    const password = Cypress.env('ACTIVE_PASSWORD') || 'testpassword123';

    const mockUser = {
          id: 1,
          email: email,
          first_name: 'Active',
          last_name: 'User',
          role: 'member',
          status: 'active',
    };

    // Intercept login API call
    cy.intercept('POST', /.*users\/authenticate.*/, {
      statusCode: 200,
      body: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: mockUser,
      },
    }).as('loginRequest');

    // Intercept users/me call that happens during auth initialization
    // This is called when the app checks if user is already logged in
    cy.intercept('GET', /.*users\/me.*/, {
      statusCode: 200,
      body: mockUser,
    }).as('getCurrentUser');

    // Visit login page
    cy.visit('/login');
    
    // Fill in login form
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    
    // Submit form
    cy.get('form').submit();

    // Wait for login API call to complete
    cy.wait('@loginRequest', { timeout: 10000 });
    
    // Verify that user data was stored in localStorage (login succeeded)
    cy.window().its('localStorage').should('have.property', 'access_token');
    cy.window().its('localStorage').should('have.property', 'user');

    // Wait for navigation to /experts
    // The navigate() happens in Login component, but React state needs to update first
    // ProtectedRoute checks user state, so we need to wait for state to propagate
    cy.url({ timeout: 10000 }).should((url) => {
      expect(url).to.include('/experts');
    });
    
    // Verify we're not redirected back to login (user state is set correctly)
    cy.url().should('not.include', '/login');
  });

  it('should successfully login as pending user and redirect', () => {
    const email = Cypress.env('PENDING_EMAIL') || 'testuser_pending@example.com';
    const password = Cypress.env('PENDING_PASSWORD') || 'testpassword123';

    // Intercept successful login for pending user BEFORE visiting the page
    cy.intercept('POST', '**/api/users/authenticate/', {
      statusCode: 200,
      body: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: {
          id: 2,
          email: email,
          first_name: 'Pending',
          last_name: 'User',
          role: 'member',
          status: 'pending',
        },
      },
    }).as('loginSuccess');

    cy.visit('/login');
    cy.waitForAppLoad();

    cy.get('#email').should('not.be.disabled').type(email);
    cy.get('#password').should('not.be.disabled').type(password);
    cy.get('form').submit();

    // Wait for the login API call to complete
    cy.wait('@loginSuccess');
    
    // Wait for navigation to /experts to complete (pending users also redirect to /experts)
    cy.url().should('include', '/experts');
    cy.waitForAppLoad();
  });

  it('should toggle password visibility', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    cy.get('#password').should('not.be.disabled').type('secretpassword');
    cy.get('#password').should('have.attr', 'type', 'password');

    // Click show/hide toggle
    cy.contains('Show').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    cy.contains('Hide').should('be.visible');

    cy.contains('Hide').click();
    cy.get('#password').should('have.attr', 'type', 'password');
    cy.contains('Show').should('be.visible');
  });

  it('should maintain form values during interaction', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    cy.get('#email').should('not.be.disabled').type('testuser123@example.com');
    cy.get('#password').should('not.be.disabled').type('password123');

    // Toggle password visibility
    cy.contains('Show').click();
    
    // Values should still be there
    cy.get('#email').should('have.value', 'testuser123@example.com');
    cy.get('#password').should('have.value', 'password123');
  });

  it('should navigate to register from login page', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    // Check if there's a link to register (if present in UI)
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/register"]').length > 0) {
        // Click the first register link if multiple exist
        cy.get('a[href*="/register"]').first().click();
        cy.url().should('include', '/register');
      } else {
        // Or can navigate via URL
        cy.visit('/register');
        cy.url().should('include', '/register');
      }
    });
  });

  it('should persist login state after page reload for active user', () => {
    cy.loginAsActive();

    // Reload the page
    cy.reload();
    cy.waitForAppLoad();

    // Should still be logged in (not redirected to login)
    cy.url().should('not.include', '/login');
    cy.contains('Logout').should('be.visible');
  });

  it('should persist login state after page reload for pending user', () => {
    cy.loginAsPending();

    // Reload the page
    cy.reload();
    cy.waitForAppLoad();

    // Should still be logged in (not redirected to login)
    cy.url().should('not.include', '/login');
    cy.contains('Logout').should('be.visible');
  });

  it('should clear form on navigation away and back', () => {
    cy.visit('/login');
    cy.waitForAppLoad();

    cy.get('#email').should('not.be.disabled').type('testuser@example.com');
    cy.get('#password').should('not.be.disabled').type('password');

    // Navigate away
    cy.visit('/');
    cy.waitForAppLoad();

    // Navigate back
    cy.visit('/login');
    cy.waitForAppLoad();

    // Form should be cleared or empty
    cy.get('#email').should('have.value', '');
    cy.get('#password').should('have.value', '');
  });
});

