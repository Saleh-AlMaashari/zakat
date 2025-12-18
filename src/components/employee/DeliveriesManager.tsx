import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Package, MapPin, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Delivery {
  id: string;
  family_id: string;
  inventory_id: string;
  quantity: number;
  status: string;
  delivery_notes: string;
  scheduled_date: string;
  families?: {
    family_name: string;
    head_of_family: string;
    phone: string;
    address: string;
    location_link: string;
  };
  inventory?: {
    assistances?: {
      name: string;
      type: string;
    };
  };
}

export function DeliveriesManager() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          families (family_name, head_of_family, phone, address, location_link),
          inventory (assistances (name, type))
        `)
        .eq('employee_id', user?.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id: string, status: string, notes: string = '') => {
    try {
      const updateData: any = { status };
      if (notes) updateData.delivery_notes = notes;
      if (status === 'تم التسليم') updateData.delivered_at = new Date().toISOString();

      const { error } = await supabase
        .from('deliveries')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      loadDeliveries();
    } catch (error: any) {
      alert('خطأ في تحديث الحالة: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'تم التسليم') return 'bg-green-100 text-green-700';
    if (status === 'في الطريق') return 'bg-blue-100 text-blue-700';
    return 'bg-red-100 text-red-700';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'تم التسليم') return <CheckCircle className="w-5 h-5" />;
    if (status === 'في الطريق') return <Clock className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
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
      <div>
        <h2 className="text-2xl font-bold text-gray-800">التسليمات</h2>
        <p className="text-gray-600">إدارة التسليمات المخصصة لك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {delivery.families?.family_name}
                  </h3>
                  <p className="text-sm text-gray-600">رب الأسرة: {delivery.families?.head_of_family}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor(delivery.status)}`}>
                {getStatusIcon(delivery.status)}
                {delivery.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">المساعدة:</span>
                <span className="font-medium">{delivery.inventory?.assistances?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <span className="font-medium">{delivery.inventory?.assistances?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الكمية:</span>
                <span className="font-medium">{delivery.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الهاتف:</span>
                <span className="font-medium">{delivery.families?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">العنوان:</span>
                <span className="font-medium">{delivery.families?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الموعد:</span>
                <span className="font-medium">
                  {new Date(delivery.scheduled_date).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>

            {delivery.families?.location_link && (
              <a
                href={delivery.families.location_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition mb-3"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">فتح الموقع في الخرائط</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {delivery.delivery_notes && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-600 mb-1">ملاحظات:</p>
                <p className="text-sm text-gray-800">{delivery.delivery_notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              {delivery.status !== 'تم التسليم' && (
                <>
                  <button
                    onClick={() => updateDeliveryStatus(delivery.id, 'في الطريق')}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    disabled={delivery.status === 'في الطريق'}
                  >
                    في الطريق
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('ملاحظات التسليم (اختياري):');
                      updateDeliveryStatus(delivery.id, 'تم التسليم', notes || '');
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    تم التسليم
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('سبب عدم التسليم:');
                      if (notes) updateDeliveryStatus(delivery.id, 'لم يتم', notes);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    لم يتم
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {deliveries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد تسليمات مخصصة لك</p>
        </div>
      )}
    </div>
  );
}
