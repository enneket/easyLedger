import { Account, Category, Transaction, BackupData, QueryOptions } from '../types';

export interface StorageAdapter {
  // Account operations
  createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account>;
  getAccounts(): Promise<Account[]>;
  updateAccount(account: Account): Promise<void>;
  deleteAccount(id: string): Promise<void>;

  // Transaction operations
  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction>;
  getTransactions(accountId: string, options?: QueryOptions): Promise<Transaction[]>;
  updateTransaction(transaction: Transaction): Promise<void>;
  deleteTransaction(id: string): Promise<void>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  
  // Data management
  exportData(): Promise<BackupData>;
  importData(data: BackupData): Promise<void>;
  clearData(): Promise<void>;
  
  // Init
  initialize(): Promise<void>;
}
