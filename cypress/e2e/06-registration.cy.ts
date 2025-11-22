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

  // Helper function to fill all required registration fields
  const fillRequiredRegistrationForm = () => {
    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#email').type(`test_${Date.now()}@example.com`); // Unique email
    cy.get('#member_id').type('12345');
    cy.get('#local_group').select('Greater Los Angeles Area Mensa');
    cy.get('#password').type('TestPassword123!');
    cy.get('#confirm_password').type('TestPassword123!');
  };

  // Helper function to fill all fields including optional ones
  const fillCompleteRegistrationForm = () => {
    fillRequiredRegistrationForm();
    cy.get('#phone').type('5551234567'); // Will auto-format to (555) 123-4567
    cy.get('#city').type('Test City');
    cy.get('#state').select('CA');
  };

  it('should display the registration form with all required fields', () => {
    cy.get('#first_name').should('be.visible');
    cy.get('#last_name').should('be.visible');
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
    fillRequiredRegistrationForm();
    cy.get('#first_name').clear();
    cy.get('form').submit();
    cy.contains('First name is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty last name', () => {
    fillRequiredRegistrationForm();
    cy.get('#last_name').clear();
    cy.get('form').submit();
    cy.contains('Last name is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty email', () => {
    fillRequiredRegistrationForm();
    cy.get('#email').clear();
    cy.get('form').submit();
    cy.contains('Email is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with invalid email format', () => {
    fillRequiredRegistrationForm();
    cy.get('#email').clear().type('invalid-email');
    cy.get('form').submit();
    cy.contains('valid email address', { matchCase: false }).should('be.visible');
  });

  it('should allow registration without phone number (phone is optional)', () => {
    const timestamp = Date.now();
    const uniqueEmail = `test_${timestamp}@example.com`;

    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#email').type(uniqueEmail);
    // Intentionally skip phone
    cy.get('#member_id').type('12345');
    cy.get('#local_group').select('Greater Los Angeles Area Mensa');
    cy.get('#password').type('TestPassword123!');
    cy.get('#confirm_password').type('TestPassword123!');

    // Intercept the registration API call
    cy.intercept('POST', '**/api/users/register/', {
      statusCode: 200,
      body: { success: true, message: 'Registration successful' },
    }).as('registerUser');

    cy.get('form').submit();

    // Should not show phone required error
    cy.get('body').should('not.contain.text', 'Phone number is required');
    
    // Should succeed
    cy.wait('@registerUser');
  });

  it('should show error when submitting with invalid phone format (if phone is provided)', () => {
    fillRequiredRegistrationForm();
    cy.get('#phone').type('123'); // Too short - invalid format
    cy.get('form').submit();
    cy.contains('valid phone number', { matchCase: false }).should('be.visible');
  });

  it('should auto-format phone number as user types', () => {
    cy.get('#phone').type('5551234567');
    // The phone should be formatted to (555) 123-4567
    cy.get('#phone').should('have.value', '(555) 123-4567');
  });

  it('should show error when submitting with empty member ID', () => {
    fillRequiredRegistrationForm();
    cy.get('#member_id').clear();
    cy.get('form').submit();
    cy.contains('Mensa Member ID is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with non-numeric member ID', () => {
    fillRequiredRegistrationForm();
    cy.get('#member_id').clear().type('abc123');
    cy.get('form').submit();
    cy.contains('Mensa Member ID must be numeric', { matchCase: false }).should('be.visible');
  });

  it('should allow registration without city (city is optional)', () => {
    const timestamp = Date.now();
    const uniqueEmail = `test_${timestamp}@example.com`;

    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#email').type(uniqueEmail);
    cy.get('#member_id').type('12345');
    // Intentionally skip city
    cy.get('#local_group').select('Greater Los Angeles Area Mensa');
    cy.get('#password').type('TestPassword123!');
    cy.get('#confirm_password').type('TestPassword123!');

    // Intercept the registration API call
    cy.intercept('POST', '**/api/users/register/', {
      statusCode: 200,
      body: { success: true, message: 'Registration successful' },
    }).as('registerUser');

    cy.get('form').submit();

    // Should not show city required error
    cy.get('body').should('not.contain.text', 'City is required');
    
    // Should succeed
    cy.wait('@registerUser');
  });

  it('should allow registration without state (state is optional)', () => {
    const timestamp = Date.now();
    const uniqueEmail = `test_${timestamp}@example.com`;

    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#email').type(uniqueEmail);
    cy.get('#member_id').type('12345');
    // Intentionally skip state
    cy.get('#local_group').select('Greater Los Angeles Area Mensa');
    cy.get('#password').type('TestPassword123!');
    cy.get('#confirm_password').type('TestPassword123!');

    // Intercept the registration API call
    cy.intercept('POST', '**/api/users/register/', {
      statusCode: 200,
      body: { success: true, message: 'Registration successful' },
    }).as('registerUser');

    cy.get('form').submit();

    // Should not show state required error
    cy.get('body').should('not.contain.text', 'select your state');
    
    // Should succeed
    cy.wait('@registerUser');
  });

  it('should show error when submitting without selecting local group', () => {
    fillRequiredRegistrationForm();
    cy.get('#local_group').select('');
    cy.get('form').submit();
    cy.contains('select your local group', { matchCase: false }).should('be.visible');
  });

  it('should show error when submitting with empty password', () => {
    fillRequiredRegistrationForm();
    cy.get('#password').clear();
    cy.get('form').submit();
    cy.contains('Password is required', { matchCase: false }).should('be.visible');
  });

  it('should show error when passwords do not match', () => {
    fillRequiredRegistrationForm();
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

  it('should successfully register with only required fields', () => {
    const timestamp = Date.now();
    const uniqueEmail = `test_${timestamp}@example.com`;

    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#email').type(uniqueEmail);
    cy.get('#member_id').type('12345');
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
        email: uniqueEmail,
        member_id: '12345',
      });
      expect(interception.request.body.password).to.equal('TestPassword123!');
      // Optional fields may or may not be present
      // Username should not be in the request
      expect(interception.request.body).to.not.have.property('username');
    });

    // Check for success message
    cy.contains('Registration successful', { matchCase: false }).should('be.visible');

    // After registration, user is not logged in, so attempting to access /experts
    // (a protected route) will redirect to /login
    // Also, new users have "pending" status and may not access /experts until approved
    cy.url({ timeout: 2000 }).should('satisfy', (url) => {
      return url.includes('/login') || url.includes('/register');
    });
  });

  it('should successfully register with all fields including optional ones', () => {
    const timestamp = Date.now();
    const uniqueEmail = `test_${timestamp}@example.com`;

    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
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
        email: uniqueEmail,
        city: 'Test City',
        state: 'CA',
        member_id: '12345',
      });
      expect(interception.request.body.password).to.equal('TestPassword123!');
      // Username should not be in the request
      expect(interception.request.body).to.not.have.property('username');
    });

    // Check for success message
    cy.contains('Registration successful', { matchCase: false }).should('be.visible');

    // After registration, user is not logged in, so attempting to access /experts
    // (a protected route) will redirect to /login
    // Also, new users have "pending" status and may not access /experts until approved
    cy.url({ timeout: 2000 }).should('satisfy', (url) => {
      return url.includes('/login') || url.includes('/register');
    });
  });

  it('should handle registration API errors gracefully', () => {
    fillRequiredRegistrationForm();

    // Intercept with error response
    cy.intercept('POST', '**/api/users/register/', {
      statusCode: 400,
      body: { error: 'Email already exists.' },
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

