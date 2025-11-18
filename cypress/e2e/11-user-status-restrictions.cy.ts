describe('User Status Restrictions', () => {
  afterEach(() => {
    cy.logout();
  });

  it('should restrict pending user from viewing expert details', () => {
    cy.loginAsPending();

    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        // Should show pending verification message instead of expert details
        cy.contains('Account Pending Verification', { matchCase: false }).should('be.visible');
        cy.contains('pending until your membership is verified', { matchCase: false }).should('be.visible');
        
        // Should show link to edit profile
        cy.contains('Edit My Profile', { matchCase: false }).should('be.visible');
      } else {
        cy.log('No experts available to test restriction');
      }
    });
  });

  it('should allow pending user to edit their own profile', () => {
    cy.loginAsPending();

    cy.visit('/profile');
    cy.waitForAppLoad();
    cy.url().should('include', '/profile');

    // Should be able to access profile page
    cy.get('#first_name').should('be.visible');
    cy.get('#last_name').should('be.visible');
  });

  it('should allow active user to view expert details', () => {
    cy.loginAsActive();

    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();
        cy.url().should('match', /\/expert\/\d+/);

        // Should NOT show pending verification message
        cy.get('body').then(($body2) => {
          if (!$body2.text().includes('Account Pending Verification')) {
            cy.log('Active user can view expert details correctly');
          }
        });

        // Should see expert information
        cy.get('body').should('not.contain.text', 'Account Pending Verification');
      } else {
        cy.log('No experts available to test expert detail access');
      }
    });
  });

  it('should allow active user to contact experts', () => {
    cy.loginAsActive();

    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        // Should see Send Message button
        cy.contains('Send Message', { matchCase: false }).should('be.visible');

        cy.contains('Send Message', { matchCase: false }).click();

        // Modal should open
        cy.contains('Request Connection', { matchCase: false }).should('be.visible');
      }
    });
  });

  it('should show admin link only for admin users', () => {
    cy.loginAsAdmin();

    cy.visit('/');
    cy.waitForAppLoad();

    // Admin should see admin link
    cy.contains('Admin').should('be.visible');
  });

  it('should NOT show admin link for regular users', () => {
    cy.loginAsActive();

    cy.visit('/');
    cy.waitForAppLoad();

    // Regular user should NOT see admin link
    cy.get('body').then(($body) => {
      const adminLink = $body.find('a:contains("Admin")');
      if (adminLink.length === 0) {
        cy.log('Admin link correctly hidden for regular users');
      } else {
        cy.get('a:contains("Admin")').should('not.exist');
      }
    });
  });

  it('should NOT show admin link for pending users', () => {
    cy.loginAsPending();

    cy.visit('/');
    cy.waitForAppLoad();

    // Pending user should NOT see admin link
    cy.get('body').then(($body) => {
      const adminLink = $body.find('a:contains("Admin")');
      if (adminLink.length === 0) {
        cy.log('Admin link correctly hidden for pending users');
      } else {
        cy.get('a:contains("Admin")').should('not.exist');
      }
    });
  });

  it('should allow all logged-in users to access profile', () => {
    // Test pending user
    cy.loginAsPending();
    cy.visit('/profile');
    cy.waitForAppLoad();
    cy.url().should('include', '/profile');
    cy.logout();

    // Test active user
    cy.loginAsActive();
    cy.visit('/profile');
    cy.waitForAppLoad();
    cy.url().should('include', '/profile');
    cy.logout();

    // Test admin user
    cy.loginAsAdmin();
    cy.visit('/profile');
    cy.waitForAppLoad();
    cy.url().should('include', '/profile');
  });

  it('should allow pending user to browse experts list', () => {
    cy.loginAsPending();

    cy.visit('/experts');
    cy.waitForAppLoad();
    cy.url().should('include', '/experts');

    // Should be able to see experts list (but not details)
    cy.get('body').then(($body) => {
      if ($body.text().includes('expert') || $body.find('a[href*="/expert/"]').length > 0) {
        cy.log('Pending user can see experts list');
      }
    });
  });

  it('should prevent pending user from sending connection requests', () => {
    cy.loginAsPending();

    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        // Try to navigate to expert detail
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        // Should show pending message instead of Send Message button
        cy.contains('Account Pending Verification', { matchCase: false }).should('be.visible');
        cy.contains('Send Message', { matchCase: false }).should('not.exist');
      }
    });
  });
});

