-- ============================================================
-- تغميسة | Taghmesa — قاعدة البيانات الكاملة
-- استورد هذا الملف كامل عبر phpMyAdmin (Import) بعد إنشاء قاعدة
-- البيانات من لوحة تحكم الاستضافة (cPanel > MySQL Databases)
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+03:00';

-- ------------------------------------------------------------
-- جدول المنتجات
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name_ar       VARCHAR(120) NOT NULL,
  name_en       VARCHAR(120) NOT NULL,
  category      VARCHAR(40)  NOT NULL,
  emoji         VARCHAR(10)  NOT NULL DEFAULT '🍽️',
  description   TEXT NOT NULL,
  image_path    VARCHAR(255) NULL,        -- مثال: uploads/products/1.webp
  is_featured   TINYINT(1) NOT NULL DEFAULT 0,
  is_new        TINYINT(1) NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,   -- لإخفاء منتج بدون حذفه
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- جدول أحجام/أسعار كل منتج (منتج واحد قد يملك أكثر من حجم)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_sizes (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id    INT UNSIGNED NOT NULL,
  label         VARCHAR(60)  NOT NULL,     -- مثال: "20 حبة"
  price         DECIMAL(10,2) NOT NULL,
  calories_label VARCHAR(60) NOT NULL,     -- مثال: "900–1300 سعرة"
  sort_order    INT NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- جدول الطلبات
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number   VARCHAR(20) NOT NULL UNIQUE,
  first_name     VARCHAR(80) NOT NULL,
  last_name      VARCHAR(80) NOT NULL,
  phone          VARCHAR(20) NOT NULL,
  city           VARCHAR(80) NOT NULL,
  address        TEXT NOT NULL,
  notes          TEXT NULL,
  payment_method VARCHAR(20) NOT NULL DEFAULT 'cod',   -- card / apple_pay / cod
  subtotal       DECIMAL(10,2) NOT NULL,
  delivery_fee   DECIMAL(10,2) NOT NULL DEFAULT 0,
  total          DECIMAL(10,2) NOT NULL,
  status         VARCHAR(20) NOT NULL DEFAULT 'new',    -- new / preparing / out_for_delivery / delivered / cancelled
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- جدول عناصر الطلب
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id      INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NULL,
  product_name  VARCHAR(120) NOT NULL,   -- ننسخ الاسم وقت الطلب حتى لو تغيّر المنتج بعدين
  size_label    VARCHAR(60) NOT NULL,
  unit_price    DECIMAL(10,2) NOT NULL,
  qty           INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- جدول حساب الأدمن (حساب واحد لصاحب المتجر)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- حساب أدمن مبدئي: اسم المستخدم admin / كلمة المرور Taghmesa2026!
-- غيّرها فوراً من صفحة "تغيير كلمة المرور" بعد أول تسجيل دخول (راجع ملف التعليمات)
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2b$10$kSDTpiU3ArS5xhkp5/uil.K4LCQP/lrYvMgOqNB5wDuWLsWRtgKxm');

-- ============================================================
-- تعبئة المنتجات الحالية (11 منتج) بأسعارها ووصفها وسعراتها
-- ============================================================
INSERT INTO products (id, name_ar, name_en, category, emoji, description, image_path, is_featured, is_new, sort_order) VALUES
(1,'ورق عنب','Waraq Enab','مطبوخ','🍃','ورق عنب أصيل محشوّ بأرز بلدي متبّل بعناية، يُلفّ بإحكام ويُطهى على نار هادئة حتى يكتسب قوامه الطري ونكهته الحامضة الغنية — طبق بيتي دافئ يليق بأي سفرة.','uploads/products/1.webp',1,0,1),
(2,'ملفوف','Malfouf','مطبوخ','🥬','لفائف ملفوف طازجة محشوّة بمزيج متوازن من الأرز واللحم والتوابل المنزلية، تُطهى بصبر حتى تذوب في الفم — طعم بيتي أصيل بلمسة تغميسة المميزة.','uploads/products/2.webp',1,0,2),
(3,'جريش','Jaresh','مطبوخ','🫕','جريش سعودي أصيل، حبّاته مطحونة طحناً خشناً ومطبوخة مع اللحم والتوابل ببطء حتى تصل لقوامها الكريمي الغني — دفء المطبخ السعودي في كل ملعقة.','uploads/products/3.webp',1,0,3),
(4,'فتة مكرونة وورق عنب','Pasta & Waraq Enab Fatta','مطبوخ','🍝','دمج مبتكر بين المكرونة الذهبية وورق العنب المحشوّ، مغطى بصوص لبني كريمي ولمسة دبس رمان حامضة ومكسرات محمّصة — تجربة فتة مختلفة في كل قضمة.','uploads/products/4.webp',1,0,4),
(5,'فتة ورق عنب','Fattet Waraq Enab','مطبوخ','🥗','فتة غنية تجمع طبقات من الخبز المحمّص وورق العنب المحشوّ، تُتوَّج بلبن كريمي وصوص دبس رمان وحبات رمان طازجة ومكسرات مقرمشة — طبق احتفالي بنكهات متوازنة بين الحامض والدسم.','uploads/products/5.webp',1,1,5),
(6,'مسخن','Musakhan','مطبوخ','🫔','لفائف مسخن بخبز طازج محشوّ بدجاج متبّل بالسماق والبصل المحمّر وزيت الزيتون البلدي، تُلفّ وتُخبز حتى تكتسب قرمشة خفيفة من الخارج وطراوة شهية من الداخل — نكهة شرقية أصيلة بأسلوب تغميسة.','uploads/products/6.webp',1,1,6),
(7,'آيس كريم كراميل','Caramel Ice Cream','حلويات','🍮','آيس كريم منزلي بقوام حريري ناعم، محضّر بكراميل غني مطبوخ ببطء وطبقة علوية لامعة من صوص الكراميل — حلى بارد يُختتم به أي وجبة بحلاوة متوازنة.','uploads/products/7.webp',1,0,7),
(8,'محبوج','Mahbouj','غموس','🌶️','غموس محبوج ناري بمزيج من الفلفل والتوابل السعودية المميزة، يُحضّر طازجاً ليضيف نكهة قوية وحارة لأي طبق أو سفرة — لعشاق النكهات الجريئة.','uploads/products/8.webp',1,0,8),
(9,'تعتيمة','Tatema','غموس','🫙','غموس تعتيمة الكريمي بقوام ناعم متجانس ونكهة متوازنة بين الحموضة الخفيفة والدسم، مثالي مع الخبز الطازج أو كطبق جانبي يكمل أي وجبة.','uploads/products/9.webp',1,0,9),
(10,'صوص دبس رمان','Pomegranate Molasses Sauce','صوصات','🍷','صوص دبس الرمان الطبيعي، حلو حامض بقوام مركّز، يضيف لمسة لامعة ونكهة متوازنة لأطباقك المفضلة أو للتزيين النهائي.',NULL,0,0,10),
(11,'صوص تعتيمة','Tatema Sauce','صوصات','🥛','صوص تعتيمة الكريمي، رفيق مثالي يكمّل النكهة ويضيف قوامًا غنيًا لأي طبق تُقدّمه معه.',NULL,0,0,11);

INSERT INTO product_sizes (product_id, label, price, calories_label, sort_order) VALUES
(1,'20 حبة',45.00,'900–1300 سعرة',1),
(1,'40 حبة',85.00,'1800–2600 سعرة',2),
(2,'20 حبة',45.00,'700–900 سعرة',1),
(2,'40 حبة',85.00,'1400–1800 سعرة',2),
(3,'صغير',35.00,'300–500 سعرة',1),
(3,'وسط',80.00,'700–950 سعرة',2),
(3,'كبير',120.00,'1000–1400 سعرة',3),
(4,'الحصة',45.00,'950–1400 سعرة',1),
(5,'الحصة',45.00,'800–1200 سعرة',1),
(6,'25 حبة',67.00,'1500–2250 سعرة',1),
(7,'صغير',70.00,'700–1100 سعرة',1),
(7,'كبير',120.00,'1200–1700 سعرة',2),
(8,'البرطمان',35.00,'500–850 سعرة',1),
(8,'برطمانان',64.00,'1000–1700 سعرة',2),
(9,'البرطمان',40.00,'600–950 سعرة',1),
(9,'برطمانان',74.00,'1200–1900 سعرة',2),
(10,'الحصة',3.00,'25–40 سعرة',1),
(10,'5 حصص',12.00,'125–200 سعرة',2),
(11,'الحصة',3.00,'80–140 سعرة',1),
(11,'5 حصص',12.00,'400–700 سعرة',2);

-- ============================================================
-- ملاحظة: بعد الاستيراد، حدّث auto_increment للمنتجات القادمة
-- ============================================================
ALTER TABLE products AUTO_INCREMENT = 12;
