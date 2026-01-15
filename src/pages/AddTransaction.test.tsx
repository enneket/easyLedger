import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddTransaction from './AddTransaction';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from '../hooks/useStore';

// Mock store
vi.mock('../hooks/useStore', () => ({
  useStore: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddTransaction Page', () => {
  const mockCreateTransaction = vi.fn();
  const mockCategories = [
    { id: 'cat1', name: 'Food', type: 'expense', icon: 'utensils' },
    { id: 'cat2', name: 'Salary', type: 'income', icon: 'wallet' },
  ];
  const mockAccount = { id: 'acc1', name: 'Main' };

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      categories: mockCategories,
      createTransaction: mockCreateTransaction,
      currentAccount: mockAccount,
    });
  });

  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <AddTransaction />
      </MemoryRouter>
    );

    expect(screen.getByText('支出')).toBeInTheDocument();
    expect(screen.getByText('收入')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    // Salary is income, default view is expense
    expect(screen.queryByText('Salary')).not.toBeInTheDocument();
  });

  it('switches between income and expense', () => {
    render(
      <MemoryRouter>
        <AddTransaction />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('收入'));
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.queryByText('Food')).not.toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(
      <MemoryRouter>
        <AddTransaction />
      </MemoryRouter>
    );

    // Enter amount
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '100' } });

    // Select category
    fireEvent.click(screen.getByText('Food'));

    // Enter description
    const descInput = screen.getByPlaceholderText('添加备注...');
    fireEvent.change(descInput, { target: { value: 'Lunch' } });

    // Submit
    fireEvent.click(screen.getByText('保存'));

    // Wait for submission (async)
    // In a real test we might need waitFor, but here we just check if function was called
    // Since handleSubmit is async, we need to wait a bit or use waitFor
    // Using simple expect here might fail if hook form is slow, but usually fine in unit tests
    
    // We need to wait for react-hook-form to process
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
      amount: 100,
      categoryId: 'cat1',
      description: 'Lunch',
      type: 'expense',
      accountId: 'acc1'
    }));
  });
});
