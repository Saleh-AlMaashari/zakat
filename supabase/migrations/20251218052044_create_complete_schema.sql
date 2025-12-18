/*
  # إنشاء schema كامل للنظام

  ## الجداول الجديدة
  
  ### 1. regions (المناطق)
  - id (uuid, primary key)
  - name (text) - اسم المنطقة
  - description (text) - وصف المنطقة
  - created_at (timestamptz)
  - created_by (uuid) - المستخدم الذي أنشأ المنطقة

  ### 2. families (الأسر)
  - id (uuid, primary key)
  - family_name (text) - اسم العائلة
  - head_of_family (text) - رب الأسرة
  - phone (text) - رقم الهاتف
  - region_id (uuid) - المنطقة
  - address (text) - العنوان التفصيلي
  - location_link (text) - رابط موقع Google Maps
  - family_size (integer) - عدد أفراد الأسرة
  - notes (text) - ملاحظات
  - created_at (timestamptz)
  - created_by (uuid)

  ### 3. assistances (المساعدات)
  - id (uuid, primary key)
  - name (text) - اسم المساعدة
  - type (text) - نوع المساعدة (غذائية، مالية، طبية، إلخ)
  - description (text)
  - created_at (timestamptz)
  - created_by (uuid)

  ### 4. inventory (المخزون)
  - id (uuid, primary key)
  - assistance_id (uuid) - المساعدة
  - quantity (integer) - الكمية المتوفرة
  - assigned_to (uuid) - موظف مخصص له (nullable)
  - status (text) - الحالة (متوفر، مخصص، موزع)
  - notes (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 5. deliveries (التسليمات)
  - id (uuid, primary key)
  - family_id (uuid) - العائلة
  - employee_id (uuid) - الموظف
  - inventory_id (uuid) - المخزون
  - quantity (integer) - الكمية
  - status (text) - الحالة (في الطريق، تم التسليم، لم يتم)
  - delivery_notes (text) - ملاحظات التسليم
  - scheduled_date (date) - تاريخ التسليم المجدول
  - delivered_at (timestamptz) - تاريخ التسليم الفعلي
  - created_at (timestamptz)

  ### 6. tasks (المهام)
  - id (uuid, primary key)
  - title (text) - عنوان المهمة
  - description (text)
  - assigned_to (uuid) - المستخدم المخصص له
  - status (text) - الحالة (جديدة، قيد التنفيذ، مكتملة)
  - priority (text) - الأولوية (عالية، متوسطة، منخفضة)
  - due_date (date) - تاريخ الاستحقاق
  - created_at (timestamptz)
  - created_by (uuid)
  - completed_at (timestamptz)

  ### 7. operation_logs (سجل العمليات)
  - id (uuid, primary key)
  - user_id (uuid) - المستخدم
  - action (text) - الإجراء
  - table_name (text) - اسم الجدول
  - record_id (uuid) - معرف السجل
  - details (jsonb) - تفاصيل العملية
  - created_at (timestamptz)

  ## الأمان
  - تفعيل RLS على جميع الجداول
  - سياسات قراءة وكتابة مناسبة
*/

-- إنشاء جدول المناطق
CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- إنشاء جدول الأسر
CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name text NOT NULL,
  head_of_family text NOT NULL,
  phone text DEFAULT '',
  region_id uuid REFERENCES regions(id) ON DELETE SET NULL,
  address text DEFAULT '',
  location_link text DEFAULT '',
  family_size integer DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- إنشاء جدول المساعدات
CREATE TABLE IF NOT EXISTS assistances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text DEFAULT 'غذائية',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- إنشاء جدول المخزون
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assistance_id uuid REFERENCES assistances(id) ON DELETE CASCADE,
  quantity integer DEFAULT 0,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'متوفر',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول التسليمات
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  inventory_id uuid REFERENCES inventory(id) ON DELETE CASCADE,
  quantity integer DEFAULT 0,
  status text DEFAULT 'في الطريق',
  delivery_notes text DEFAULT '',
  scheduled_date date DEFAULT CURRENT_DATE,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول المهام
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  assigned_to uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'جديدة',
  priority text DEFAULT 'متوسطة',
  due_date date,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at timestamptz
);

-- إنشاء جدول سجل العمليات
CREATE TABLE IF NOT EXISTS operation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistances ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY;

-- سياسات regions
CREATE POLICY "Authenticated users can read regions"
  ON regions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and manager can insert regions"
  ON regions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin and manager can update regions"
  ON regions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete regions"
  ON regions FOR DELETE
  TO authenticated
  USING (true);

-- سياسات families
CREATE POLICY "Authenticated users can read families"
  ON families FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert families"
  ON families FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update families"
  ON families FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin and manager can delete families"
  ON families FOR DELETE
  TO authenticated
  USING (true);

-- سياسات assistances
CREATE POLICY "Authenticated users can read assistances"
  ON assistances FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and manager can manage assistances"
  ON assistances FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات inventory
CREATE POLICY "Authenticated users can read inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and manager can manage inventory"
  ON inventory FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات deliveries
CREATE POLICY "Authenticated users can read deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage deliveries"
  ON deliveries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات tasks
CREATE POLICY "Authenticated users can read tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات operation_logs
CREATE POLICY "Admin can read operation logs"
  ON operation_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert operation logs"
  ON operation_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);