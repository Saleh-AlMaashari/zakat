/*
  # إصلاح كامل لسياسات profiles
  
  ## المشكلة
  - السياسات القديمة تحتوي على استعلامات من profiles داخل السياسة نفسها
  - هذا يسبب تكرار لا نهائي (infinite recursion)
  
  ## الحل
  - حذف جميع السياسات القديمة
  - إنشاء سياسات بسيطة بدون استعلامات فرعية
  - استخدام auth.uid() فقط للتحقق
*/

-- حذف جميع السياسات القديمة
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "الأدمن فقط يمكنه حذف المستخدمين" ON profiles;
DROP POLICY IF EXISTS "الأدمن والمدير يمكنهم إضافة مستخد" ON profiles;
DROP POLICY IF EXISTS "الأدمن والمدير يمكنهم تحديث المست" ON profiles;
DROP POLICY IF EXISTS "المستخدمون يمكنهم قراءة ملفاتهم ا" ON profiles;

-- سياسة بسيطة: جميع المستخدمين المصادقين يمكنهم القراءة
CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- سياسة: المستخدمون يمكنهم تحديث ملفاتهم فقط
CREATE POLICY "Users can update own profile only"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- سياسة: السماح بإنشاء ملفات شخصية
CREATE POLICY "Allow insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- سياسة: السماح بحذف الملفات
CREATE POLICY "Allow delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (true);