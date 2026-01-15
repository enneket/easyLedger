import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Account } from '../types';
import { 
  CreditCard, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Check, 
  X 
} from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';

const accountSchema = z.object({
  name: z.string().min(1, '请输入账本名称'),
  initialBalance: z.string().refine((val) => !isNaN(Number(val)), '请输入有效金额'),
  currency: z.string().min(1, '请输入货币单位'),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function Accounts() {
  const { accounts, currentAccount, createAccount, updateAccount, deleteAccount, setCurrentAccount } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">账本管理</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span className="text-sm font-bold">新建账本</span>
        </button>
      </div>

      <div className="grid gap-4">
        {isCreating && (
          <AccountForm 
            onSubmit={async (data) => {
              await createAccount({
                ...data,
                initialBalance: Number(data.initialBalance),
                isDefault: false
              });
              setIsCreating(false);
            }}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {accounts.map(account => (
          <div key={account.id}>
            {editingId === account.id ? (
              <AccountForm 
                defaultValues={{
                  name: account.name,
                  initialBalance: account.initialBalance.toString(),
                  currency: account.currency
                }}
                onSubmit={async (data) => {
                  await updateAccount({
                    ...account,
                    ...data,
                    initialBalance: Number(data.initialBalance)
                  });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <AccountCard 
                account={account} 
                isActive={currentAccount?.id === account.id}
                onSelect={() => setCurrentAccount(account)}
                onEdit={() => setEditingId(account.id)}
                onDelete={() => {
                  if (accounts.length <= 1) {
                    alert('至少保留一个账本');
                    return;
                  }
                  if (confirm('确定删除该账本吗？所有相关数据将被永久删除！')) {
                    deleteAccount(account.id);
                  }
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountCard({ 
  account, 
  isActive, 
  onSelect, 
  onEdit, 
  onDelete 
}: { 
  account: Account; 
  isActive: boolean; 
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={clsx(
      "bg-surface rounded-2xl p-4 border transition-all",
      isActive ? "border-primary shadow-md shadow-primary/5" : "border-gray-100 shadow-sm hover:border-gray-200"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
          )}>
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">{account.name}</h3>
            <p className="text-xs text-text-secondary">创建于 {format(new Date(account.createdAt), 'yyyy-MM-dd')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-text-secondary mb-1">初始余额</p>
          <p className="font-mono font-medium text-text-primary">
            {account.currency} {account.initialBalance.toFixed(2)}
          </p>
        </div>
        
        {!isActive ? (
          <button 
            onClick={onSelect}
            className="px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            切换使用
          </button>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
            <Check size={14} />
            当前使用
          </div>
        )}
      </div>
    </div>
  );
}

function AccountForm({ 
  defaultValues, 
  onSubmit, 
  onCancel 
}: { 
  defaultValues?: AccountFormValues;
  onSubmit: (data: AccountFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: defaultValues || {
      name: '',
      initialBalance: '0',
      currency: 'CNY'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl p-4 border border-primary shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">账本名称</label>
          <input
            {...register('name')}
            placeholder="例如：生活账本"
            className="w-full px-3 py-2 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">初始余额</label>
            <input
              {...register('initialBalance')}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.initialBalance && <p className="text-xs text-red-500 mt-1">{errors.initialBalance.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">货币单位</label>
            <input
              {...register('currency')}
              placeholder="CNY"
              className="w-full px-3 py-2 bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.currency && <p className="text-xs text-red-500 mt-1">{errors.currency.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-text-secondary hover:bg-gray-50 rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            保存
          </button>
        </div>
      </div>
    </form>
  );
}
