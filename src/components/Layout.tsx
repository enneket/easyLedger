import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, PieChart, Wallet, Settings, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/reports', label: '报表', icon: PieChart },
  { path: '/accounts', label: '账本', icon: Wallet },
  { path: '/settings', label: '设置', icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-background text-text-primary font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <h1 className="text-xl font-bold text-primary">EasyLedger</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-text-secondary hover:bg-gray-50"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link to="/add" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20">
          <PlusCircle size={20} />
          <span>记一笔</span>
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative flex flex-col">
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center justify-center w-full h-full gap-1",
                  isActive ? "text-primary" : "text-text-secondary"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Floating Action Button (FAB) */}
      <Link to="/add" className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center shadow-primary/30 z-50 active:scale-95 transition-transform">
        <PlusCircle size={28} />
      </Link>
    </div>
  );
}
