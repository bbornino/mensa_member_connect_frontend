# Cypress End-to-End Testing

This directory contains end-to-end (E2E) tests for the Mensa Member Connect application using Cypress.

## Quick Start

### Prerequisites

1. **Frontend server running**: Make sure your Vite dev server is running on `http://localhost:3000`
   ```bash
   npm run dev
   ```

2. **Backend server running**: Make sure your Django backend is running on `http://localhost:8000`
   ```bash
   # In the backend directory
   python manage.py runserver
   ```

3. **Test data**: Ensure you have test users in your database:
   - Regular user (username: `testuser`, password: `testpassword123`)
   - Admin user (username: `admin`, password: `admin123`)

   You can customize these credentials using environment variables (see Configuration below).

## Running Tests

### Open Cypress Test Runner (Interactive Mode)

```bash
npm run cypress:open
# or
npm run test:e2e:open
```

This opens the Cypress Test Runner GUI where you can:
- See all test files
- Run tests individually or all at once
- Watch tests run in real-time
- Debug failed tests
- Use time-travel debugging

### Run Tests in Headless Mode (CI/CD)

```bash
npm run cypress:run
# or
npm run test:e2e
```

This runs all tests in headless mode (no browser GUI) and is suitable for CI/CD pipelines.

### Run a Specific Test File

```bash
npx cypress run --spec "cypress/e2e/02-authentication.cy.ts"
```

## Test Files Structure

```
cypress/
├── e2e/                          # Test files
│   ├── 01-public-routes.cy.ts   # Public pages (Welcome, About, FAQ, etc.)
│   ├── 02-authentication.cy.ts  # Login, logout, authentication flows
│   ├── 03-protected-routes.cy.ts # Protected pages (Dashboard, Profile, Experts)
│   ├── 04-admin-features.cy.ts  # Admin-only features
│   └── 05-profile-management.cy.ts # Profile editing
├── fixtures/                     # Test data
│   ├── example.json
│   └── users.json
├── support/                      # Custom commands and configuration
│   ├── commands.ts               # Custom Cypress commands
│   └── e2e.ts                    # Support file
└── README.md                     # This file
```

## Configuration

### Environment Variables

You can configure test credentials and API endpoints using environment variables:

```bash
# In cypress.config.ts or via .env file
TEST_USERNAME=testuser
TEST_PASSWORD=testpassword123
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
VITE_API_BASE_URL=http://localhost:8000/api/
```

Or set them in `cypress.config.ts`:

```typescript
env: {
  TEST_USERNAME: 'testuser',
  TEST_PASSWORD: 'testpassword123',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123',
  apiBaseUrl: 'http://localhost:8000/api/',
}
```

### Base URL

The base URL for the frontend is configured in `cypress.config.ts`:

```typescript
baseUrl: 'http://localhost:3000'
```

Change this if your frontend runs on a different port or URL.

## Custom Commands

### `cy.login(username, password)`

Logs in a user with the provided credentials.

```typescript
cy.login('testuser', 'testpassword123');
```

### `cy.logout()`

Logs out the current user.

```typescript
cy.logout();
```

### `cy.loginAsAdmin()`

Logs in as an admin user (uses environment variables or defaults).

```typescript
cy.loginAsAdmin();
```

### `cy.waitForAppLoad()`

Waits for the app to finish loading (waits for loading indicator to disappear).

```typescript
cy.waitForAppLoad();
```

## Writing New Tests

### Basic Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    cy.login('username', 'password');
  });

  afterEach(() => {
    // Cleanup after each test
    cy.logout();
  });

  it('should do something', () => {
    cy.visit('/some-page');
    cy.waitForAppLoad();
    // Your test assertions
  });
});
```

### Best Practices

1. **Use descriptive test names**: Test names should clearly describe what is being tested
2. **Keep tests isolated**: Each test should be able to run independently
3. **Use custom commands**: Leverage the custom commands for common actions
4. **Wait for app loads**: Always use `cy.waitForAppLoad()` after navigation
5. **Clean up**: Clear localStorage and cookies in `beforeEach` or `afterEach` when needed

### Selecting Elements

```typescript
// By ID
cy.get('#username');

// By class
cy.get('.btn-primary');

// By text content
cy.contains('Login');

// By data attribute (preferred)
cy.get('[data-testid="login-button"]');
```

> **Tip**: Consider adding `data-testid` attributes to your components for more stable test selectors.

## Debugging Tests

### Cypress Test Runner

1. Open Cypress: `npm run cypress:open`
2. Click on a test file to run it
3. Use the time-travel feature to see what happened at each step
4. Inspect DOM elements in real-time
5. Use `.debug()` command in your tests:

```typescript
cy.get('#username').debug();
```

### Console Logs

```typescript
cy.log('Debug message');
cy.then(() => {
  console.log('This will appear in browser console');
});
```

### Screenshots and Videos

Cypress automatically takes screenshots on failures and records videos (when enabled). These are saved in:
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run cypress:run
```

### Environment Setup for CI

Make sure to set environment variables in your CI/CD platform:
- `TEST_USERNAME`
- `TEST_PASSWORD`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `VITE_API_BASE_URL`

## Troubleshooting

### Tests failing with "Cannot connect to server"

- Ensure both frontend (`npm run dev`) and backend servers are running
- Check that ports match your configuration (3000 for frontend, 8000 for backend)

### Authentication failures

- Verify test user credentials in your database
- Check that the backend authentication endpoint is working
- Ensure JWT tokens are being stored correctly in localStorage

### Timeout errors

- Increase `defaultCommandTimeout` in `cypress.config.ts` if needed
- Use `cy.wait()` or `cy.waitForAppLoad()` for async operations

### Element not found errors

- Use `cy.wait()` for elements that load dynamically
- Check that selectors match your actual DOM structure
- Consider using `data-testid` attributes for more stable selectors

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)

