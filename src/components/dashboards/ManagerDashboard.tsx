import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Package, ClipboardList, TrendingUp, Home, Gift } from 'lucide-react';
import { FamiliesManager } from '../manager/FamiliesManager';
import { AssistancesManager } from '../manager/AssistancesManager';
import { InventoryManager } from '../manager/InventoryManager';
import { TasksManager } from '../manager/TasksManager';

export function ManagerDashboard() {
  const [view, setView] = useState<'overview' | 'families' | 'assistances' | 'inventory' | 'tasks'>('overview');
  const [stats, setStats] = useState({
    totalFamilies: 0,
    activeFamilies: 0,
    totalAssistances: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [familiesResult, assistancesResult, tasksResult] = await Promise.all([
        supabase.from('families').select('*', { count: 'exact', head: true }),
        supabase.from('assistances').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('status')
      ]);

      const pendingTasks = tasksResult.data?.filter(t => t.status === 'pending').length || 0;
      const completedTasks = tasksResult.data?.filter(t => t.status === 'completed').length || 0;

      setStats({
        totalFamilies: familiesResult.count || 0,
        activeFamilies: familiesResult.count || 0,
        totalAssistances: assistancesResult.count || 0,
        pendingTasks,
        completedTasks,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (view !== 'overview') {
    return (
      <div className="p-8">
        <button
          onClick={() => setView('overview')}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ← العودة
        </button>
        {view === 'families' && <FamiliesManager />}
        {view === 'assistances' && <AssistancesManager />}
        {view === 'inventory' && <InventoryManager />}
        {view === 'tasks' && <TasksManager />}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة تحكم المدير</h1>
        <p className="text-gray-600">مرحباً بك في نظام إدارة مساعدات لجنة زكاة العامرات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الأسر</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalFamilies}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">المساعدات المقدمة</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAssistances}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">المهام المعلقة</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingTasks}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <ClipboardList className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">المهام المكتملة</p>
              <p className="text-3xl font-bold text-gray-800">{stats.completedTasks}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setView('families')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition text-right group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">إدارة الأسر</h3>
            <Users className="w-10 h-10 text-emerald-600 group-hover:scale-110 transition" />
          </div>
          <p className="text-gray-600 mb-4">
            إضافة وتعديل وإدارة بيانات الأسر المستفيدة
          </p>
          <div className="flex items-center text-emerald-600 font-semibold">
            <span className="ml-2">عرض التفاصيل</span>
            <span>←</span>
          </div>
        </button>

        <button
          onClick={() => setView('assistances')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition text-right group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">إدارة المساعدات</h3>
            <Package className="w-10 h-10 text-blue-600 group-hover:scale-110 transition" />
          </div>
          <p className="text-gray-600 mb-4">
            تسجيل ومتابعة المساعدات المقدمة للأسر
          </p>
          <div className="flex items-center text-blue-600 font-semibold">
            <span className="ml-2">عرض التفاصيل</span>
            <span>←</span>
          </div>
        </button>

        <button
          onClick={() => setView('inventory')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition text-right group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">إدارة المخزون</h3>
            <Package className="w-10 h-10 text-purple-600 group-hover:scale-110 transition" />
          </div>
          <p className="text-gray-600 mb-4">
            متابعة المنتجات والكميات المتوفرة والمصروفة
          </p>
          <div className="flex items-center text-purple-600 font-semibold">
            <span className="ml-2">عرض التفاصيل</span>
            <span>←</span>
          </div>
        </button>

        <button
          onClick={() => setView('tasks')}
          className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition text-right group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">توزيع المهام</h3>
            <ClipboardList className="w-10 h-10 text-amber-600 group-hover:scale-110 transition" />
          </div>
          <p className="text-gray-600 mb-4">
            توزيع المهام على الموظفين ومتابعة الإنجاز
          </p>
          <div className="flex items-center text-amber-600 font-semibold">
            <span className="ml-2">عرض التفاصيل</span>
            <span>←</span>
          </div>
        </button>
      </div>
    </div>
  );
}