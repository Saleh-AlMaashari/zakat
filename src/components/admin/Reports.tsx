import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart3, Users, Home, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalFamilies: number;
  totalAssistances: number;
  totalDeliveries: number;
  deliveredCount: number;
  inProgressCount: number;
  notDeliveredCount: number;
  totalInventory: number;
}

export function Reports() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFamilies: 0,
    totalAssistances: 0,
    totalDeliveries: 0,
    deliveredCount: 0,
    inProgressCount: 0,
    notDeliveredCount: 0,
    totalInventory: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        usersResult,
        familiesResult,
        assistancesResult,
        deliveriesResult,
        inventoryResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('families').select('id', { count: 'exact', head: true }),
        supabase.from('assistances').select('id', { count: 'exact', head: true }),
        supabase.from('deliveries').select('status'),
        supabase.from('inventory').select('quantity')
      ]);

      const deliveries = deliveriesResult.data || [];
      const deliveredCount = deliveries.filter(d => d.status === 'تم التسليم').length;
      const inProgressCount = deliveries.filter(d => d.status === 'في الطريق').length;
      const notDeliveredCount = deliveries.filter(d => d.status === 'لم يتم').length;

      const totalInventory = (inventoryResult.data || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

      setStats({
        totalUsers: usersResult.count || 0,
        totalFamilies: familiesResult.count || 0,
        totalAssistances: assistancesResult.count || 0,
        totalDeliveries: deliveries.length,
        deliveredCount,
        inProgressCount,
        notDeliveredCount,
        totalInventory
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">التقارير والإحصائيات</h2>
        <button
          onClick={loadStats}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          تحديث
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalUsers}</span>
          </div>
          <h3 className="text-lg font-semibold">المستخدمين</h3>
          <p className="text-sm opacity-80">إجمالي عدد المستخدمين</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Home className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalFamilies}</span>
          </div>
          <h3 className="text-lg font-semibold">الأسر</h3>
          <p className="text-sm opacity-80">إجمالي عدد الأسر</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalAssistances}</span>
          </div>
          <h3 className="text-lg font-semibold">المساعدات</h3>
          <p className="text-sm opacity-80">أنواع المساعدات المتاحة</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalInventory}</span>
          </div>
          <h3 className="text-lg font-semibold">المخزون</h3>
          <p className="text-sm opacity-80">إجمالي الكمية في المخزون</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-600" />
          حالة التسليمات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-700 mb-2">{stats.totalDeliveries}</div>
            <div className="text-sm text-gray-600">إجمالي التسليمات</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-3xl font-bold text-green-700">{stats.deliveredCount}</span>
            </div>
            <div className="text-sm text-green-600">تم التسليم</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-yellow-600 mr-2" />
              <span className="text-3xl font-bold text-yellow-700">{stats.inProgressCount}</span>
            </div>
            <div className="text-sm text-yellow-600">في الطريق</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="w-6 h-6 text-red-600 mr-2" />
              <span className="text-3xl font-bold text-red-700">{stats.notDeliveredCount}</span>
            </div>
            <div className="text-sm text-red-600">لم يتم التسليم</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">نسب الإنجاز</h3>
        {stats.totalDeliveries > 0 && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">تم التسليم</span>
                <span className="text-green-600 font-semibold">
                  {((stats.deliveredCount / stats.totalDeliveries) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.deliveredCount / stats.totalDeliveries) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-600">في الطريق</span>
                <span className="text-yellow-600 font-semibold">
                  {((stats.inProgressCount / stats.totalDeliveries) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.inProgressCount / stats.totalDeliveries) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-600">لم يتم التسليم</span>
                <span className="text-red-600 font-semibold">
                  {((stats.notDeliveredCount / stats.totalDeliveries) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.notDeliveredCount / stats.totalDeliveries) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        {stats.totalDeliveries === 0 && (
          <p className="text-gray-500 text-center py-8">لا توجد تسليمات بعد</p>
        )}
      </div>
    </div>
  );
}
