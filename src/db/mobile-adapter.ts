import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { StorageAdapter } from './adapter';
import { Account, Category, Transaction, BackupData, QueryOptions } from '../types';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'easyledger';

export class MobileStorageAdapter implements StorageAdapter {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize(): Promise<void> {
    try {
      this.db = await this.sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
      await this.db.open();

      const schema = `
        CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          currency TEXT NOT NULL,
          initialBalance REAL NOT NULL,
          isDefault INTEGER NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          icon TEXT NOT NULL,
          color TEXT NOT NULL,
          type TEXT NOT NULL,
          isSystem INTEGER NOT NULL,
          createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          accountId TEXT NOT NULL,
          categoryId TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          receiptImage TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE CASCADE,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        );
      `;

      await this.db.execute(schema);
      await this.initDefaultData();
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      throw error;
    }
  }

  private async initDefaultData() {
    if (!this.db) return;

    // Check categories
    const res = await this.db.query('SELECT count(*) as count FROM categories');
    const count = res.values?.[0]?.count || 0;

    if (count === 0) {
      const defaultCategories: Category[] = [
        { id: 'food', name: '餐饮', icon: 'utensils', color: '#EF4444', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
        { id: 'transport', name: '交通', icon: 'car', color: '#3B82F6', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
        { id: 'shopping', name: '购物', icon: 'shopping-bag', color: '#F59E0B', type: 'expense', isSystem: true, createdAt: new Date().toISOString() },
        { id: 'salary', name: '工资', icon: 'currency-dollar', color: '#10B981', type: 'income', isSystem: true, createdAt: new Date().toISOString() },
      ];

      for (const cat of defaultCategories) {
        await this.createCategory(cat);
      }
    }
  }

  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const newAccount: Account = {
      ...account,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sql = `
      INSERT INTO accounts (id, name, currency, initialBalance, isDefault, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await this.db!.run(sql, [
      newAccount.id,
      newAccount.name,
      newAccount.currency,
      newAccount.initialBalance,
      newAccount.isDefault ? 1 : 0,
      newAccount.createdAt,
      newAccount.updatedAt
    ]);

    return newAccount;
  }

  async getAccounts(): Promise<Account[]> {
    const res = await this.db!.query('SELECT * FROM accounts');
    return (res.values || []).map(row => ({
      ...row,
      isDefault: Boolean(row.isDefault)
    }));
  }

  async updateAccount(account: Account): Promise<void> {
    const sql = `
      UPDATE accounts 
      SET name = ?, currency = ?, initialBalance = ?, isDefault = ?, updatedAt = ?
      WHERE id = ?
    `;
    await this.db!.run(sql, [
      account.name,
      account.currency,
      account.initialBalance,
      account.isDefault ? 1 : 0,
      new Date().toISOString(),
      account.id
    ]);
  }

  async deleteAccount(id: string): Promise<void> {
    await this.db!.run('DELETE FROM accounts WHERE id = ?', [id]);
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sql = `
      INSERT INTO transactions (id, accountId, categoryId, amount, type, description, date, receiptImage, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db!.run(sql, [
      newTransaction.id,
      newTransaction.accountId,
      newTransaction.categoryId,
      newTransaction.amount,
      newTransaction.type,
      newTransaction.description || '',
      newTransaction.date,
      newTransaction.receiptImage || null,
      newTransaction.createdAt,
      newTransaction.updatedAt
    ]);

    return newTransaction;
  }

  async getTransactions(accountId: string, options?: QueryOptions): Promise<Transaction[]> {
    let sql = 'SELECT * FROM transactions WHERE accountId = ?';
    const params: any[] = [accountId];

    if (options?.startDate) {
      sql += ' AND date >= ?';
      params.push(options.startDate);
    }
    if (options?.endDate) {
      sql += ' AND date <= ?';
      params.push(options.endDate);
    }
    if (options?.type) {
      sql += ' AND type = ?';
      params.push(options.type);
    }
    if (options?.categoryId) {
      sql += ' AND categoryId = ?';
      params.push(options.categoryId);
    }

    sql += ' ORDER BY date DESC';

    if (options?.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
      
      if (options.offset) {
        sql += ' OFFSET ?';
        params.push(options.offset);
      }
    }

    const res = await this.db!.query(sql, params);
    return res.values || [];
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    const sql = `
      UPDATE transactions 
      SET accountId = ?, categoryId = ?, amount = ?, type = ?, description = ?, date = ?, receiptImage = ?, updatedAt = ?
      WHERE id = ?
    `;
    
    await this.db!.run(sql, [
      transaction.accountId,
      transaction.categoryId,
      transaction.amount,
      transaction.type,
      transaction.description,
      transaction.date,
      transaction.receiptImage,
      new Date().toISOString(),
      transaction.id
    ]);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.db!.run('DELETE FROM transactions WHERE id = ?', [id]);
  }

  async getCategories(): Promise<Category[]> {
    const res = await this.db!.query('SELECT * FROM categories');
    return (res.values || []).map(row => ({
      ...row,
      isSystem: Boolean(row.isSystem)
    }));
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    // If id is provided in the omit type, it's actually partial, but for default categories we might want to specify ID.
    // However, interface says createCategory(category: Omit<Category, 'id' | 'createdAt'>)
    // For internal use in initDefaultData, we might pass an ID.
    // Let's handle the case where we might want to force an ID (casting) or just generate one.
    
    const id = (category as any).id || uuidv4();
    const newCategory: Category = {
      ...category,
      id,
      createdAt: new Date().toISOString(),
    };

    const sql = `
      INSERT INTO categories (id, name, icon, color, type, isSystem, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db!.run(sql, [
      newCategory.id,
      newCategory.name,
      newCategory.icon,
      newCategory.color,
      newCategory.type,
      newCategory.isSystem ? 1 : 0,
      newCategory.createdAt
    ]);

    return newCategory;
  }

  async exportData(): Promise<BackupData> {
    const accounts = await this.getAccounts();
    const categories = await this.getCategories();
    
    // Get all transactions
    const res = await this.db!.query('SELECT * FROM transactions');
    const transactions = res.values || [];

    return {
      accounts,
      categories,
      transactions,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };
  }

  async importData(data: BackupData): Promise<void> {
    // Clear existing data? Or merge? 
    // Usually import overwrites or appends. For simplicity, let's match WebAdapter which overwrites via setItem, 
    // but SQL is more persistent.
    // The previous implementation of WebAdapter overwrote everything.
    // Let's clear first to be safe and consistent.
    await this.clearData();

    // Import Accounts
    for (const acc of data.accounts) {
       const sql = `INSERT INTO accounts (id, name, currency, initialBalance, isDefault, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
       await this.db!.run(sql, [acc.id, acc.name, acc.currency, acc.initialBalance, acc.isDefault ? 1 : 0, acc.createdAt, acc.updatedAt]);
    }

    // Import Categories
    for (const cat of data.categories) {
       const sql = `INSERT INTO categories (id, name, icon, color, type, isSystem, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
       await this.db!.run(sql, [cat.id, cat.name, cat.icon, cat.color, cat.type, cat.isSystem ? 1 : 0, cat.createdAt]);
    }

    // Import Transactions
    for (const tx of data.transactions) {
       const sql = `INSERT INTO transactions (id, accountId, categoryId, amount, type, description, date, receiptImage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
       await this.db!.run(sql, [tx.id, tx.accountId, tx.categoryId, tx.amount, tx.type, tx.description, tx.date, tx.receiptImage, tx.createdAt, tx.updatedAt]);
    }
  }

  async clearData(): Promise<void> {
    await this.db!.run('DELETE FROM transactions');
    await this.db!.run('DELETE FROM accounts');
    await this.db!.run('DELETE FROM categories');
  }
}
