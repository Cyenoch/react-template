---
name: testing
description: Testing guide using Vitest and Bun. Use when writing tests, fixing failing tests, or improving test coverage. Triggers: "vitest", "bun test", "happy-dom", "unit test", "integration test".
---

# Testing Guidelines

## Core Principles

- **Vitest with Bun**: Use Vitest as the test runner, executed via Bun for maximum performance.
- **Happy-DOM**: Use `happy-dom` for DOM-related tests to simulate a browser environment.
- **Co-location**: Prefer co-locating tests with the code they test, or place them in `src/__tests__/` for global setup.

## Running Tests

- **Command**: `bun test`
- **Watch Mode**: `bun test --watch`

## Writing Tests

- **Naming**: Use the `.test.ts` or `.test.tsx` suffix for test files.
- **Structure**: Use `describe`, `it`, and `expect` from `vitest`.
- **Example**: `src/__tests__/setup.test.ts`

## Best Practices

- **Mocking**: Use `vi.mock()` for mocking external dependencies or API calls.
- **Type Safety**: Ensure tests are written in TypeScript and follow the project's type-safety guidelines.
- **Coverage**: Aim for high test coverage of core business logic and critical UI components.
- **Clean Setup**: Use `beforeEach` and `afterEach` to maintain a clean state between tests.
