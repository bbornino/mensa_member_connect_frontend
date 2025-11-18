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

You can configure test credentials, frontend URL, and backend API URL using environment variables:

#### Option 1: Using environment variables (recommended)

Create a `.env` file in the frontend directory or export them in your shell:

```bash
# Frontend URL (default: http://localhost:3000)
CYPRESS_BASE_URL=http://localhost:3000

# Backend API URL (default: http://localhost:8000/api/)
CYPRESS_API_BASE_URL=http://localhost:8000/api/
# OR use VITE_API_BASE_URL (which is already used by the app)
VITE_API_BASE_URL=http://localhost:8000/api/

# Test credentials - Three different user types
# 1. Pending user (status: pending) - restricted access
CYPRESS_PENDING_USERNAME=testuser_pending
CYPRESS_PENDING_PASSWORD=testpassword123

# 2. Active user (status: active) - full access
CYPRESS_ACTIVE_USERNAME=testuser_active
CYPRESS_ACTIVE_PASSWORD=testpassword123

# 3. Admin user (role: admin) - admin access
CYPRESS_ADMIN_USERNAME=admin
CYPRESS_ADMIN_PASSWORD=admin123

# Legacy support (defaults to active user)
CYPRESS_TEST_USERNAME=testuser_active
CYPRESS_TEST_PASSWORD=testpassword123
```

#### Option 2: Directly in cypress.config.ts

You can also modify `cypress.config.ts` directly:

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Change this
    env: {
      apiBaseUrl: 'http://localhost:8000/api/', // Change this
      PENDING_USERNAME: 'testuser_pending',
      PENDING_PASSWORD: 'testpassword123',
      ACTIVE_USERNAME: 'testuser_active',
      ACTIVE_PASSWORD: 'testpassword123',
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'admin123',
    },
  },
});
```

### URL Configuration

- **Frontend URL**: Set via `CYPRESS_BASE_URL` environment variable (default: `http://localhost:3000`)
  - This is the URL where your Vite dev server runs
  - If your frontend runs on a different port, set: `CYPRESS_BASE_URL=http://localhost:5173`

- **Backend API URL**: Set via `CYPRESS_API_BASE_URL` or `VITE_API_BASE_URL` (default: `http://localhost:8000/api/`)
  - This is the URL where your Django backend API runs
  - If your backend runs on a different port, set: `CYPRESS_API_BASE_URL=http://localhost:8001/api/`

**Example for different ports:**

```bash
# Frontend on port 5173, backend on port 8001
export CYPRESS_BASE_URL=http://localhost:5173
export CYPRESS_API_BASE_URL=http://localhost:8001/api/
```

### Test Users

The test suite uses three different test users to test various access levels:

1. **Pending User** (`testuser_pending` / `testpassword123`)
   - Status: `pending`
   - Role: `member`
   - Access: Restricted - cannot view expert detail pages, must wait for approval
   - Use: Testing restrictions for unapproved users

2. **Active User** (`testuser_active` / `testpassword123`)
   - Status: `active`
   - Role: `member`
   - Access: Full access to all member features (browse experts, contact experts, edit profile)
   - Use: Testing normal user workflows (default for most tests)

3. **Admin User** (`admin` / `admin123`)
   - Status: `active`
   - Role: `admin`
   - Access: Full access plus admin panel access
   - Use: Testing admin-only features

**Setting up test users in your backend:**

Make sure these three users exist in your Django backend database:
- `testuser_pending` with status="pending"
- `testuser_active` with status="active"
- `admin` with role="admin" and status="active"

You can create them manually in Django admin or via seed scripts.

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

Logs in as an admin user (role: admin) - has access to admin panel.

```typescript
cy.loginAsAdmin();
```

### `cy.loginAsPending()`

Logs in as a pending user (status: pending) - has restricted access (cannot view expert details).

```typescript
cy.loginAsPending();
```

### `cy.loginAsActive()`

Logs in as an active user (status: active) - has full access to all features.

```typescript
cy.loginAsActive();
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
- `CYPRESS_PENDING_USERNAME` / `CYPRESS_PENDING_PASSWORD`
- `CYPRESS_ACTIVE_USERNAME` / `CYPRESS_ACTIVE_PASSWORD`
- `CYPRESS_ADMIN_USERNAME` / `CYPRESS_ADMIN_PASSWORD`
- `CYPRESS_TEST_USERNAME` / `CYPRESS_TEST_PASSWORD` (legacy, defaults to active user)
- `VITE_API_BASE_URL` / `CYPRESS_API_BASE_URL`

## Troubleshooting

### Tests failing with "Cannot connect to server"

- Ensure both frontend (`npm run dev`) and backend servers are running
- Check that ports match your configuration:
  - Frontend: Check `CYPRESS_BASE_URL` environment variable (default: `http://localhost:3000`)
  - Backend: Check `CYPRESS_API_BASE_URL` or `VITE_API_BASE_URL` (default: `http://localhost:8000/api/`)
- Verify your servers are actually running on those ports

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

