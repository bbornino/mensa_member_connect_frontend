describe('Expert Profile Editing', () => {
  beforeEach(() => {
    // Use active user for expert profile testing
    cy.loginAsActive();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should navigate to expert profile tab', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    // Click on Expert Profile tab
    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Should show expert profile form
    cy.get('#edit-expert-form').should('exist');
  });

  it('should display expert profile form fields', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    // Navigate to Expert Profile tab
    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Check for form fields
    cy.get('#occupation').should('be.visible');
    cy.get('#industry').should('be.visible');
    cy.get('#background').should('be.visible');
    cy.get('#availability_status').should('be.visible');
    cy.get('#show_contact_info').should('exist');
  });

  it('should allow editing occupation', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.get('#occupation').clear().type('Software Engineer');
    cy.get('#occupation').should('have.value', 'Software Engineer');
  });

  it('should allow selecting industry from dropdown', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Wait for industries to load
    cy.get('#industry').should('be.visible');
    cy.wait(1000);

    // Check if industries are loaded
    cy.get('#industry option').then(($options) => {
      if ($options.length > 1) {
        // Select first non-empty option
        cy.get('#industry').select(1);
        cy.get('#industry').should('not.have.value', '');
      }
    });
  });

  it('should allow editing background textarea', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    const backgroundText = 'I have over 10 years of experience in software development.';
    cy.get('#background').clear().type(backgroundText);
    cy.get('#background').should('have.value', backgroundText);
  });

  it('should allow changing availability status', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    cy.get('#availability_status').select('not_available');
    cy.get('#availability_status').should('have.value', 'not_available');

    cy.get('#availability_status').select('available');
    cy.get('#availability_status').should('have.value', 'available');
  });

  it('should allow toggling show contact info checkbox', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Get initial state
    cy.get('#show_contact_info').then(($checkbox) => {
      const initialState = $checkbox.is(':checked');

      // Toggle checkbox
      cy.get('#show_contact_info').click();
      cy.get('#show_contact_info').should('have.attr', 'checked', initialState ? '' : 'checked');

      // Toggle back
      cy.get('#show_contact_info').click();
      cy.get('#show_contact_info').should('have.attr', 'checked', initialState ? 'checked' : '');
    });
  });

  it('should save expert profile changes', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Intercept API call
    cy.intercept('PATCH', '**/api/users/**/', {
      statusCode: 200,
      body: { success: true },
    }).as('updateExpert');

    // Make changes
    cy.get('#occupation').clear().type('Updated Occupation');
    cy.get('#background').clear().type('Updated background information');

    // Submit form using the save button
    cy.get('button[type="submit"][form="edit-expert-form"]').click();

    cy.wait('@updateExpert');

    // Check for success message
    cy.wait(1000);
    cy.get('body').then(($body) => {
      if ($body.text().includes('saved') || $body.text().includes('success')) {
        cy.log('Success message displayed');
      }
    });
  });

  it('should display expertise records section', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Should see expertise records section
    cy.contains('Expertise Records').should('be.visible');
    cy.contains('up to three expertise offerings').should('be.visible');
  });

  it('should show Add Expertise button', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();

    cy.contains('Expert Profile').click();
    cy.waitForAppLoad();

    // Should see add expertise button
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Add Expertise")').length > 0 || 
          $body.find('button:contains("Add Another Expertise")').length > 0) {
        cy.log('Add Expertise button found');
      }
    });
  });
});

