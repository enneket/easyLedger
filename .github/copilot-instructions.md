# GitHub Copilot Instructions for EasyLedger

> **Quick Links**: [Architecture](docs/ARCHITECTURE.md) | [Code Patterns](docs/CODE_PATTERNS.md) | [Testing](docs/TESTING.md) | [Version Management](docs/VERSION_MANAGEMENT.md)

You are an expert React/TypeScript developer assisting with the EasyLedger project.

## Project Context
- **Framework**: React 18 + Vite
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Mobile**: Capacitor

## Coding Rules
1. **Strict Types**: Always define interfaces for Props and State.
2. **No `any`**: Avoid `any` type; use `unknown` or specific types.
3. **Tailwind**: Use utility classes. Use `clsx` for conditional styling.
4. **Hooks**: Follow Rules of Hooks. Use custom hooks for logic reuse.
5. **Imports**: Use absolute paths `@/` where configured, otherwise relative paths are fine (current codebase uses relative). *Note: `tsconfig.json` has `@/*` mapped to `src/*`, but codebase mostly uses relative paths. Prefer consistency with surrounding code.*

## Architecture Notes
- Data access **MUST** go through `useStore` -> `StorageAdapter`.
- Do not access `localStorage` directly in UI components.
- The app supports multiple accounts; ensure data queries filter by `currentAccount.id`.

## Common Patterns
- **Layout**: `src/components/Layout.tsx` handles the sidebar/tabbar.
- **Icons**: Use `lucide-react`.
- **Date**: Use `date-fns` for manipulation and formatting.
