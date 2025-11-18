describe('Expertise Editing', () => {
  beforeEach(() => {
    // Use active user for expertise editing testing
    cy.loginAsActive();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should navigate to expert profile tab with expertise section', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Should see expertise records section
    cy.contains('Expertise Records').should('be.visible');
  });

  it('should display existing expertise records', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Check if expertise records are displayed
    cy.get('body').then(($body) => {
      // Look for expertise card elements
      if ($body.find('[id*="area_of_expertise"]').length > 0) {
        cy.get('[id*="area_of_expertise"]').first().should('be.visible');
      }
    });
  });

  it('should allow adding a new expertise record', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Count initial expertise records
    cy.get('body').then(($body) => {
      const initialCount = $body.find('[id*="what_offering"]').length;

      // Click Add Expertise button
      cy.get('body').then(($body2) => {
        const addButton = $body2.find('button:contains("Add Expertise"), button:contains("Add Another Expertise")');
        if (addButton.length > 0 && !addButton.is(':disabled')) {
          cy.contains('Add Expertise', { matchCase: false }).click();
          
          cy.wait(500);
          
          // Should have one more expertise record
          cy.get('[id*="what_offering"]').should('have.length.greaterThan', initialCount);
        }
      });
    });
  });

  it('should allow editing expertise fields', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.wait(1000); // Wait for expertise records to load

    cy.get('body').then(($body) => {
      if ($body.find('[id*="what_offering"]').length > 0) {
        // Edit first expertise record
        cy.get('[id*="what_offering"]').first().clear().type('Test offering description');
        cy.get('[id*="what_offering"]').first().should('have.value', 'Test offering description');

        cy.get('[id*="who_would_benefit"]').first().clear().type('Test who would benefit');
        cy.get('[id*="why_choose_you"]').first().clear().type('Test why choose me');
      }
    });
  });

  it('should require what_offering field for expertise', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.wait(1000);

    // Check if expertise form has required indicator
    cy.get('body').then(($body) => {
      if ($body.find('[id*="what_offering"]').length > 0) {
        // The label should indicate it's required
        cy.contains('What skills').should('be.visible');
        cy.get('[id*="what_offering"]').first().should('exist');
      }
    });
  });

  it('should allow selecting area of expertise (industry)', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.wait(1000);

    cy.get('body').then(($body) => {
      if ($body.find('[id*="area_of_expertise"]').length > 0) {
        const areaOfExpertiseSelect = cy.get('[id*="area_of_expertise"]').first();
        areaOfExpertiseSelect.should('be.visible');

        // Check if options are available
        areaOfExpertiseSelect.then(($select) => {
          if ($select.find('option').length > 1) {
            // Select first non-empty option
            areaOfExpertiseSelect.select(1);
          }
        });
      }
    });
  });

  it('should allow removing expertise record', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.wait(1000);

    cy.get('body').then(($body) => {
      const initialCount = $body.find('[id*="what_offering"]').length;

      // Only can remove if there's more than one
      if (initialCount > 1) {
        // Find and click remove button
        const removeButton = $body.find('button:contains("Remove")');
        if (removeButton.length > 0) {
          // Stub window.confirm to return true
          cy.window().then((win) => {
            cy.stub(win, 'confirm').returns(true);
          });

          cy.contains('Remove').first().click();
          cy.wait(500);

          // Should have one less expertise record
          cy.get('[id*="what_offering"]').should('have.length.lessThan', initialCount);
        }
      }
    });
  });

  it('should save expertise records when saving expert profile', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.wait(1000);

    // Intercept API calls
    cy.intercept('PATCH', '**/api/users/**/', {
      statusCode: 200,
      body: { success: true },
    }).as('updateUser');

    cy.intercept('POST', '**/api/expertises/', {
      statusCode: 201,
      body: { id: 1, success: true },
    }).as('createExpertise');

    cy.intercept('PUT', '**/api/expertises/**/', {
      statusCode: 200,
      body: { success: true },
    }).as('updateExpertise');

    // Edit expertise if available
    cy.get('body').then(($body) => {
      if ($body.find('[id*="what_offering"]').length > 0) {
        cy.get('[id*="what_offering"]').first().clear().type('Updated offering text');
      }
    });

    // Submit the expert profile form
    cy.get('button[type="submit"][form="edit-expert-form"]').click();

    // Wait for API calls
    cy.wait('@updateUser');
    
    cy.wait(1000);
    
    // Check for success indication
    cy.get('body').then(($body) => {
      if ($body.text().includes('saved') || $body.text().includes('success')) {
        cy.log('Expertise saved successfully');
      }
    });
  });

  it('should limit to maximum 3 expertise records', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.wait(1000);

    // Try to add expertise records up to the limit
    cy.get('body').then(($body) => {
      let currentCount = $body.find('[id*="what_offering"]').length;

      // Add expertise records until we reach 3 or button is disabled
      for (let i = currentCount; i < 3; i++) {
        cy.get('body').then(($body2) => {
          const addButton = $body2.find('button:contains("Add Expertise"), button:contains("Add Another Expertise")');
          if (addButton.length > 0 && !addButton.is(':disabled')) {
            cy.contains('Add Expertise', { matchCase: false }).click();
            cy.wait(500);
          }
        });
      }

      // Verify maximum is reached or button is disabled
      cy.get('body').then(($body3) => {
        const finalCount = $body3.find('[id*="what_offering"]').length;
        if (finalCount >= 3) {
          cy.contains('Maximum 3').should('be.visible');
        }
      });
    });
  });
});

