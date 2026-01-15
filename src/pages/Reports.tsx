import { useState, useEffect, useMemo } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, addMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { TransactionType } from '../types';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title
);

export default function Reports() {
  const { transactions, categories, fetchTransactions, currentAccount } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (currentAccount) {
      const start = startOfMonth(currentDate).toISOString();
      const end = endOfMonth(currentDate).toISOString();
      fetchTransactions({ startDate: start, endDate: end });
    }
  }, [currentDate, currentAccount, fetchTransactions]);

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  // Calculate Summary
  const { income, expense, balance } = useMemo(() => {
    const inc = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const exp = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions]);

  // Prepare Pie Chart Data (Expense by Category)
  const pieChartData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};
    
    expenseTransactions.forEach(t => {
      if (categoryTotals[t.categoryId]) {
        categoryTotals[t.categoryId] += t.amount;
      } else {
        categoryTotals[t.categoryId] = t.amount;
      }
    });

    // Sort categories by amount desc
    const sortedCategoryIds = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

    return {
      labels: sortedCategoryIds.map(id => categories.find(c => c.id === id)?.name || '未知'),
      datasets: [
        {
          data: sortedCategoryIds.map(id => categoryTotals[id]),
          backgroundColor: sortedCategoryIds.map(id => categories.find(c => c.id === id)?.color || '#94a3b8'),
          borderWidth: 0,
        },
      ],
    };
  }, [transactions, categories]);

  // Prepare Bar Chart Data (Daily Trend)
  const barChartData = useMemo(() => {
    const days = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });

    const dailyData = days.map(day => {
      const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));
      const inc = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const exp = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { day, income: inc, expense: exp };
    });

    return {
      labels: dailyData.map(d => format(d.day, 'd')),
      datasets: [
        {
          label: '支出',
          data: dailyData.map(d => d.expense),
          backgroundColor: '#EF4444',
          borderRadius: 4,
        },
        {
          label: '收入',
          data: dailyData.map(d => d.income),
          backgroundColor: '#10B981',
          borderRadius: 4,
        },
      ],
    };
  }, [transactions, currentDate]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">报表分析</h1>
        <div className="flex items-center gap-2 bg-surface p-1 rounded-lg shadow-sm border border-gray-100">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-md">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium w-24 text-center">
            {format(currentDate, 'yyyy年MM月', { locale: zhCN })}
          </span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-md">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-surface rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-text-secondary text-xs mb-1">总支出</p>
          <p className="text-lg font-bold text-red-500">¥{expense.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-surface rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-text-secondary text-xs mb-1">总收入</p>
          <p className="text-lg font-bold text-emerald-500">¥{income.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-surface rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-text-secondary text-xs mb-1">结余</p>
          <p className="text-lg font-bold text-text-primary">¥{balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Structure */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 text-text-primary">支出构成</h2>
          {pieChartData.datasets[0].data.length > 0 ? (
            <div className="h-64 flex justify-center">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-secondary">
              本月暂无支出记录
            </div>
          )}
        </div>

        {/* Daily Trend */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 text-text-primary">收支趋势</h2>
          <div className="h-64">
             <Bar 
              data={barChartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true, grid: { color: '#f3f4f6' } }
                },
                plugins: {
                  legend: { position: 'bottom' }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
