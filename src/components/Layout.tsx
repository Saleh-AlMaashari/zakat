import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  LogOut,
  Users,
  Home,
  Package,
  ClipboardList,
  BarChart3,
  Settings,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getMenuItems = () => {
    const items = [];

    if (profile?.role === 'admin') {
      items.push(
        { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
        { id: 'users', label: 'إدارة المستخدمين', icon: Users },
        { id: 'families', label: 'إدارة الأسر', icon: Users },
        { id: 'regions', label: 'المناطق', icon: MapPin },
        { id: 'assistances', label: 'المساعدات', icon: Package },
        { id: 'inventory', label: 'المخزون', icon: Package },
        { id: 'tasks', label: 'المهام', icon: ClipboardList },
        { id: 'reports', label: 'التقارير', icon: BarChart3 },
        { id: 'audit', label: 'سجل العمليات', icon: Settings }
      );
    } else if (profile?.role === 'manager') {
      items.push(
        { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
        { id: 'families', label: 'إدارة الأسر', icon: Users },
        { id: 'regions', label: 'المناطق', icon: MapPin },
        { id: 'assistances', label: 'المساعدات', icon: Package },
        { id: 'inventory', label: 'المخزون', icon: Package },
        { id: 'tasks', label: 'توزيع المهام', icon: ClipboardList },
        { id: 'reports', label: 'التقارير', icon: BarChart3 }
      );
    } else if (profile?.role === 'employee') {
      items.push(
        { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
        { id: 'my-tasks', label: 'مهامي', icon: ClipboardList }
      );
    }

    return items;
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setCurrentView(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-emerald-800 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          <div>
            <h1 className="text-sm font-bold">لجنة زكاة العامرات</h1>
            <p className="text-xs text-emerald-200">نظام إدارة المساعدات</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-emerald-700 rounded-lg transition"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-40
        w-64 bg-emerald-800 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold">لجنة زكاة العامرات</h1>
              <p className="text-xs text-emerald-200">نظام إدارة المساعدات</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      currentView === item.id
                        ? 'bg-emerald-700 text-white'
                        : 'text-emerald-100 hover:bg-emerald-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-emerald-700">
          <div className="mb-3 px-2">
            <p className="text-xs text-emerald-200">مرحباً</p>
            <p className="font-semibold text-sm truncate">{profile?.full_name}</p>
            <p className="text-xs text-emerald-300">
              {profile?.role === 'admin' ? 'مدير النظام' : profile?.role === 'manager' ? 'مدير اللجنة' : 'موظف'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}