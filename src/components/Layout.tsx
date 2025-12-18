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
  MapPin
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-emerald-800 text-white flex flex-col">
        <div className="p-6 border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold">لجنة زكاة العامرات</h1>
              <p className="text-xs text-emerald-200">نظام إدارة المساعدات</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      currentView === item.id
                        ? 'bg-emerald-700 text-white'
                        : 'text-emerald-100 hover:bg-emerald-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-emerald-700">
          <div className="mb-3 px-2">
            <p className="text-sm text-emerald-200">مرحباً</p>
            <p className="font-semibold">{profile?.full_name}</p>
            <p className="text-xs text-emerald-300">
              {profile?.role === 'admin' ? 'مدير النظام' : profile?.role === 'manager' ? 'مدير اللجنة' : 'موظف'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 transition"
          >
            <LogOut className="w-5 h-5" />
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