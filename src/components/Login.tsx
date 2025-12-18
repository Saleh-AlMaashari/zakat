import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, UserCog, Users, Shield } from 'lucide-react';

type LoginMode = 'admin' | 'manager' | 'employee';

export function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<LoginMode>('employee');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('محاولة تسجيل الدخول...', email, 'كـ', mode);
      await signIn(email, password, mode);
      console.log('تم تسجيل الدخول بنجاح');
    } catch (err: any) {
      console.error('خطأ في تسجيل الدخول:', err);
      setError(err?.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات المدخلة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-4 rounded-full">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            لجنة زكاة العامرات
          </h1>
          <p className="text-gray-600">نظام إدارة المساعدات</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">اختر نوع الحساب</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setMode('admin')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                mode === 'admin'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Shield className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm">مدير النظام</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('manager')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                mode === 'manager'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <UserCog className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm">مدير اللجنة</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('employee')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                mode === 'employee'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Users className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm">موظف</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-semibold text-sm mb-1">خطأ في تسجيل الدخول:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="example@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}