import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Frontend URL - can be overridden with CYPRESS_BASE_URL environment variable
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    // Support for environment variables
    env: {
      // Backend API URL - can be overridden with VITE_API_BASE_URL or CYPRESS_API_BASE_URL
      apiBaseUrl: process.env.CYPRESS_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
      
      // Test users - three different user types for testing
      // 1. Pending user (status: pending) - restricted access
      PENDING_USERNAME: process.env.CYPRESS_PENDING_USERNAME || 'testuser_pending',
      PENDING_PASSWORD: process.env.CYPRESS_PENDING_PASSWORD || 'testpassword123',
      
      // 2. Active user (status: active) - full access
      ACTIVE_USERNAME: process.env.CYPRESS_ACTIVE_USERNAME || 'testuser_active',
      ACTIVE_PASSWORD: process.env.CYPRESS_ACTIVE_PASSWORD || 'testpassword123',
      
      // 3. Admin user (role: admin) - admin access
      ADMIN_USERNAME: process.env.CYPRESS_ADMIN_USERNAME || 'admin',
      ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD || 'admin123',
      
      // Legacy support (defaults to active user for backward compatibility)
      TEST_USERNAME: process.env.CYPRESS_TEST_USERNAME || process.env.CYPRESS_ACTIVE_USERNAME || 'testuser_active',
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD || process.env.CYPRESS_ACTIVE_PASSWORD || 'testpassword123',
    },
  },
});

