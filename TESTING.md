# Testing in 10x-project

This document describes the testing setup and best practices for the 10x-project.

## Overview

We use two main types of tests:

1. **Unit Tests** - Using Vitest for testing individual components and functions
2. **End-to-End Tests** - Using Playwright for testing the application's functionality from a user's perspective

## Unit Testing with Vitest

### Running Unit Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode during development
npm run test:watch

# Open the UI for browsing tests
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Key Files and Directories

- `/src/tests/unit/` - Contains all unit tests
- `/src/tests/setup/vitest.setup.ts` - Global setup for Vitest tests
- `/src/tests/utils/test-utils.ts` - Helper functions for testing
- `/vitest.config.ts` - Vitest configuration

### Best Practices

As outlined in the project guidelines:

- Leverage the `vi` object for test doubles
- Use `vi.fn()` for function mocks
- Use `vi.spyOn()` to monitor existing functions
- Place mock factory functions at the top level of your test file
- Return typed mock implementations
- Use `mockImplementation()` or `mockReturnValue()` for dynamic control
- Create reusable test utilities in `/src/tests/utils/`
- Follow the Arrange-Act-Assert pattern in tests
- Group related tests with descriptive `describe` blocks
- Use explicit assertion messages

## End-to-End Testing with Playwright

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Open Playwright UI for running and debugging tests
npm run test:e2e:ui
```

### Key Files and Directories

- `/src/tests/e2e/` - Contains all E2E tests
- `/src/tests/e2e/page-objects/` - Contains page object models
- `/playwright.config.ts` - Playwright configuration

### Best Practices

As outlined in the project guidelines:

- Use the Page Object Model for maintainable tests
- Use locators for resilient element selection
- Implement visual comparison with `expect(page).toHaveScreenshot()`
- Leverage trace viewer for debugging test failures
- Implement test hooks for setup and teardown
- Use expect assertions with specific matchers

## Writing Good Tests

1. **Make tests independent** - Each test should run in isolation
2. **Use meaningful names** - Test names should describe what they're testing
3. **Test behavior, not implementation** - Focus on what the code does, not how it does it
4. **Keep tests simple** - Each test should verify one specific thing
5. **Use test-driven development** - Write tests before implementation when possible
6. **Maintain your tests** - Update tests when requirements change

## Testing React Components

- Test component rendering
- Test user interactions
- Test state changes
- Test prop changes
- Test error states
- Test conditional rendering

## Testing API and Services

- Test happy paths
- Test error handling
- Mock external dependencies
- Test edge cases
