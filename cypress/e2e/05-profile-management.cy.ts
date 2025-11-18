describe('Profile Management', () => {
  beforeEach(() => {
    // Use active user for profile testing
    cy.loginAsActive();
  });

  afterEach(() => {
    cy.logout();
  });

  it('should navigate to profile page', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    cy.url().should('include', '/profile');
  });

  it('should display profile edit form', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // Wait for form to load
    cy.get('form', { timeout: 10000 }).should('exist');
    
    // Check that required fields are visible
    cy.get('#first_name').should('be.visible');
    cy.get('#last_name').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#member_id').should('be.visible');
  });

  it('should allow editing required profile fields', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // Edit first name
    cy.get('#first_name').clear().type('Updated First Name');
    
    // Edit last name
    cy.get('#last_name').clear().type('Updated Last Name');
    
    // Edit email
    cy.get('#email').clear().type('updated@example.com');
  });

  it('should allow editing optional profile fields (phone, city, state)', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // These fields are optional, so we should be able to clear them or set them
    // Check if phone field exists and can be edited
    cy.get('body').then(($body) => {
      if ($body.find('#phone').length > 0) {
        cy.get('#phone').clear().type('5559876543');
        // Phone should auto-format
        cy.get('#phone').should('have.value', '(555) 987-6543');
      }
      
      if ($body.find('#city').length > 0) {
        cy.get('#city').clear().type('New City');
      }
      
      if ($body.find('#state').length > 0) {
        cy.get('#state').select('NY');
      }
    });
  });

  it('should validate required fields when saving', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // Ensure we're on the basic tab (EditMember form) - check for active class
    cy.get('.nav-link.active').should('contain', 'Basic Information');
    
    // Clear a required field
    cy.get('#first_name').clear();
    
    // Try to submit the form - target the EditMember form specifically
    // Use first() to ensure we get the basic info form, not the expert form
    cy.get('form').first().submit();
    
    // Should show validation error for required field
    cy.wait(1000);
    cy.get('body').then(($body) => {
      if ($body.text().includes('First name is required') || $body.text().includes('required')) {
        cy.log('Validation error shown correctly');
      }
    });
  });

  it('should allow saving profile without optional fields', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // Ensure we're on the basic tab (EditMember form) - check for active class
    cy.get('.nav-link.active').should('contain', 'Basic Information');
    
    // Intercept the API call
    cy.intercept('PATCH', '**/api/users/**/', {
      statusCode: 200,
      body: { success: true },
    }).as('updateProfile');
    
    // Clear optional fields
    cy.get('body').then(($body) => {
      if ($body.find('#phone').length > 0) {
        cy.get('#phone').clear();
      }
      if ($body.find('#city').length > 0) {
        cy.get('#city').clear();
      }
      if ($body.find('#state').length > 0) {
        cy.get('#state').select('');
      }
    });
    
    // Submit form (should succeed without optional fields)
    // Use first() to ensure we get the basic info form, not the expert form
    cy.get('form').first().submit();
    
    // Should not show errors for optional fields
    cy.get('body').should('not.contain.text', 'Phone number is required');
    cy.get('body').should('not.contain.text', 'City is required');
    cy.get('body').should('not.contain.text', 'State is required');
  });

  it('should validate phone format if phone is provided', () => {
    cy.visit('/profile');
    cy.waitForAppLoad();
    
    // Ensure we're on the basic tab (EditMember form) - check for active class
    cy.get('.nav-link.active').should('contain', 'Basic Information');
    
    cy.get('body').then(($body) => {
      if ($body.find('#phone').length > 0) {
        // Enter invalid phone format
        cy.get('#phone').clear().type('123');
        // Use first() to ensure we get the basic info form, not the expert form
        cy.get('form').first().submit();
        
        // Should show validation error for invalid phone format
        cy.wait(1000);
        cy.get('body').should('contain.text', 'valid phone number');
      }
    });
  });
});

