import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from './hooks/useStore';

// Mock child components to isolate App testing
vi.mock('./pages/Dashboard', () => ({ default: () => <div data-testid="dashboard-page">Dashboard</div> }));
vi.mock('./pages/Reports', () => ({ default: () => <div data-testid="reports-page">Reports</div> }));
vi.mock('./pages/Accounts', () => ({ default: () => <div data-testid="accounts-page">Accounts</div> }));
vi.mock('./pages/Settings', () => ({ default: () => <div data-testid="settings-page">Settings</div> }));
vi.mock('./pages/AddTransaction', () => ({ default: () => <div data-testid="add-transaction-page">Add Transaction</div> }));

// Mock store
vi.mock('./hooks/useStore', () => ({
  useStore: vi.fn(),
}));

describe('App Routing', () => {
  beforeEach(() => {
    (useStore as any).mockReturnValue({
      init: vi.fn(),
      isLoading: false,
    });
  });

  it('renders Dashboard on default route', () => {
    render(<App />);
    // App uses BrowserRouter, so we can't easily change initial route without wrapping 
    // inside the component or changing how App is defined.
    // For this test, assuming starting at /
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
  
  // Note: Since App.tsx wraps everything in BrowserRouter, testing other routes 
  // requires either modifying App.tsx to accept a Router or using window.history.pushState 
  // before rendering, or refactoring App.tsx to separate Router definition.
});
