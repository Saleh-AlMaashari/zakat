import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, MapPin, BarChart3, FileText, Home, Gift, Package, ClipboardList } from 'lucide-react';
import { UsersManager } from '../admin/UsersManager';
import { RegionsManager } from '../admin/RegionsManager';
import { Reports } from '../admin/Reports';
import { OperationLogs } from '../admin/OperationLogs';
import { FamiliesManager } from '../manager/FamiliesManager';
import { AssistancesManager } from '../manager/AssistancesManager';
import { InventoryManager } from '../manager/InventoryManager';
import { TasksManager } from '../manager/TasksManager';

export function AdminDashboard() {
  const [view, setView] = useState<'overview' | 'users' | 'regions' | 'reports' | 'logs' | 'families' | 'assistances' | 'inventory' | 'tasks'>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFamilies: 0,
    totalAssistances: 0,
    totalRegions: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersResult, familiesResult, assistancesResult, regionsResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('families').select('*', { count: 'exact', head: true }),
        supabase.from('assistances').select('*', { count: 'exact', head: true }),
        supabase.from('regions').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalFamilies: familiesResult.count || 0,
        totalAssistances: assistancesResult.count || 0,
        totalRegions: regionsResult.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (view !== 'overview') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => setView('overview')}
          className="mb-4 sm:mb-6 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
        >
          ← العودة
        </button>
        {view === 'users' && <UsersManager />}
        {view === 'regions' && <RegionsManager />}
        {view === 'reports' && <Reports />}
        {view === 'logs' && <OperationLogs />}
        {view === 'families' && <FamiliesManager />}
        {view === 'assistances' && <AssistancesManager />}
        {view === 'inventory' && <InventoryManager />}
        {view === 'tasks' && <TasksManager />}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">لوحة تحكم المدير</h1>
        <p className="text-sm sm:text-base text-gray-600">مرحباً بك في نظام إدارة مساعدات لجنة زكاة العامرات</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">المستخدمين</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">الأسر</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalFamilies}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">المساعدات</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAssistances}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">المناطق</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalRegions}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <button
          onClick={() => setView('users')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <Users className="w-10 h-10 text-emerald-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة المستخدمين</h3>
          <p className="text-sm text-gray-600">إضافة وتعديل المستخدمين</p>
        </button>

        <button
          onClick={() => setView('regions')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <MapPin className="w-10 h-10 text-orange-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة المناطق</h3>
          <p className="text-sm text-gray-600">تنظيم المناطق الجغرافية</p>
        </button>

        <button
          onClick={() => setView('reports')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <BarChart3 className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">التقارير</h3>
          <p className="text-sm text-gray-600">إحصائيات وتقارير مفصلة</p>
        </button>

        <button
          onClick={() => setView('logs')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <FileText className="w-10 h-10 text-purple-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">سجل العمليات</h3>
          <p className="text-sm text-gray-600">تتبع جميع العمليات</p>
        </button>

        <button
          onClick={() => setView('families')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <Home className="w-10 h-10 text-teal-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة الأسر</h3>
          <p className="text-sm text-gray-600">بيانات الأسر المستفيدة</p>
        </button>

        <button
          onClick={() => setView('assistances')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <Gift className="w-10 h-10 text-pink-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة المساعدات</h3>
          <p className="text-sm text-gray-600">أنواع المساعدات المقدمة</p>
        </button>

        <button
          onClick={() => setView('inventory')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <Package className="w-10 h-10 text-indigo-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة المخزون</h3>
          <p className="text-sm text-gray-600">متابعة المخزون والكميات</p>
        </button>

        <button
          onClick={() => setView('tasks')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-right group"
        >
          <ClipboardList className="w-10 h-10 text-amber-600 mb-4 group-hover:scale-110 transition" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">إدارة المهام</h3>
          <p className="text-sm text-gray-600">توزيع ومتابعة المهام</p>
        </button>
      </div>
    </div>
  );
}