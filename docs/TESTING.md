# Testing Strategy

> **Note**: Testing infrastructure is currently being set up.

## Unit Testing (Planned)
- **Framework**: Vitest
- **Library**: React Testing Library
- **Focus**:
  - Utility functions (`src/lib/`)
  - Storage Adapters (`src/db/`)
  - Complex Hooks (`src/hooks/`)

## E2E Testing (Planned)
- **Framework**: Playwright or Cypress
- **Focus**:
  - Critical user flows (Add Transaction, Create Account)
  - Data persistence across reloads

## Manual Testing
- **Web**: Run `npm run dev` and test in Chrome/Edge.
- **Mobile**:
  - Android: `npx cap run android`
  - iOS: `npx cap run ios`
