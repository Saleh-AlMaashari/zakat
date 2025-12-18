# دليل الإعداد السريع

## خطوات إعداد النظام

### 1. إنشاء المستخدم الأول (مدير النظام)

استخدم SQL Editor في Supabase لتنفيذ الأوامر التالية:

#### أ. إنشاء مستخدم في النظام
أولاً، اذهب إلى Supabase Dashboard > Authentication > Users وأضف مستخدم جديد:
- Email: admin@alameraat.om
- Password: (اختر كلمة مرور قوية)

#### ب. إضافة بيانات المستخدم في جدول profiles
بعد إنشاء المستخدم، احصل على الـ ID الخاص به من قائمة المستخدمين، ثم نفذ:

\`\`\`sql
INSERT INTO profiles (id, full_name, role, phone, is_active)
VALUES (
  'أدخل-user-id-هنا',
  'مدير النظام',
  'admin',
  '12345678',
  true
);
\`\`\`

### 2. إضافة المناطق الأساسية

\`\`\`sql
INSERT INTO regions (name, description) VALUES
  ('العامرات الأولى', 'منطقة العامرات الأولى'),
  ('العامرات الثانية', 'منطقة العامرات الثانية'),
  ('العامرات الثالثة', 'منطقة العامرات الثالثة'),
  ('العامرات الرابعة', 'منطقة العامرات الرابعة'),
  ('العامرات الخامسة', 'منطقة العامرات الخامسة'),
  ('العامرات السادسة', 'منطقة العامرات السادسة');
\`\`\`

### 3. إضافة بيانات تجريبية (اختياري)

#### إضافة أسرة تجريبية:
\`\`\`sql
-- احصل على region_id من جدول regions أولاً
INSERT INTO families (
  family_number,
  head_of_family,
  phone,
  address,
  region_id,
  family_members_count,
  monthly_income,
  notes,
  created_by
) VALUES (
  'F001',
  'أحمد محمد',
  '99123456',
  'العامرات الأولى، شارع 10',
  (SELECT id FROM regions WHERE name = 'العامرات الأولى' LIMIT 1),
  5,
  300,
  'أسرة تجريبية',
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);
\`\`\`

#### إضافة منتجات في المخزون:
\`\`\`sql
-- إضافة منتج أرز
INSERT INTO products (name, category, unit, total_quantity, remaining_quantity)
VALUES ('أرز', 'مواد غذائية', 'كيس 50 كجم', 100, 100);

-- إضافة منتج سلة غذائية
INSERT INTO products (name, category, unit, total_quantity, remaining_quantity)
VALUES ('سلة غذائية', 'مواد غذائية', 'سلة', 50, 50);

-- إضافة منتج ثلاجة
INSERT INTO products (name, category, unit, total_quantity, remaining_quantity)
VALUES ('ثلاجة', 'أجهزة إلكترونية', 'قطعة', 10, 10);
\`\`\`

### 4. إنشاء مستخدمين إضافيين

#### مدير لجنة:
\`\`\`sql
-- 1. أنشئ المستخدم في Authentication أولاً
-- 2. ثم نفذ هذا:
INSERT INTO profiles (id, full_name, role, phone, is_active)
VALUES (
  'user-id-من-authentication',
  'محمد خالد',
  'manager',
  '99234567',
  true
);
\`\`\`

#### موظف:
\`\`\`sql
-- 1. أنشئ المستخدم في Authentication أولاً
-- 2. ثم نفذ هذا:
INSERT INTO profiles (id, full_name, role, phone, region_id, is_active)
VALUES (
  'user-id-من-authentication',
  'علي سالم',
  'employee',
  '99345678',
  (SELECT id FROM regions WHERE name = 'العامرات الأولى' LIMIT 1),
  true
);
\`\`\`

## التحقق من الإعداد

بعد إكمال الخطوات أعلاه:

1. ✅ تسجيل الدخول بحساب المدير
2. ✅ التحقق من ظهور لوحة التحكم
3. ✅ التحقق من ظهور المناطق
4. ✅ التحقق من إمكانية إضافة أسرة جديدة
5. ✅ التحقق من إمكانية إضافة منتجات في المخزون

## حل المشاكل الشائعة

### مشكلة: لا يمكن تسجيل الدخول
- تأكد من أن المستخدم موجود في Authentication
- تأكد من أن بيانات المستخدم موجودة في جدول profiles
- تأكد من أن الـ id في profiles يطابق الـ id في auth.users

### مشكلة: خطأ "Access Denied"
- تأكد من أن الدور (role) في جدول profiles صحيح
- تأكد من أن is_active = true

### مشكلة: لا تظهر البيانات
- تأكد من تفعيل Row Level Security على جميع الجداول
- تحقق من السياسات (Policies) في Supabase

## ملاحظات مهمة

1. **كلمات المرور**: استخدم كلمات مرور قوية لجميع المستخدمين
2. **الصلاحيات**: امنح صلاحية admin فقط للمستخدمين الموثوقين
3. **النسخ الاحتياطي**: قم بعمل نسخ احتياطية دورية لقاعدة البيانات
4. **التحديثات**: تابع تحديثات Supabase بانتظام

---

بعد إكمال الإعداد، النظام جاهز للاستخدام!