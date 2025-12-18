/*
  # إصلاح سياسات جدول profiles
  
  ## المشكلة
  - سياسات RLS تسبب تكرار لا نهائي
  - السياسة تحقق من profiles للوصول إلى profiles
  
  ## الحل
  - حذف جميع السياسات القديمة
  - إنشاء سياسات بسيطة بدون تكرار
*/

-- حذف جميع السياسات القديمة
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- سياسة بسيطة: المستخدمون يمكنهم قراءة ملفهم الشخصي
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- سياسة: المستخدمون يمكنهم تحديث ملفهم الشخصي (باستثناء الدور)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- سياسة: السماح بإنشاء ملفات شخصية جديدة
CREATE POLICY "Allow profile creation"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);