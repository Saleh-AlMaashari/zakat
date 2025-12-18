import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Search, Edit2, Trash2, Gift } from 'lucide-react';

interface Assistance {
  id: string;
  name: string;
  type: string;
  description: string;
  created_at: string;
}

export function AssistancesManager() {
  const { user } = useAuth();
  const [assistances, setAssistances] = useState<Assistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAssistance, setEditingAssistance] = useState<Assistance | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'غذائية',
    description: ''
  });

  useEffect(() => {
    loadAssistances();
  }, []);

  const loadAssistances = async () => {
    try {
      const { data, error } = await supabase
        .from('assistances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssistances(data || []);
    } catch (error) {
      console.error('Error loading assistances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAssistance) {
        const { error } = await supabase
          .from('assistances')
          .update(formData)
          .eq('id', editingAssistance.id);

        if (error) throw error;

        await supabase.from('operation_logs').insert({
          user_id: user?.id,
          action: 'تعديل مساعدة',
          table_name: 'assistances',
          record_id: editingAssistance.id,
          details: formData
        });
      } else {
        const { data, error } = await supabase
          .from('assistances')
          .insert([{ ...formData, created_by: user?.id }])
          .select()
          .single();

        if (error) throw error;

        await supabase.from('operation_logs').insert({
          user_id: user?.id,
          action: 'إضافة مساعدة',
          table_name: 'assistances',
          record_id: data.id,
          details: formData
        });
      }

      setShowModal(false);
      setEditingAssistance(null);
      setFormData({ name: '', type: 'غذائية', description: '' });
      loadAssistances();
    } catch (error: any) {
      alert('خطأ: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المساعدة؟')) return;

    try {
      const { error } = await supabase
        .from('assistances')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await supabase.from('operation_logs').insert({
        user_id: user?.id,
        action: 'حذف مساعدة',
        table_name: 'assistances',
        record_id: id
      });

      loadAssistances();
    } catch (error: any) {
      alert('خطأ في حذف المساعدة: ' + error.message);
    }
  };

  const handleEdit = (assistance: Assistance) => {
    setEditingAssistance(assistance);
    setFormData({
      name: assistance.name,
      type: assistance.type,
      description: assistance.description
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAssistance(null);
    setFormData({ name: '', type: 'غذائية', description: '' });
    setShowModal(true);
  };

  const filteredAssistances = assistances.filter(assistance =>
    assistance.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistance.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'غذائية': 'bg-green-100 text-green-700',
      'مالية': 'bg-blue-100 text-blue-700',
      'طبية': 'bg-red-100 text-red-700',
      'تعليمية': 'bg-purple-100 text-purple-700',
      'أخرى': 'bg-gray-100 text-gray-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
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
        <h2 className="text-2xl font-bold text-gray-800">إدارة المساعدات</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus className="w-5 h-5" />
          إضافة مساعدة
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="ابحث عن مساعدة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssistances.map((assistance) => (
          <div key={assistance.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-800">{assistance.name}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(assistance)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(assistance.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getTypeColor(assistance.type)}`}>
              {assistance.type}
            </span>
            <p className="text-gray-600 text-sm">{assistance.description || 'لا يوجد وصف'}</p>
          </div>
        ))}
      </div>

      {filteredAssistances.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد مساعدات</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingAssistance ? 'تعديل مساعدة' : 'إضافة مساعدة جديدة'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المساعدة</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="غذائية">غذائية</option>
                  <option value="مالية">مالية</option>
                  <option value="طبية">طبية</option>
                  <option value="تعليمية">تعليمية</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  {editingAssistance ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}