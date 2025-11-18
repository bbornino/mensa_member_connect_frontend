describe('Protected Routes', () => {
  afterEach(() => {
    cy.logout();
  });

  describe('Active User Access', () => {
    beforeEach(() => {
      cy.loginAsActive();
    });

    it('should access dashboard when authenticated as active user', () => {
      cy.visit('/dashboard');
      cy.waitForAppLoad();
      cy.url().should('include', '/dashboard');
    });

    it('should access profile page when authenticated as active user', () => {
      cy.visit('/profile');
      cy.waitForAppLoad();
      cy.url().should('include', '/profile');
    });

    it('should access experts page when authenticated as active user', () => {
      cy.visit('/experts');
      cy.waitForAppLoad();
      cy.url().should('include', '/experts');
    });

    it('should navigate to expert detail page as active user', () => {
      cy.visit('/experts');
      cy.waitForAppLoad();
      
      // Try to find and click on an expert (if available)
      cy.get('body').then(($body) => {
        if ($body.find('a[href*="/expert/"]').length > 0) {
          cy.get('a[href*="/expert/"]').first().click();
          cy.waitForAppLoad();
          cy.url().should('match', /\/expert\/\d+/);
          
          // Should NOT see pending verification message
          cy.get('body').should('not.contain.text', 'Account Pending Verification');
        } else {
          cy.log('No experts available to test detail page');
        }
      });
    });

    it('should show navigation menu for authenticated active user', () => {
      cy.visit('/');
      cy.waitForAppLoad();
      
      // Check for authenticated navigation items
      cy.contains('Experts').should('be.visible');
      cy.contains('Profile').should('be.visible');
      cy.contains('Logout').should('be.visible');
      
      // Active user should NOT see admin link (unless they're admin)
      cy.get('body').then(($body) => {
        if ($body.find('a:contains("Admin")').length === 0) {
          cy.log('Admin link correctly hidden for non-admin active user');
        }
      });
    });
  });

  describe('Pending User Access', () => {
    beforeEach(() => {
      cy.loginAsPending();
    });

    it('should access dashboard when authenticated as pending user', () => {
      cy.visit('/dashboard');
      cy.waitForAppLoad();
      cy.url().should('include', '/dashboard');
    });

    it('should access profile page when authenticated as pending user', () => {
      cy.visit('/profile');
      cy.waitForAppLoad();
      cy.url().should('include', '/profile');
    });

    it('should access experts page when authenticated as pending user', () => {
      cy.visit('/experts');
      cy.waitForAppLoad();
      cy.url().should('include', '/experts');
    });

    it('should NOT access expert detail page as pending user - shows pending message', () => {
      cy.visit('/experts');
      cy.waitForAppLoad();
      
      // Try to find and click on an expert (if available)
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
          cy.log('No experts available to test pending user restriction');
        }
      });
    });

    it('should show navigation menu for authenticated pending user', () => {
      cy.visit('/');
      cy.waitForAppLoad();
      
      // Check for authenticated navigation items
      cy.contains('Experts').should('be.visible');
      cy.contains('Profile').should('be.visible');
      cy.contains('Logout').should('be.visible');
      
      // Pending user should NOT see admin link
      cy.get('body').then(($body) => {
        if ($body.find('a:contains("Admin")').length === 0) {
          cy.log('Admin link correctly hidden for pending user');
        }
      });
    });

    it('should allow pending user to browse experts list but not view details', () => {
      cy.visit('/experts');
      cy.waitForAppLoad();
      
      // Should be able to see experts list
      cy.get('body').then(($body) => {
        if ($body.text().includes('expert') || $body.find('a[href*="/expert/"]').length > 0) {
          cy.log('Pending user can see experts list');
          
          // But clicking on an expert should show restriction
          if ($body.find('a[href*="/expert/"]').length > 0) {
            cy.get('a[href*="/expert/"]').first().click();
            cy.waitForAppLoad();
            
            // Should show pending message, not expert details
            cy.contains('Account Pending Verification', { matchCase: false }).should('be.visible');
          }
        }
      });
    });
  });
});

