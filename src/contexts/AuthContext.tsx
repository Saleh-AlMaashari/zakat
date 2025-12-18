import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string, expectedRole?: 'admin' | 'manager' | 'employee') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('جاري تحميل بيانات المستخدم...', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('خطأ في تحميل البيانات:', error);
        throw error;
      }

      console.log('تم تحميل البيانات:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, expectedRole?: 'admin' | 'manager' | 'employee') => {
    console.log('signIn called with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase auth error:', error);

      if (error.message.includes('Invalid login credentials')) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('يجب تفعيل البريد الإلكتروني أولاً');
      } else if (error.message.includes('network')) {
        throw new Error('خطأ في الاتصال بالإنترنت. يرجى المحاولة مرة أخرى');
      } else {
        throw new Error('فشل تسجيل الدخول: ' + error.message);
      }
    }

    if (expectedRole && data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        await supabase.auth.signOut({ scope: 'local' });
        throw new Error('خطأ في تحميل بيانات المستخدم: ' + profileError.message);
      }

      if (!profileData) {
        await supabase.auth.signOut({ scope: 'local' });
        throw new Error('حساب المستخدم غير موجود في النظام');
      }

      if (profileData.role !== expectedRole) {
        await supabase.auth.signOut({ scope: 'local' });
        const roleNames = {
          admin: 'مدير النظام',
          manager: 'مدير اللجنة',
          employee: 'موظف'
        };
        throw new Error(
          `هذا الحساب مخصص لـ ${roleNames[profileData.role as keyof typeof roleNames]}. ` +
          `يرجى اختيار نوع الحساب الصحيح وإعادة المحاولة.`
        );
      }
    }

    console.log('تمت المصادقة بنجاح، جاري تحميل البيانات...');
  };

  const signOut = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    setProfile(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}