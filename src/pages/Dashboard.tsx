import { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function Dashboard() {
  const { 
    currentAccount, 
    transactions, 
    isLoading, 
    init,
    fetchTransactions 
  } = useStore();

  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {currentAccount?.name || '我的账本'}
          </h1>
          <p className="text-text-secondary text-sm">
            {format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
          </p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-surface rounded-2xl shadow-sm border border-gray-100">
          <p className="text-text-secondary text-sm mb-1">本月支出</p>
          <p className="text-2xl font-bold text-red-500">¥{expense.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-surface rounded-2xl shadow-sm border border-gray-100">
          <p className="text-text-secondary text-sm mb-1">本月收入</p>
          <p className="text-2xl font-bold text-emerald-500">¥{income.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-surface rounded-2xl shadow-sm border border-gray-100">
          <p className="text-text-secondary text-sm mb-1">结余</p>
          <p className="text-2xl font-bold text-text-primary">¥{(income - expense).toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-text-primary">最近记录</h2>
          <button className="text-primary text-sm font-medium">查看全部</button>
        </div>
        
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              暂无记录，快去记一笔吧
            </div>
          ) : (
            transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {/* Icon placeholder */}
                    <span className="text-xs">¥</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{t.description || '无备注'}</p>
                    <p className="text-xs text-text-secondary">
                      {format(new Date(t.date), 'MM-dd HH:mm')}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === 'expense' ? 'text-text-primary' : 'text-emerald-500'}`}>
                  {t.type === 'expense' ? '-' : '+'}¥{t.amount.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
