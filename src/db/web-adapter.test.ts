import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WebStorageAdapter } from './web-adapter';
import { Account, TransactionType } from '../types';

describe('WebStorageAdapter', () => {
  let adapter: WebStorageAdapter;

  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.clear();
    adapter = new WebStorageAdapter();
    await adapter.initialize();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Account Operations', () => {
    it('should create and retrieve accounts', async () => {
      const accountData = {
        name: 'Test Account',
        currency: 'CNY',
        initialBalance: 1000,
        isDefault: false,
      };

      const newAccount = await adapter.createAccount(accountData);
      expect(newAccount.id).toBeDefined();
      expect(newAccount.name).toBe(accountData.name);
      
      const accounts = await adapter.getAccounts();
      expect(accounts).toHaveLength(1);
      expect(accounts[0].id).toBe(newAccount.id);
    });

    it('should update account', async () => {
      const account = await adapter.createAccount({
        name: 'Original Name',
        currency: 'CNY',
        initialBalance: 100,
        isDefault: false,
      });

      const updatedAccount = { ...account, name: 'Updated Name' };
      await adapter.updateAccount(updatedAccount);

      const accounts = await adapter.getAccounts();
      expect(accounts[0].name).toBe('Updated Name');
    });

    it('should delete account', async () => {
      const account = await adapter.createAccount({
        name: 'To Delete',
        currency: 'CNY',
        initialBalance: 0,
        isDefault: false,
      });

      await adapter.deleteAccount(account.id);
      const accounts = await adapter.getAccounts();
      expect(accounts).toHaveLength(0);
    });
  });

  describe('Transaction Operations', () => {
    let accountId: string;

    beforeEach(async () => {
      const account = await adapter.createAccount({
        name: 'Trans Account',
        currency: 'CNY',
        initialBalance: 0,
        isDefault: true,
      });
      accountId = account.id;
    });

    it('should create and filter transactions', async () => {
      const tx1 = await adapter.createTransaction({
        accountId,
        categoryId: 'food',
        amount: 50,
        type: 'expense',
        description: 'Lunch',
        date: '2023-01-01',
      });

      const tx2 = await adapter.createTransaction({
        accountId,
        categoryId: 'salary',
        amount: 5000,
        type: 'income',
        description: 'Salary',
        date: '2023-01-02',
      });

      const allTx = await adapter.getTransactions(accountId);
      expect(allTx).toHaveLength(2);

      const expenseTx = await adapter.getTransactions(accountId, { type: 'expense' });
      expect(expenseTx).toHaveLength(1);
      expect(expenseTx[0].id).toBe(tx1.id);
    });
  });
});
