import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Calendar, Check, ChevronRight, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useStore } from '../hooks/useStore';
import clsx from 'clsx';
import { TransactionType } from '../types';

const transactionSchema = z.object({
  amount: z.string().min(1, '请输入金额').refine((val) => !isNaN(Number(val)) && Number(val) > 0, '金额必须大于0'),
  categoryId: z.string().min(1, '请选择分类'),
  date: z.string(),
  description: z.string().optional(),
  type: z.enum(['income', 'expense']),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function AddTransaction() {
  const navigate = useNavigate();
  const { categories, createTransaction, currentAccount } = useStore();
  const [activeType, setActiveType] = useState<TransactionType>('expense');

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString(),
      amount: '',
      description: '',
    }
  });

  const selectedCategoryId = watch('categoryId');
  const dateValue = watch('date');

  const filteredCategories = categories.filter(c => c.type === activeType);

  const onSubmit = async (data: TransactionFormValues) => {
    if (!currentAccount) return;

    await createTransaction({
      accountId: currentAccount.id,
      categoryId: data.categoryId,
      amount: Number(data.amount),
      type: data.type,
      description: data.description || '',
      date: data.date,
    });

    navigate(-1);
  };

  const handleTypeChange = (type: TransactionType) => {
    setActiveType(type);
    setValue('type', type);
    setValue('categoryId', ''); // Reset category when switching type
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center p-4 bg-primary text-white">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 flex justify-center">
          <div className="flex bg-black/20 rounded-lg p-1">
            <button
              onClick={() => handleTypeChange('expense')}
              className={clsx(
                "px-6 py-1.5 rounded-md text-sm font-medium transition-all",
                activeType === 'expense' ? "bg-white text-primary shadow-sm" : "text-white/80 hover:text-white"
              )}
            >
              支出
            </button>
            <button
              onClick={() => handleTypeChange('income')}
              className={clsx(
                "px-6 py-1.5 rounded-md text-sm font-medium transition-all",
                activeType === 'income' ? "bg-white text-primary shadow-sm" : "text-white/80 hover:text-white"
              )}
            >
              收入
            </button>
          </div>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
        {/* Amount Input */}
        <div className="p-6 bg-primary text-white pb-10">
          <div className="text-white/80 text-sm mb-2">金额</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">¥</span>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              className="bg-transparent text-5xl font-bold placeholder-white/40 focus:outline-none w-full"
              autoFocus
              {...register('amount')}
            />
          </div>
          {errors.amount && <p className="text-red-200 text-sm mt-2">{errors.amount.message}</p>}
        </div>

        <div className="flex-1 bg-surface -mt-4 rounded-t-3xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden z-10">
          
          {/* Category Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4">选择分类</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {filteredCategories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setValue('categoryId', category.id)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all",
                    selectedCategoryId === category.id 
                      ? "bg-primary text-white scale-110 shadow-md" 
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}>
                    {/* In a real app we'd map icon string to actual icon component */}
                    {/* For now using first char or emoji if available, else simple circle */}
                    <span className="text-lg">
                       {/* This is a placeholder. In real app, map category.icon to Lucide icon */}
                       {category.name[0]}
                    </span>
                  </div>
                  <span className={clsx(
                    "text-xs",
                    selectedCategoryId === category.id ? "text-primary font-medium" : "text-text-secondary"
                  )}>
                    {category.name}
                  </span>
                </button>
              ))}
              
              <button type="button" className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <PlusCircle size={20} />
                </div>
                <span className="text-xs text-text-secondary">设置</span>
              </button>
            </div>
            {errors.categoryId && <p className="text-red-500 text-sm mt-4 text-center">{errors.categoryId.message}</p>}
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
              <Calendar size={20} className="text-text-secondary" />
              <input
                type="date"
                className="bg-transparent flex-1 text-sm focus:outline-none text-text-primary"
                {...register('date')}
              />
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
              <span className="text-text-secondary font-medium text-sm w-5 text-center">📝</span>
              <input
                type="text"
                placeholder="添加备注..."
                className="bg-transparent flex-1 text-sm focus:outline-none text-text-primary"
                {...register('description')}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
