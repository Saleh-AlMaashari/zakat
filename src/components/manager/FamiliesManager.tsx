import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Search, Edit2, Trash2, MapPin, ExternalLink } from 'lucide-react';

interface Family {
  id: string;
  family_name: string;
  head_of_family: string;
  phone: string;
  region_id: string;
  address: string;
  location_link: string;
  family_size: number;
  notes: string;
  created_at: string;
  regions?: { name: string };
}

interface Region {
  id: string;
  name: string;
}

export function FamiliesManager() {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [formData, setFormData] = useState({
    family_name: '',
    head_of_family: '',
    phone: '',
    region_id: '',
    address: '',
    location_link: '',
    family_size: 1,
    notes: ''
  });

  useEffect(() => {
    loadFamilies();
    loadRegions();
  }, []);

  const loadFamilies = async () => {
    try {
      const { data, error } = await supabase
        .from('families')
        .select(`
          *,
          regions (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilies(data || []);
    } catch (error) {
      console.error('Error loading families:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (error) {
      console.error('Error loading regions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFamily) {
        const { error } = await supabase
          .from('families')
          .update(formData)
          .eq('id', editingFamily.id);

        if (error) throw error;

        await supabase.from('operation_logs').insert({
          user_id: user?.id,
          action: 'تعديل أسرة',
          table_name: 'families',
          record_id: editingFamily.id,
          details: formData
        });
      } else {
        const { data, error } = await supabase
          .from('families')
          .insert([{ ...formData, created_by: user?.id }])
          .select()
          .single();

        if (error) throw error;

        await supabase.from('operation_logs').insert({
          user_id: user?.id,
          action: 'إضافة أسرة',
          table_name: 'families',
          record_id: data.id,
          details: formData
        });
      }

      setShowModal(false);
      setEditingFamily(null);
      setFormData({
        family_name: '',
        head_of_family: '',
        phone: '',
        region_id: '',
        address: '',
        location_link: '',
        family_size: 1,
        notes: ''
      });
      loadFamilies();
    } catch (error: any) {
      alert('خطأ: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الأسرة؟')) return;

    try {
      const { error } = await supabase
        .from('families')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await supabase.from('operation_logs').insert({
        user_id: user?.id,
        action: 'حذف أسرة',
        table_name: 'families',
        record_id: id
      });

      loadFamilies();
    } catch (error: any) {
      alert('خطأ في حذف الأسرة: ' + error.message);
    }
  };

  const handleEdit = (family: Family) => {
    setEditingFamily(family);
    setFormData({
      family_name: family.family_name,
      head_of_family: family.head_of_family,
      phone: family.phone,
      region_id: family.region_id || '',
      address: family.address,
      location_link: family.location_link,
      family_size: family.family_size,
      notes: family.notes
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingFamily(null);
    setFormData({
      family_name: '',
      head_of_family: '',
      phone: '',
      region_id: '',
      address: '',
      location_link: '',
      family_size: 1,
      notes: ''
    });
    setShowModal(true);
  };

  const filteredFamilies = families.filter(family =>
    family.family_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.head_of_family?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.phone?.includes(searchTerm)
  );

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
        <h2 className="text-2xl font-bold text-gray-800">إدارة الأسر</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          <Plus className="w-5 h-5" />
          إضافة أسرة
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="ابحث عن أسرة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم العائلة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رب الأسرة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الهاتف</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنطقة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عدد الأفراد</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموقع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFamilies.map((family) => (
              <tr key={family.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {family.family_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {family.head_of_family}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {family.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {family.regions?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {family.family_size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {family.location_link ? (
                    <a
                      href={family.location_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <MapPin className="w-4 h-4" />
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(family)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(family.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFamilies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">لا توجد أسر</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingFamily ? 'تعديل أسرة' : 'إضافة أسرة جديدة'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم العائلة</label>
                  <input
                    type="text"
                    value={formData.family_name}
                    onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رب الأسرة</label>
                  <input
                    type="text"
                    value={formData.head_of_family}
                    onChange={(e) => setFormData({ ...formData, head_of_family: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة</label>
                  <select
                    value={formData.region_id}
                    onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">اختر المنطقة</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأفراد</label>
                  <input
                    type="number"
                    value={formData.family_size}
                    onChange={(e) => setFormData({ ...formData, family_size: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رابط الموقع (Google Maps)
                  </label>
                  <input
                    type="url"
                    value={formData.location_link}
                    onChange={(e) => setFormData({ ...formData, location_link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  {editingFamily ? 'تحديث' : 'إضافة'}
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
