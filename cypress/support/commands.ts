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
       * @example cy.login('testuser', 'password123')
       */
      login(username: string, password: string): Chainable<void>;

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
       * Custom command to wait for the app to finish loading
       * @example cy.waitForAppLoad()
       */
      waitForAppLoad(): Chainable<void>;
    }
  }
}

// Auth helper functions
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('form').submit();
  // Wait for navigation after login (default redirects to /experts)
  cy.url().should('not.include', '/login');
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
  // This will need to be configured with actual admin credentials
  // For now, using environment variable or default test admin
  const adminUsername = Cypress.env('ADMIN_USERNAME') || 'admin';
  const adminPassword = Cypress.env('ADMIN_PASSWORD') || 'admin123';
  cy.login(adminUsername, adminPassword);
});

Cypress.Commands.add('waitForAppLoad', () => {
  // Wait for the loading state to disappear
  cy.get('body').should('not.contain', 'Loading...');
  // Additional wait for React hydration if needed
  cy.wait(500);
});

export {};

