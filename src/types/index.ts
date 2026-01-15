export type TransactionType = 'income' | 'expense';

export interface Account {
  id: string;
  name: string;
  currency: string;
  initialBalance: number;
  isDefault: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isSystem: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string; // ISO date string
  receiptImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackupData {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  version: string;
  exportedAt: string;
}

export interface QueryOptions {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  type?: TransactionType;
  categoryId?: string;
}
