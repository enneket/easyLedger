import { StorageAdapter } from './adapter';
import { Account, Category, Transaction, BackupData, QueryOptions } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  ACCOUNTS: 'easyledger_accounts',
  TRANSACTIONS: 'easyledger_transactions',
  CATEGORIES: 'easyledger_categories',
};

export class WebStorageAdapter implements StorageAdapter {
  async initialize(): Promise<void> {
    // Initialize default data if empty
    const accounts = this.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS);
    if (!accounts || accounts.length === 0) {
      // Create default account
      /*
      const defaultAccount: Account = {
        id: uuidv4(),
        name: 'Default Account',
        currency: 'CNY',
        initialBalance: 0,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.setItem(STORAGE_KEYS.ACCOUNTS, [defaultAccount]);
      */
    }

    const categories = this.getItem<Category[]>(STORAGE_KEYS.CATEGORIES);
    if (!categories || categories.length === 0) {
      const defaultCategories: Category[] = [
        { id: 'food', name: '餐饮', icon: 'utensils', color: '#EF4444', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
        { id: 'transport', name: '交通', icon: 'car', color: '#3B82F6', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
        { id: 'shopping', name: '购物', icon: 'shopping-bag', color: '#F59E0B', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
        { id: 'salary', name: '工资', icon: 'currency-dollar', color: '#10B981', type: 'income', isSystem: true, createdAt: new Date().toISOString() },
      ];
      this.setItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
    }
  }

  private getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const accounts = this.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS) || [];
    const newAccount: Account = {
      ...account,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    accounts.push(newAccount);
    this.setItem(STORAGE_KEYS.ACCOUNTS, accounts);
    return newAccount;
  }

  async getAccounts(): Promise<Account[]> {
    return this.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS) || [];
  }

  async updateAccount(account: Account): Promise<void> {
    const accounts = this.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS) || [];
    const index = accounts.findIndex(a => a.id === account.id);
    if (index !== -1) {
      accounts[index] = { ...account, updatedAt: new Date().toISOString() };
      this.setItem(STORAGE_KEYS.ACCOUNTS, accounts);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    const accounts = this.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS) || [];
    const newAccounts = accounts.filter(a => a.id !== id);
    this.setItem(STORAGE_KEYS.ACCOUNTS, newAccounts);
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const transactions = this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS) || [];
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    this.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTransaction;
  }

  async getTransactions(accountId: string, options?: QueryOptions): Promise<Transaction[]> {
    let transactions = this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS) || [];
    transactions = transactions.filter(t => t.accountId === accountId);

    if (options?.startDate) {
      transactions = transactions.filter(t => t.date >= options.startDate!);
    }
    if (options?.endDate) {
      transactions = transactions.filter(t => t.date <= options.endDate!);
    }
    if (options?.type) {
      transactions = transactions.filter(t => t.type === options.type);
    }
    if (options?.categoryId) {
      transactions = transactions.filter(t => t.categoryId === options.categoryId);
    }

    // Sort by date desc
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (options?.limit) {
      const offset = options.offset || 0;
      transactions = transactions.slice(offset, offset + options.limit);
    }

    return transactions;
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    const transactions = this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS) || [];
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      transactions[index] = { ...transaction, updatedAt: new Date().toISOString() };
      this.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    const transactions = this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS) || [];
    const newTransactions = transactions.filter(t => t.id !== id);
    this.setItem(STORAGE_KEYS.TRANSACTIONS, newTransactions);
  }

  async getCategories(): Promise<Category[]> {
    return this.getItem<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const categories = this.getItem<Category[]>(STORAGE_KEYS.CATEGORIES) || [];
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    this.setItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  }

  async exportData(): Promise<BackupData> {
    return {
      accounts: await this.getAccounts(),
      categories: await this.getCategories(),
      transactions: this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS) || [],
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };
  }

  async importData(data: BackupData): Promise<void> {
    this.setItem(STORAGE_KEYS.ACCOUNTS, data.accounts);
    this.setItem(STORAGE_KEYS.CATEGORIES, data.categories);
    this.setItem(STORAGE_KEYS.TRANSACTIONS, data.transactions);
  }

  async clearData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  }
}
