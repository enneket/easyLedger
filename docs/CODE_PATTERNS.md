# Code Patterns & Guidelines

## General Principles
- **Functional Components**: Use React functional components with Hooks.
- **TypeScript**: Use strict typing where possible. Avoid `any`.
- **Composition**: Prefer composition over inheritance.
- **Mobile-First**: Design UI for mobile touch targets first, then scale up.

## Component Structure
```tsx
// Imports
import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import clsx from 'clsx';

// Interface
interface Props {
  active: boolean;
  onSelect: () => void;
}

// Component
export function MyComponent({ active, onSelect }: Props) {
  // Hooks
  const { data } = useStore();
  
  // Handlers
  const handleClick = () => {
    onSelect();
  };

  // Render
  return (
    <div 
      className={clsx("p-4 rounded", active ? "bg-primary" : "bg-gray-100")}
      onClick={handleClick}
    >
      {data}
    </div>
  );
}
```

## State Management (Zustand)
- Store logic resides in `src/hooks/useStore.ts`.
- Actions should handle async operations and error handling.
- Components should select only the data they need (though currently we often export the whole hook).

## Database Adapters
- Always use `getAdapter()` to access storage.
- Do not import `WebStorageAdapter` or `MobileStorageAdapter` directly in components.
- All database operations are asynchronous.

## Styling (Tailwind CSS)
- Use `clsx` or `tailwind-merge` for conditional classes.
- Use configured colors (e.g., `text-primary`, `bg-surface`) for theming support.
- Avoid inline styles.

## Forms
- Use `react-hook-form` for form state management.
- Use `zod` for schema validation.
- Separate schema definition from component if complex.

## Naming Conventions
- **Components**: PascalCase (e.g., `TransactionList.tsx`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
