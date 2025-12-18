-- بيانات تجريبية لنظام إدارة مساعدات لجنة زكاة العامرات
-- ملاحظة: قم بتعديل الـ IDs حسب بيانات النظام لديك

-- 1. إضافة المناطق
INSERT INTO regions (name, description) VALUES
  ('العامرات الأولى', 'منطقة العامرات الأولى'),
  ('العامرات الثانية', 'منطقة العامرات الثانية'),
  ('العامرات الثالثة', 'منطقة العامرات الثالثة'),
  ('العامرات الرابعة', 'منطقة العامرات الرابعة'),
  ('العامرات الخامسة', 'منطقة العامرات الخامسة'),
  ('العامرات السادسة', 'منطقة العامرات السادسة')
ON CONFLICT DO NOTHING;

-- 2. إضافة أسر تجريبية
-- ملاحظة: استبدل 'YOUR_USER_ID' بالـ ID الخاص بالمستخدم المسجل
DO $$
DECLARE
  admin_id uuid;
  region1_id uuid;
  region2_id uuid;
  region3_id uuid;
BEGIN
  -- الحصول على معرف المدير
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  -- الحصول على معرفات المناطق
  SELECT id INTO region1_id FROM regions WHERE name = 'العامرات الأولى';
  SELECT id INTO region2_id FROM regions WHERE name = 'العامرات الثانية';
  SELECT id INTO region3_id FROM regions WHERE name = 'العامرات الثالثة';

  -- إضافة الأسر
  INSERT INTO families (family_number, head_of_family, phone, address, region_id, family_members_count, monthly_income, notes, created_by) VALUES
    ('F001', 'أحمد محمد علي', '99123456', 'العامرات الأولى، شارع 10، منزل رقم 5', region1_id, 5, 300, 'أسرة محتاجة للدعم الشهري', admin_id),
    ('F002', 'خالد سالم حمد', '99234567', 'العامرات الأولى، شارع 15، منزل رقم 12', region1_id, 4, 250, 'يحتاج الأب إلى علاج', admin_id),
    ('F003', 'محمد عبدالله سعيد', '99345678', 'العامرات الثانية، شارع 3، منزل رقم 8', region2_id, 6, 200, 'أسرة كبيرة تحتاج دعم غذائي', admin_id),
    ('F004', 'علي حسن راشد', '99456789', 'العامرات الثانية، شارع 7، منزل رقم 20', region2_id, 3, 400, 'عائل الأسرة متوفى', admin_id),
    ('F005', 'فاطمة أحمد محمد', '99567890', 'العامرات الثالثة، شارع 5، منزل رقم 15', region3_id, 7, 150, 'أرملة مع أطفال', admin_id),
    ('F006', 'سالم ناصر علي', '99678901', 'العامرات الثالثة، شارع 12، منزل رقم 3', region3_id, 4, 350, 'يحتاج إلى دعم تعليمي للأطفال', admin_id),
    ('F007', 'حمد سعيد سالم', '99789012', 'العامرات الأولى، شارع 8، منزل رقم 25', region1_id, 5, 280, 'أسرة جديدة في المنطقة', admin_id),
    ('F008', 'عبدالله خالد محمد', '99890123', 'العامرات الثانية، شارع 11، منزل رقم 7', region2_id, 4, 320, 'يحتاج إلى دعم سكني', admin_id),
    ('F009', 'راشد علي سعيد', '99901234', 'العامرات الثالثة، شارع 9، منزل رقم 18', region3_id, 6, 180, 'دخل محدود جداً', admin_id),
    ('F010', 'ناصر حمد خالد', '99012345', 'العامرات الأولى، شارع 6، منزل رقم 11', region1_id, 3, 450, 'يحتاج إلى دعم صحي', admin_id)
  ON CONFLICT (family_number) DO NOTHING;
END $$;

-- 3. إضافة منتجات في المخزون
INSERT INTO products (name, category, unit, total_quantity, remaining_quantity) VALUES
  ('أرز - كيس 50 كجم', 'مواد غذائية', 'كيس', 100, 100),
  ('أرز - كيس 25 كجم', 'مواد غذائية', 'كيس', 150, 150),
  ('سكر', 'مواد غذائية', 'كيلو', 500, 500),
  ('زيت طعام', 'مواد غذائية', 'لتر', 200, 200),
  ('طحين', 'مواد غذائية', 'كيس', 80, 80),
  ('تمر', 'مواد غذائية', 'كيلو', 300, 300),
  ('عدس', 'مواد غذائية', 'كيلو', 200, 200),
  ('سلة غذائية متكاملة', 'مواد غذائية', 'سلة', 50, 50),
  ('لحم غنم', 'لحوم', 'كيلو', 100, 100),
  ('دجاج', 'لحوم', 'كيلو', 200, 200),
  ('ثلاجة 18 قدم', 'أجهزة إلكترونية', 'قطعة', 15, 15),
  ('ثلاجة 14 قدم', 'أجهزة إلكترونية', 'قطعة', 20, 20),
  ('غسالة أوتوماتيك', 'أجهزة إلكترونية', 'قطعة', 12, 12),
  ('مكيف 18000 وحدة', 'أجهزة إلكترونية', 'قطعة', 10, 10),
  ('مكيف 24000 وحدة', 'أجهزة إلكترونية', 'قطعة', 8, 8),
  ('فرن غاز', 'أجهزة إلكترونية', 'قطعة', 6, 6),
  ('طقم ملابس رجالي', 'ملابس', 'طقم', 30, 30),
  ('طقم ملابس نسائي', 'ملابس', 'طقم', 40, 40),
  ('طقم ملابس أطفال', 'ملابس', 'طقم', 50, 50),
  ('سرير مفرد', 'أثاث', 'قطعة', 10, 10),
  ('سرير مزدوج', 'أثاث', 'قطعة', 8, 8),
  ('خزانة ملابس', 'أثاث', 'قطعة', 5, 5),
  ('طاولة طعام', 'أثاث', 'قطعة', 6, 6),
  ('كراسي (طقم 6)', 'أثاث', 'طقم', 10, 10)
ON CONFLICT (name) DO NOTHING;

-- 4. إضافة حركات مخزون أولية لجميع المنتجات
DO $$
DECLARE
  admin_id uuid;
  product_record RECORD;
BEGIN
  -- الحصول على معرف المدير
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  -- إضافة حركة وارد لكل منتج
  FOR product_record IN SELECT id, total_quantity FROM products LOOP
    INSERT INTO inventory_transactions (
      product_id,
      transaction_type,
      quantity,
      notes,
      created_by
    ) VALUES (
      product_record.id,
      'in',
      product_record.total_quantity,
      'رصيد افتتاحي',
      admin_id
    );
  END LOOP;
END $$;

-- 5. إضافة بعض المساعدات التجريبية
DO $$
DECLARE
  admin_id uuid;
  family1_id uuid;
  family2_id uuid;
  family3_id uuid;
  type_rice uuid;
  type_basket uuid;
  type_meat uuid;
BEGIN
  -- الحصول على المعرفات
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
  SELECT id INTO family1_id FROM families WHERE family_number = 'F001';
  SELECT id INTO family2_id FROM families WHERE family_number = 'F002';
  SELECT id INTO family3_id FROM families WHERE family_number = 'F003';
  SELECT id INTO type_rice FROM assistance_types WHERE name = 'أرز';
  SELECT id INTO type_basket FROM assistance_types WHERE name = 'سلة غذائية';
  SELECT id INTO type_meat FROM assistance_types WHERE name = 'لحم';

  -- إضافة المساعدات
  INSERT INTO assistances (family_id, assistance_type_id, amount, notes, created_by) VALUES
    (family1_id, type_rice, 50, 'مساعدة شهرية', admin_id),
    (family1_id, type_basket, 1, 'سلة رمضان', admin_id),
    (family2_id, type_meat, 10, 'مساعدة عيد الأضحى', admin_id),
    (family2_id, type_rice, 25, 'مساعدة شهرية', admin_id),
    (family3_id, type_basket, 1, 'سلة رمضان', admin_id);
END $$;

-- تم! الآن لديك بيانات تجريبية كاملة في النظام