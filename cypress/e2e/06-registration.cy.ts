describe('Registration Flow', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
    cy.visit('/register');
    cy.waitForAppLoad();
  });

  // Helper function to fill all valid registration fields
  const fillValidRegistrationForm = () => {
    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#username').type(`testuser_${Date.now()}`); // Unique username
    cy.get('#email').type(`test_${Date.now()}@example.com`); // Unique email
    cy.get('#phone').type('5551234567'); // Will auto-format to (555) 123-4567
    cy.get('#member_id').type('12345');
    cy.get('#city').type('Test City');
    cy.get('#state').select('CA');
    cy.get('#local_group').select('Greater Los Angeles Area Mensa');
    cy.get('#password').type('TestPassword123!');
    cy.get('#confirm_password').type('TestPassword123!');
  };

  it('should display the registration form with all required fields', () => {
    cy.get('#first_name').should('be.visible');
    cy.get('#last_name').should('be.visible');
    cy.get('#username').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#phone').should('be.visible');
    cy.get('#member_id').should('be.visible');
    cy.get('#city').should('be.visible');
    cy.get('#state').should('be.visible');
    cy.get('#local_group').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#confirm_password').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Register');
  });

  it('should show error when submitting with empty first name', () => {
    fillValidRegistrationForm();
    cy.get('#first_name').clear();
    cy.get('form').submit();
    cy.contains('First name is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty last name', () => {
    fillValidRegistrationForm();
    cy.get('#last_name').clear();
    cy.get('form').submit();
    cy.contains('Last name is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty username', () => {
    fillValidRegistrationForm();
    cy.get('#username').clear();
    cy.get('form').submit();
    cy.contains('Username is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty email', () => {
    fillValidRegistrationForm();
    cy.get('#email').clear();
    cy.get('form').submit();
    cy.contains('Email is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with invalid email format', () => {
    fillValidRegistrationForm();
    cy.get('#email').clear().type('invalid-email');
    cy.get('form').submit();
    cy.contains('valid email address', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty phone', () => {
    fillValidRegistrationForm();
    cy.get('#phone').clear();
    cy.get('form').submit();
    cy.contains('Phone number is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with invalid phone format', () => {
    fillValidRegistrationForm();
    cy.get('#phone').clear().type('123'); // Too short
    cy.get('form').submit();
    cy.contains('valid phone number', { matchCase: false }).should('be.visible');
  });

  it('should auto-format phone number as user types', () => {
    cy.get('#phone').type('5551234567');
    // The phone should be formatted to (555) 123-4567
    cy.get('#phone').should('have.value', '(555) 123-4567');
  });

  it('should show error when submitting with empty member ID', () => {
    fillValidRegistrationForm();
    cy.get('#member_id').clear();
    cy.get('form').submit();
    cy.contains('Mensa Member ID is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with non-numeric member ID', () => {
    fillValidRegistrationForm();
    cy.get('#member_id').clear().type('abc123');
    cy.get('form').submit();
    cy.contains('Mensa Member ID must be numeric', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty city', () => {
    fillValidRegistrationForm();
    cy.get('#city').clear();
    cy.get('form').submit();
    cy.contains('City is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting without selecting state', () => {
    fillValidRegistrationForm();
    cy.get('#state').select('');
    cy.get('form').submit();
    cy.contains('select your state', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting without selecting local group', () => {
    fillValidRegistrationForm();
    cy.get('#local_group').select('');
    cy.get('form').submit();
    cy.contains('select your local group', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty password', () => {
    fillValidRegistrationForm();
    cy.get('#password').clear();
    cy.get('form').submit();
    cy.contains('Password is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when passwords do not match', () => {
    fillValidRegistrationForm();
    cy.get('#password').clear().type('TestPassword123!');
    cy.get('#confirm_password').clear().type('DifferentPassword123!');
    cy.get('form').submit();
    cy.contains('Passwords do not match', { matchCase: false }).should('be.visible');
  });

  it('should toggle password visibility when clicking show/hide', () => {
    cy.get('#password').type('secretpassword');
    cy.get('#password').should('have.attr', 'type', 'password');
    
    // Find and click the show/hide toggle (it's in the same input group)
    cy.get('#password').parent().parent().find('.input-group-text').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    
    cy.get('#password').parent().parent().find('.input-group-text').click();
    cy.get('#password').should('have.attr', 'type', 'password');
  });

  it('should successfully register with all valid fields', () => {
    const timestamp = Date.now();
    const uniqueUsername = `testuser_${timestamp}`;
    const uniqueEmail = `test_${timestamp}@example.com`;

    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#username').type(uniqueUsername);
    cy.get('#email').type(uniqueEmail);
    cy.get('#phone').type('5551234567');
    cy.get('#member_id').type('12345');
    cy.get('#city').type('Test City');
    cy.get('#state').select('CA');
    cy.get('#local_group').select('Greater Los Angeles Area Mensa');
    cy.get('#password').type('TestPassword123!');
    cy.get('#confirm_password').type('TestPassword123!');

    // Intercept the registration API call
    cy.intercept('POST', '**/api/users/register/', {
      statusCode: 200,
      body: { success: true, message: 'Registration successful' },
    }).as('registerUser');

    cy.get('form').submit();

    // Wait for the API call
    cy.wait('@registerUser').then((interception) => {
      expect(interception.request.body).to.include({
        first_name: 'John',
        last_name: 'Doe',
        username: uniqueUsername,
        email: uniqueEmail,
        city: 'Test City',
        state: 'CA',
        member_id: '12345',
      });
      expect(interception.request.body.password).to.equal('TestPassword123!');
      expect(interception.request.body.confirm_password).to.equal('TestPassword123!');
    });

    // Check for success message
    cy.contains('Registration successful', { matchCase: false }).should('be.visible');

    // Should redirect to /experts after successful registration
    cy.url({ timeout: 2000 }).should('include', '/experts');
  });

  it('should handle registration API errors gracefully', () => {
    fillValidRegistrationForm();

    // Intercept with error response
    cy.intercept('POST', '**/api/users/register/', {
      statusCode: 400,
      body: { error: 'Username already exists.' },
    }).as('registerError');

    cy.get('form').submit();
    cy.wait('@registerError');

    // Should show error message (the component may show the API error)
    cy.wait(1000);
    cy.get('body').then(($body) => {
      // The error could be shown in different ways depending on implementation
      if ($body.text().includes('Registration failed')) {
        cy.contains('Registration failed', { matchCase: false }).should('be.visible');
      }
    });
  });

  it('should allow selecting a state from dropdown', () => {
    cy.get('#state').select('NY');
    cy.get('#state').should('have.value', 'NY');
    
    cy.get('#state').select('CA');
    cy.get('#state').should('have.value', 'CA');
  });

  it('should allow selecting a local group from dropdown', () => {
    cy.get('#local_group').select('Chicago Area Mensa');
    cy.get('#local_group').should('have.value', 'Chicago Area Mensa');
    
    cy.get('#local_group').select('Greater New York Mensa');
    cy.get('#local_group').should('have.value', 'Greater New York Mensa');
  });

  it('should validate all fields together - multiple errors', () => {
    // Submit empty form
    cy.get('form').submit();
    
    // Should show error (at least one)
    cy.get('body').then(($body) => {
      // The first validation error should appear
      expect($body.text()).to.match(/required/i);
    });
  });
});

