# AI Agent Guidelines for EasyLedger

> **Quick Links**: [Architecture](docs/ARCHITECTURE.md) | [Code Patterns](docs/CODE_PATTERNS.md) | [Testing](docs/TESTING.md) | [Version Management](docs/VERSION_MANAGEMENT.md)

## Project Overview
**EasyLedger** is a personal finance tracker built with React, Vite, and Capacitor. It aims to be a privacy-focused, offline-first alternative to cloud-based ledger apps.

## Key Directives for Agents
1. **Context Awareness**: Always check `package.json` and `docs/` before suggesting major changes.
2. **Mobile-First**: Ensure UI changes are responsive and touch-friendly.
3. **Persistence**: Remember that data persistence is handled via the `StorageAdapter` pattern. Do not write directly to `localStorage` in components.
4. **State**: Use `useStore` (Zustand) for global state.
5. **Styling**: Use Tailwind CSS classes. Match the existing color scheme (`primary`, `surface`, `background`).

## Common Tasks
- **Add Page**:
  1. Create component in `src/pages/`
  2. Add route in `src/App.tsx`
  3. Add navigation item in `src/components/Layout.tsx` (if applicable)
- **Add Feature**:
  1. Update `types/index.ts` if data model changes
  2. Update `StorageAdapter` interface and implementations
  3. Update `useStore` to expose actions
  4. Build UI components

## Terminal Commands
- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run check`: Run TypeScript check
- `npm run lint`: Run ESLint
