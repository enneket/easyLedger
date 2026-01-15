import { create } from 'zustand';
import { Account, Category, Transaction, QueryOptions } from '../types';
import { getAdapter } from '../db';

interface State {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  currentAccount: Account | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  init: () => Promise<void>;
  
  // Account Actions
  fetchAccounts: () => Promise<void>;
  createAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  setCurrentAccount: (account: Account) => void;

  // Transaction Actions
  fetchTransactions: (options?: QueryOptions) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Category Actions
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  accounts: [],
  transactions: [],
  categories: [],
  currentAccount: null,
  isLoading: false,
  error: null,

  init: async () => {
    set({ isLoading: true, error: null });
    try {
      await getAdapter(); // Ensure adapter is initialized
      await get().fetchAccounts();
      await get().fetchCategories();
      
      const accounts = get().accounts;
      if (accounts.length > 0) {
        // Set default account or first account
        const defaultAccount = accounts.find(a => a.isDefault) || accounts[0];
        set({ currentAccount: defaultAccount });
        await get().fetchTransactions({ limit: 50 });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAccounts: async () => {
    try {
      const adapter = await getAdapter();
      const accounts = await adapter.getAccounts();
      set({ accounts });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createAccount: async (accountData) => {
    try {
      const adapter = await getAdapter();
      const newAccount = await adapter.createAccount(accountData);
      set((state) => ({ accounts: [...state.accounts, newAccount] }));
      if (!get().currentAccount) {
        set({ currentAccount: newAccount });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateAccount: async (account) => {
    try {
      const adapter = await getAdapter();
      await adapter.updateAccount(account);
      set((state) => ({
        accounts: state.accounts.map(a => a.id === account.id ? account : a),
        currentAccount: state.currentAccount?.id === account.id ? account : state.currentAccount
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteAccount: async (id) => {
    try {
      const adapter = await getAdapter();
      await adapter.deleteAccount(id);
      set((state) => ({
        accounts: state.accounts.filter(a => a.id !== id),
        currentAccount: state.currentAccount?.id === id ? (state.accounts.find(a => a.id !== id) || null) : state.currentAccount
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setCurrentAccount: (account) => {
    set({ currentAccount: account });
    get().fetchTransactions({ limit: 50 });
  },

  fetchTransactions: async (options) => {
    const currentAccount = get().currentAccount;
    if (!currentAccount) return;

    try {
      const adapter = await getAdapter();
      const transactions = await adapter.getTransactions(currentAccount.id, options);
      set({ transactions });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createTransaction: async (transactionData) => {
    try {
      const adapter = await getAdapter();
      const newTransaction = await adapter.createTransaction(transactionData);
      set((state) => ({ 
        transactions: [newTransaction, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
      }));
      // Refresh account balance if we were tracking it (but balance is calculated from transactions usually)
      // Or we can just re-fetch transactions
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateTransaction: async (transaction) => {
    try {
      const adapter = await getAdapter();
      await adapter.updateTransaction(transaction);
      set((state) => ({
        transactions: state.transactions.map(t => t.id === transaction.id ? transaction : t)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteTransaction: async (id) => {
    try {
      const adapter = await getAdapter();
      await adapter.deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchCategories: async () => {
    try {
      const adapter = await getAdapter();
      const categories = await adapter.getCategories();
      set({ categories });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createCategory: async (categoryData) => {
    try {
      const adapter = await getAdapter();
      const newCategory = await adapter.createCategory(categoryData);
      set((state) => ({ categories: [...state.categories, newCategory] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  exportData: async () => {
    try {
      const adapter = await getAdapter();
      return await adapter.exportData();
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  importData: async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const adapter = await getAdapter();
      await adapter.importData(data);
      await get().init(); // Reload data
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearData: async () => {
    try {
      const adapter = await getAdapter();
      await adapter.clearData();
      await get().init(); // Reload (should be empty/default)
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
