import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../hooks/useStore';
import { getAdapter } from '../db';
import { act } from 'react-dom/test-utils';

// Mock the getAdapter function
vi.mock('../db', () => ({
  getAdapter: vi.fn(),
}));

describe('useStore', () => {
  const mockAdapter = {
    getAccounts: vi.fn(),
    createAccount: vi.fn(),
    getCategories: vi.fn(),
    getTransactions: vi.fn(),
    createTransaction: vi.fn(),
    initialize: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getAdapter as any).mockResolvedValue(mockAdapter);
    
    // Reset store state
    useStore.setState({
      accounts: [],
      transactions: [],
      categories: [],
      currentAccount: null,
      isLoading: false,
      error: null,
    });
  });

  it('should initialize correctly', async () => {
    const mockAccounts = [{ id: '1', name: 'Test', isDefault: true }];
    const mockCategories = [{ id: 'cat1', name: 'Food' }];
    
    mockAdapter.getAccounts.mockResolvedValue(mockAccounts);
    mockAdapter.getCategories.mockResolvedValue(mockCategories);
    mockAdapter.getTransactions.mockResolvedValue([]);

    await useStore.getState().init();

    expect(useStore.getState().accounts).toEqual(mockAccounts);
    expect(useStore.getState().categories).toEqual(mockCategories);
    expect(useStore.getState().currentAccount).toEqual(mockAccounts[0]);
  });

  it('should create account and update state', async () => {
    const newAccount = { id: '2', name: 'New Account', isDefault: false };
    mockAdapter.createAccount.mockResolvedValue(newAccount);

    await useStore.getState().createAccount({ 
      name: 'New Account', 
      currency: 'CNY', 
      initialBalance: 0,
      isDefault: false
    });

    expect(mockAdapter.createAccount).toHaveBeenCalled();
    expect(useStore.getState().accounts).toContainEqual(newAccount);
    expect(useStore.getState().currentAccount).toEqual(newAccount); // Should set as current if it's the first one, or if logic dictates
  });
});
