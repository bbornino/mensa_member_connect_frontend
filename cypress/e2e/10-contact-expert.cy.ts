describe('Contact Expert / Connection Request', () => {
  beforeEach(() => {
    // Use active user for contact expert testing (pending users cannot contact)
    cy.loginAsActive();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should navigate to experts page', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();
    cy.url().should('include', '/experts');
  });

  it('should display experts list', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    // Check for experts list or empty state
    cy.get('body').then(($body) => {
      // Either experts are displayed or empty state message
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.log('Experts list is displayed');
      } else if ($body.text().includes('No experts') || $body.text().includes('expert')) {
        cy.log('Empty state or experts section found');
      }
    });
  });

  it('should navigate to expert detail page', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();
        cy.url().should('match', /\/expert\/\d+/);
      } else {
        cy.log('No experts available to test detail page');
      }
    });
  });

  it('should display Send Message button on expert detail page', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        // Should see Send Message button
        cy.contains('Send Message', { matchCase: false }).should('be.visible');
      }
    });
  });

  it('should open connection request modal when clicking Send Message', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        // Click Send Message button
        cy.contains('Send Message', { matchCase: false }).click();

        // Modal should open
        cy.contains('Request Connection', { matchCase: false }).should('be.visible');
      }
    });
  });

  it('should display connection request form fields', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        cy.contains('Send Message', { matchCase: false }).click();

        // Check for form fields
        cy.get('#message').should('be.visible');
        cy.get('#preferred_contact_method').should('be.visible');
        cy.contains('Send Message').should('be.visible');
        cy.contains('Cancel').should('be.visible');
      }
    });
  });

  it('should validate message is required', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        cy.contains('Send Message', { matchCase: false }).click();

        // Try to submit empty form
        cy.get('form').within(() => {
          cy.get('button[type="submit"]').click();
        });

        // Should show validation error
        cy.wait(500);
        cy.get('body').should('contain.text', 'Message is required');
      }
    });
  });

  it('should validate message minimum length', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        cy.contains('Send Message', { matchCase: false }).click();

        // Enter message shorter than 10 characters
        cy.get('#message').type('Short');
        cy.get('form').within(() => {
          cy.get('button[type="submit"]').click();
        });

        // Should show validation error
        cy.wait(500);
        cy.get('body').should('contain.text', 'at least 10 characters');
      }
    });
  });

  it('should allow selecting preferred contact method', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        cy.contains('Send Message', { matchCase: false }).click();

        // Select different contact methods
        cy.get('#preferred_contact_method').select('email');
        cy.get('#preferred_contact_method').should('have.value', 'email');

        cy.get('#preferred_contact_method').select('phone');
        cy.get('#preferred_contact_method').should('have.value', 'phone');

        cy.get('#preferred_contact_method').select('video_call');
        cy.get('#preferred_contact_method').should('have.value', 'video_call');
      }
    });
  });

  it('should successfully send connection request', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        // Get expert ID from URL
        cy.url().then((url) => {
          const expertIdMatch = url.match(/\/expert\/(\d+)/);
          if (expertIdMatch) {
            const expertId = expertIdMatch[1];

            cy.contains('Send Message', { matchCase: false }).click();

            // Intercept connection request API call
            cy.intercept('POST', '**/api/connection_requests/', {
              statusCode: 201,
              body: { id: 1, message: 'Test message', expert_id: parseInt(expertId) },
            }).as('sendConnectionRequest');

            // Fill out form
            cy.get('#message').type('This is a test message to contact the expert.');
            cy.get('#preferred_contact_method').select('email');

            // Submit form
            cy.get('form').within(() => {
              cy.get('button[type="submit"]').click();
            });

            cy.wait('@sendConnectionRequest').then((interception) => {
              expect(interception.request.body).to.include({
                message: 'This is a test message to contact the expert.',
                preferred_contact_method: 'email',
              });
              expect(interception.request.body.expert_id).to.equal(parseInt(expertId));
            });

            // Should show success message
            cy.contains('Connection Request Sent', { matchCase: false }).should('be.visible');
          }
        });
      }
    });
  });

  it('should close modal on Cancel button', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        cy.contains('Send Message', { matchCase: false }).click();

        // Modal should be visible
        cy.contains('Request Connection', { matchCase: false }).should('be.visible');

        // Click Cancel
        cy.contains('Cancel').click();

        // Modal should close
        cy.wait(500);
        cy.contains('Request Connection', { matchCase: false }).should('not.exist');
      }
    });
  });

  it('should close modal on X button', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        cy.contains('Send Message', { matchCase: false }).click();

        // Modal should be visible
        cy.contains('Request Connection', { matchCase: false }).should('be.visible');

        // Click X close button (in modal header)
        cy.get('.modal-header button').click();

        // Modal should close
        cy.wait(500);
        cy.contains('Request Connection', { matchCase: false }).should('not.exist');
      }
    });
  });

  it('should handle connection request API errors', () => {
    cy.visit('/experts');
    cy.waitForAppLoad();

    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/expert/"]').length > 0) {
        cy.get('a[href*="/expert/"]').first().click();
        cy.waitForAppLoad();

        cy.contains('Send Message', { matchCase: false }).click();

        // Intercept with error response
        cy.intercept('POST', '**/api/connection_requests/', {
          statusCode: 400,
          body: { error: 'Failed to send request' },
        }).as('connectionRequestError');

        cy.get('#message').type('This is a test message to contact the expert.');
        cy.get('form').within(() => {
          cy.get('button[type="submit"]').click();
        });

        cy.wait('@connectionRequestError');
        cy.wait(500);

        // Should show error message
        cy.get('body').should('contain.text', 'Failed to send');
      }
    });
  });
});

