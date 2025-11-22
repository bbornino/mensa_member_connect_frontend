/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login as a user
       * @example cy.login('testuser@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      /**
       * Custom command to login as an admin user
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>;

      /**
       * Custom command to login as a pending user (status: pending)
       * @example cy.loginAsPending()
       */
      loginAsPending(): Chainable<void>;

      /**
       * Custom command to login as an active user (status: active)
       * @example cy.loginAsActive()
       */
      loginAsActive(): Chainable<void>;

      /**
       * Custom command to wait for the app to finish loading
       * @example cy.waitForAppLoad()
       */
      waitForAppLoad(): Chainable<void>;
    }
  }
}

// Auth helper functions
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.waitForAppLoad();
  cy.get('#email').should('be.visible').type(email);
  cy.get('#password').should('be.visible').type(password);
  cy.get('form').submit();
  
  // Wait for login API call to complete if it was intercepted
  // Note: This will only work if intercepts are set up before calling login()
  cy.wait('@loginRequest', { timeout: 10000 });
  
  // Wait for navigation after login (default redirects to /experts)
  cy.url({ timeout: 10000 }).should('not.include', '/login');
  cy.waitForAppLoad();
});

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('access_token');
    win.localStorage.removeItem('refresh_token');
    win.localStorage.removeItem('user');
  });
  cy.visit('/');
  cy.waitForAppLoad();
});

Cypress.Commands.add('loginAsAdmin', () => {
  // Login as admin user (role: admin)
  const adminEmail = Cypress.env('ADMIN_EMAIL') || 'admin@example.com';
  const adminPassword = Cypress.env('ADMIN_PASSWORD') || 'admin123';

  const mockUser = {
    id: 1,
    email: adminEmail,
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    status: 'active',
  };

  // Set up intercepts for login API call
  cy.intercept('POST', /.*users\/authenticate.*/, {
    statusCode: 200,
    body: {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: mockUser,
    },
  }).as('loginRequest');

  // Mock the experts endpoint that will be called after redirect
  cy.intercept('GET', /.*users\/experts.*/, {
    statusCode: 200,
    body: [],
  }).as('expertsRequest');

  // Mock token refresh endpoint
  cy.intercept('POST', /.*token\/refresh.*/, {
    statusCode: 200,
    body: {
      access: 'mock-refreshed-access-token',
    },
  }).as('tokenRefresh');

  // Mock users/me endpoint for auth initialization
  cy.intercept('GET', /.*users\/me.*/, {
    statusCode: 200,
    body: mockUser,
  }).as('getCurrentUser');

  cy.login(adminEmail, adminPassword);
});

Cypress.Commands.add('loginAsPending', () => {
  // Login as pending user (status: pending) - has restricted access
  const pendingEmail = Cypress.env('PENDING_EMAIL') || 'testuser_pending@example.com';
  const pendingPassword = Cypress.env('PENDING_PASSWORD') || 'testpassword123';

  const mockUser = {
    id: 2,
    email: pendingEmail,
    first_name: 'Pending',
    last_name: 'User',
    role: 'member',
    status: 'pending',
  };

  // Set up intercepts for login API call
  cy.intercept('POST', /.*users\/authenticate.*/, {
    statusCode: 200,
    body: {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: mockUser,
    },
  }).as('loginRequest');

  // Mock the experts endpoint that will be called after redirect
  cy.intercept('GET', /.*users\/experts.*/, {
    statusCode: 200,
    body: [],
  }).as('expertsRequest');

  // Mock token refresh endpoint
  cy.intercept('POST', /.*token\/refresh.*/, {
    statusCode: 200,
    body: {
      access: 'mock-refreshed-access-token',
    },
  }).as('tokenRefresh');

  // Mock users/me endpoint for auth initialization
  cy.intercept('GET', /.*users\/me.*/, {
    statusCode: 200,
    body: mockUser,
  }).as('getCurrentUser');

  cy.login(pendingEmail, pendingPassword);
});

Cypress.Commands.add('loginAsActive', () => {
  // Login as active user (status: active) - has full access
  const activeEmail = Cypress.env('ACTIVE_EMAIL') || 'testuser_active@example.com';
  const activePassword = Cypress.env('ACTIVE_PASSWORD') || 'testpassword123';

  const mockUser = {
    id: 1,
    email: activeEmail,
    first_name: 'Active',
    last_name: 'User',
    role: 'member',
    status: 'active',
  };

  // Set up intercepts for login API call
  cy.intercept('POST', /.*users\/authenticate.*/, {
    statusCode: 200,
    body: {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: mockUser,
    },
  }).as('loginRequest');

  // Mock the experts endpoint that will be called after redirect
  cy.intercept('GET', /.*users\/experts.*/, {
    statusCode: 200,
    body: [],
  }).as('expertsRequest');

  // Mock token refresh endpoint
  cy.intercept('POST', /.*token\/refresh.*/, {
    statusCode: 200,
    body: {
      access: 'mock-refreshed-access-token',
    },
  }).as('tokenRefresh');

  // Mock users/me endpoint for auth initialization
  cy.intercept('GET', /.*users\/me.*/, {
    statusCode: 200,
    body: mockUser,
  }).as('getCurrentUser');

  cy.login(activeEmail, activePassword);
});

Cypress.Commands.add('waitForAppLoad', () => {
  // Wait for the loading state to disappear
  cy.get('body').should('not.contain', 'Loading...');
  // Additional wait for React hydration if needed
  cy.wait(500);
});

export {};

