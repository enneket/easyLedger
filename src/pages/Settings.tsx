import { useRef } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  CreditCard, 
  Tags, 
  Database, 
  Info,
  Check,
  Plus
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function Settings() {
  const { 
    accounts, 
    currentAccount, 
    setCurrentAccount, 
    createAccount, 
    deleteAccount,
    categories,
    exportData,
    importData,
    clearData
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const data = await exportData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `easy-ledger-backup-${format(new Date(), 'yyyyMMdd-HHmmss')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (confirm('导入数据将覆盖现有数据，确定继续吗？')) {
        importData(file);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = async () => {
    if (confirm('确定要清空所有数据吗？此操作无法撤销！')) {
      await clearData();
    }
  };

  const handleCreateAccount = async () => {
    const name = prompt('请输入新账本名称');
    if (name) {
      await createAccount({
        name,
        currency: 'CNY',
        initialBalance: 0,
        isDefault: false,
      });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (accounts.length <= 1) {
      alert('至少保留一个账本');
      return;
    }
    if (confirm('确定删除该账本吗？')) {
      await deleteAccount(id);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <h1 className="text-2xl font-bold text-text-primary">设置</h1>

      {/* Account Settings */}
      <section className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <CreditCard className="text-primary" size={20} />
          <h2 className="font-bold text-text-primary">账本管理</h2>
        </div>
        <div className="p-4 space-y-3">
          {accounts.map(account => (
            <div key={account.id} className="flex items-center justify-between p-3 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentAccount(account)}
                  className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    currentAccount?.id === account.id ? "border-primary bg-primary" : "border-gray-300"
                  )}
                >
                  {currentAccount?.id === account.id && <Check size={12} className="text-white" />}
                </button>
                <div>
                  <p className="font-medium text-text-primary">{account.name}</p>
                  <p className="text-xs text-text-secondary">
                    {account.currency} • 初始余额 ¥{account.initialBalance}
                  </p>
                </div>
              </div>
              {accounts.length > 1 && (
                <button 
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={handleCreateAccount}
            className="w-full py-3 flex items-center justify-center gap-2 text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors"
          >
            <Plus size={20} />
            新建账本
          </button>
        </div>
      </section>

      {/* Categories Preview (Read-only for now) */}
      <section className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Tags className="text-primary" size={20} />
          <h2 className="font-bold text-text-primary">分类概览</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {categories.slice(0, 8).map(category => (
              <div key={category.id} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {category.name[0]}
                </div>
                <span className="text-xs text-text-secondary">{category.name}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 opacity-50">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg">
                ...
              </div>
              <span className="text-xs text-text-secondary">更多</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Database className="text-primary" size={20} />
          <h2 className="font-bold text-text-primary">数据管理</h2>
        </div>
        <div className="p-4 space-y-2">
          <button 
            onClick={handleExport}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
          >
            <span className="flex items-center gap-3">
              <Download size={20} className="text-gray-500" />
              <span className="text-text-primary">导出数据 (JSON)</span>
            </span>
            <span className="text-xs text-text-secondary">备份您的所有数据</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
          >
            <span className="flex items-center gap-3">
              <Upload size={20} className="text-gray-500" />
              <span className="text-text-primary">导入数据</span>
            </span>
            <span className="text-xs text-text-secondary">恢复备份数据</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />

          <div className="h-px bg-gray-100 my-2" />

          <button 
            onClick={handleClear}
            className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors text-left group"
          >
            <span className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-500" />
              <span className="text-red-500 font-medium">清空所有数据</span>
            </span>
            <span className="text-xs text-red-300 group-hover:text-red-400">慎用</span>
          </button>
        </div>
      </section>

      {/* About */}
      <section className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-text-secondary mb-2">
          <Info size={16} />
          <span className="text-sm font-medium">EasyLedger v0.0.1</span>
        </div>
        <p className="text-xs text-gray-400">
          Local-first personal finance tracker
        </p>
      </section>
    </div>
  );
}
