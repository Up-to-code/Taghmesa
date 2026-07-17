<?php
require __DIR__ . '/../config.php';
require __DIR__ . '/includes/auth.php';
require_admin_page();

$conn = db();
$flash = '';
$flashErr = '';

// أنواع الأحجام المسموحة لرفع الصور
$ALLOWED_EXT = ['jpg' => 'jpg', 'jpeg' => 'jpg', 'png' => 'png', 'webp' => 'webp'];

function save_uploaded_image(string $fieldName, int $productId): ?string
{
    global $ALLOWED_EXT;
    if (empty($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] === UPLOAD_ERR_NO_FILE) {
        return null; // ما رفع صورة، خلها كما هي
    }
    if ($_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }
    $tmp = $_FILES[$fieldName]['tmp_name'];
    $origName = $_FILES[$fieldName]['name'];
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    if (!isset($ALLOWED_EXT[$ext])) {
        return null;
    }
    $destDir = __DIR__ . '/../uploads/products';
    if (!is_dir($destDir)) {
        mkdir($destDir, 0755, true);
    }
    $destName = $productId . '.' . $ALLOWED_EXT[$ext];
    $destPath = $destDir . '/' . $destName;
    if (move_uploaded_file($tmp, $destPath)) {
        return 'uploads/products/' . $destName;
    }
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'update_product') {
        $pid = (int)($_POST['product_id'] ?? 0);
        $nameAr = trim($_POST['name_ar'] ?? '');
        $nameEn = trim($_POST['name_en'] ?? '');
        $cat = trim($_POST['category'] ?? '');
        $emoji = trim($_POST['emoji'] ?? '🍽️');
        $desc = trim($_POST['description'] ?? '');
        $isActive = isset($_POST['is_active']) ? 1 : 0;
        $isFeatured = isset($_POST['is_featured']) ? 1 : 0;
        $isNew = isset($_POST['is_new']) ? 1 : 0;

        if ($pid > 0 && $nameAr !== '') {
            $stmt = $conn->prepare("UPDATE products SET name_ar=?, name_en=?, category=?, emoji=?, description=?, is_active=?, is_featured=?, is_new=? WHERE id=?");
            $stmt->bind_param('sssssiiii', $nameAr, $nameEn, $cat, $emoji, $desc, $isActive, $isFeatured, $isNew, $pid);
            $stmt->execute();

            // تحديث أسعار/سعرات الأحجام الحالية
            foreach ($_POST as $key => $val) {
                if (preg_match('/^size_price_(\d+)$/', $key, $m)) {
                    $sizeId = (int)$m[1];
                    $price = (float)$val;
                    $calKey = 'size_cal_' . $sizeId;
                    $cal = trim($_POST[$calKey] ?? '');
                    $s = $conn->prepare("UPDATE product_sizes SET price=?, calories_label=? WHERE id=? AND product_id=?");
                    $s->bind_param('dsii', $price, $cal, $sizeId, $pid);
                    $s->execute();
                }
            }

            // إضافة حجم جديد لهذا المنتج (اختياري)
            $newLabel = trim($_POST['new_size_label'] ?? '');
            $newPrice = trim($_POST['new_size_price'] ?? '');
            $newCal = trim($_POST['new_size_cal'] ?? '');
            if ($newLabel !== '' && $newPrice !== '') {
                $ns = $conn->prepare("INSERT INTO product_sizes (product_id, label, price, calories_label, sort_order) VALUES (?,?,?,?,99)");
                $priceF = (float)$newPrice;
                $ns->bind_param('isds', $pid, $newLabel, $priceF, $newCal);
                $ns->execute();
            }

            $imgPath = save_uploaded_image('product_image', $pid);
            if ($imgPath) {
                $u = $conn->prepare("UPDATE products SET image_path=? WHERE id=?");
                $u->bind_param('si', $imgPath, $pid);
                $u->execute();
            }
            $flash = 'تم حفظ التعديلات على "' . $nameAr . '"';
        }
    }

    if ($action === 'delete_size') {
        $sizeId = (int)($_POST['size_id'] ?? 0);
        if ($sizeId > 0) {
            $conn->query("DELETE FROM product_sizes WHERE id = $sizeId");
            $flash = 'تم حذف الحجم';
        }
    }

    if ($action === 'add_product') {
        $nameAr = trim($_POST['name_ar'] ?? '');
        $nameEn = trim($_POST['name_en'] ?? '');
        $cat = trim($_POST['category'] ?? 'مطبوخ');
        $emoji = trim($_POST['emoji'] ?? '🍽️');
        $desc = trim($_POST['description'] ?? '');
        $sizeLabel = trim($_POST['size_label'] ?? 'الحصة');
        $sizePrice = (float)($_POST['size_price'] ?? 0);
        $sizeCal = trim($_POST['size_cal'] ?? '');

        if ($nameAr !== '' && $sizePrice > 0) {
            $stmt = $conn->prepare("INSERT INTO products (name_ar, name_en, category, emoji, description, is_active, sort_order) VALUES (?,?,?,?,?,1,999)");
            $stmt->bind_param('sssss', $nameAr, $nameEn, $cat, $emoji, $desc);
            $stmt->execute();
            $newId = $conn->insert_id;

            $s = $conn->prepare("INSERT INTO product_sizes (product_id, label, price, calories_label, sort_order) VALUES (?,?,?,?,1)");
            $s->bind_param('isds', $newId, $sizeLabel, $sizePrice, $sizeCal);
            $s->execute();

            $imgPath = save_uploaded_image('product_image', $newId);
            if ($imgPath) {
                $u = $conn->prepare("UPDATE products SET image_path=? WHERE id=?");
                $u->bind_param('si', $imgPath, $newId);
                $u->execute();
            }
            $flash = 'تمت إضافة منتج "' . $nameAr . '" بنجاح';
        } else {
            $flashErr = 'أدخل اسم المنتج وسعر الحجم الأول على الأقل';
        }
    }

    if ($action === 'update_order_status') {
        $orderId = (int)($_POST['order_id'] ?? 0);
        $status = trim($_POST['status'] ?? 'new');
        $allowed = ['new', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if ($orderId > 0 && in_array($status, $allowed, true)) {
            $stmt = $conn->prepare("UPDATE orders SET status=? WHERE id=?");
            $stmt->bind_param('si', $status, $orderId);
            $stmt->execute();
            $flash = 'تم تحديث حالة الطلب';
        }
    }

    // إعادة توجيه لمنع إعادة إرسال النموذج عند تحديث الصفحة (POST/Redirect/GET)
    $_SESSION['flash'] = $flash;
    $_SESSION['flash_err'] = $flashErr;
    header('Location: dashboard.php?tab=' . ($_POST['active_tab'] ?? 'products'));
    exit;
}

$flash = $_SESSION['flash'] ?? '';
$flashErr = $_SESSION['flash_err'] ?? '';
unset($_SESSION['flash'], $_SESSION['flash_err']);
$activeTab = $_GET['tab'] ?? 'products';

// ---- جلب المنتجات مع أحجامها ----
$products = [];
$pres = $conn->query("SELECT * FROM products ORDER BY sort_order ASC, id ASC");
while ($row = $pres->fetch_assoc()) {
    $row['sizes'] = [];
    $products[$row['id']] = $row;
}
if ($products) {
    $ids = implode(',', array_keys($products));
    $sres = $conn->query("SELECT * FROM product_sizes WHERE product_id IN ($ids) ORDER BY product_id, sort_order, id");
    while ($srow = $sres->fetch_assoc()) {
        $products[$srow['product_id']]['sizes'][] = $srow;
    }
}

// ---- جلب الطلبات ----
$orders = [];
$ores = $conn->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200");
while ($row = $ores->fetch_assoc()) {
    $row['items'] = [];
    $orders[$row['id']] = $row;
}
if ($orders) {
    $oids = implode(',', array_keys($orders));
    $ires = $conn->query("SELECT * FROM order_items WHERE order_id IN ($oids)");
    while ($irow = $ires->fetch_assoc()) {
        $orders[$irow['order_id']]['items'][] = $irow;
    }
}

$STATUS_LABELS = [
    'new' => 'جديد', 'preparing' => 'قيد التحضير', 'out_for_delivery' => 'قيد التوصيل',
    'delivered' => 'تم التوصيل', 'cancelled' => 'ملغي',
];
$CATEGORIES = ['مطبوخ', 'غموس', 'حلويات', 'صوصات'];

function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>لوحة تحكم تغميسة</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;background:#f3f6f7;color:#263033;min-height:100vh}
.top{background:#0095A7;color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.top h1{font-size:17px;font-weight:900}
.top .links{display:flex;gap:10px;align-items:center}
.top a{color:#fff;font-size:13px;text-decoration:none;background:rgba(255,255,255,.15);padding:8px 14px;border-radius:10px}
.top a:hover{background:rgba(255,255,255,.28)}
.wrap{max-width:1100px;margin:0 auto;padding:24px}
.tabs{display:flex;gap:8px;margin-bottom:20px}
.tab-btn{background:#fff;border:1.5px solid #dde8ea;border-radius:12px;padding:10px 20px;font-family:'Tajawal',sans-serif;font-size:14px;font-weight:800;color:#6a7d82;cursor:pointer;text-decoration:none}
.tab-btn.on{background:#0095A7;color:#fff;border-color:#0095A7}
.flash{background:#e8faf4;color:#1a7a4e;border-radius:12px;padding:12px 16px;margin-bottom:18px;font-size:14px;font-weight:700}
.flash-err{background:#fdeeee;color:#c0392b;border-radius:12px;padding:12px 16px;margin-bottom:18px;font-size:14px;font-weight:700}
.card{background:#fff;border-radius:16px;padding:20px;margin-bottom:16px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
.card summary{cursor:pointer;font-weight:900;font-size:15px;display:flex;align-items:center;justify-content:space-between;list-style:none}
.card summary::-webkit-details-marker{display:none}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
@media(max-width:700px){.pgrid{grid-template-columns:1fr}}
label{display:block;font-size:11px;font-weight:800;color:#6a7d82;margin-bottom:5px}
input[type=text],input[type=number],textarea,select{width:100%;border:1.5px solid #dde8ea;border-radius:10px;padding:9px 12px;font-family:'Tajawal',sans-serif;font-size:13px;direction:rtl;outline:none;margin-bottom:10px}
textarea{min-height:70px;resize:vertical}
.chk{display:flex;align-items:center;gap:6px;font-size:12px;color:#263033;font-weight:700;margin-bottom:10px}
.sizes-box{background:#f7fafb;border-radius:12px;padding:12px;margin:10px 0}
.size-row{display:grid;grid-template-columns:1fr 100px 1fr 70px;gap:8px;align-items:center;margin-bottom:8px}
.size-row .lbl{font-size:13px;font-weight:800;color:#0095A7}
.btn{background:#0095A7;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-family:'Tajawal',sans-serif;font-size:13px;font-weight:800;cursor:pointer}
.btn:hover{background:#006E7A}
.btn-del{background:#fdeeee;color:#c0392b}
.btn-del:hover{background:#f8d7d7}
.thumb{width:56px;height:56px;border-radius:10px;object-fit:cover;background:#eee}
.prow-head{display:flex;align-items:center;gap:12px}
table{width:100%;border-collapse:collapse;font-size:13px}
table th, table td{padding:9px 8px;text-align:right;border-bottom:1px solid #eef2f3}
table th{color:#8a9da3;font-weight:800;font-size:11px}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800}
.st-new{background:#e6f4ff;color:#1565c0}
.st-preparing{background:#fff3e0;color:#b8720a}
.st-out_for_delivery{background:#ede7f6;color:#5e35b1}
.st-delivered{background:#e8faf4;color:#1a7a4e}
.st-cancelled{background:#fdeeee;color:#c0392b}
.items-list{font-size:12px;color:#6a7d82;margin-top:4px}
</style>
</head>
<body>
<div class="top">
  <h1>لوحة تحكم تغميسة</h1>
  <div class="links">
    <span style="font-size:13px">أهلاً <?= h($_SESSION['admin_username'] ?? '') ?></span>
    <a href="change_password.php">تغيير كلمة المرور</a>
    <a href="logout.php">تسجيل الخروج</a>
  </div>
</div>
<div class="wrap">
  <?php if ($flash): ?><div class="flash"><?= h($flash) ?></div><?php endif; ?>
  <?php if ($flashErr): ?><div class="flash-err"><?= h($flashErr) ?></div><?php endif; ?>

  <div class="tabs">
    <a class="tab-btn <?= $activeTab === 'products' ? 'on' : '' ?>" href="?tab=products">المنتجات (<?= count($products) ?>)</a>
    <a class="tab-btn <?= $activeTab === 'orders' ? 'on' : '' ?>" href="?tab=orders">الطلبات (<?= count($orders) ?>)</a>
  </div>

  <?php if ($activeTab === 'products'): ?>
    <?php foreach ($products as $p): ?>
    <details class="card">
      <summary>
        <span class="prow-head">
          <img class="thumb" src="<?= $p['image_path'] ? h('../' . $p['image_path']) : 'data:,' ?>" onerror="this.style.display='none'" alt="">
          <span><?= h($p['emoji']) ?> <?= h($p['name_ar']) ?> — <?= h($p['category']) ?></span>
        </span>
        <span style="font-size:12px;color:<?= $p['is_active'] ? '#1a7a4e' : '#c0392b' ?>"><?= $p['is_active'] ? 'مفعّل' : 'مخفي' ?></span>
      </summary>

      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="action" value="update_product">
        <input type="hidden" name="active_tab" value="products">
        <input type="hidden" name="product_id" value="<?= (int)$p['id'] ?>">
        <div class="pgrid">
          <div>
            <label>الاسم بالعربي</label>
            <input type="text" name="name_ar" value="<?= h($p['name_ar']) ?>" required>
          </div>
          <div>
            <label>الاسم بالإنجليزي</label>
            <input type="text" name="name_en" value="<?= h($p['name_en']) ?>">
          </div>
          <div>
            <label>الفئة</label>
            <select name="category">
              <?php foreach ($CATEGORIES as $c): ?>
              <option value="<?= h($c) ?>" <?= $p['category'] === $c ? 'selected' : '' ?>><?= h($c) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div>
            <label>الإيموجي (احتياطي إذا بدون صورة)</label>
            <input type="text" name="emoji" value="<?= h($p['emoji']) ?>">
          </div>
        </div>
        <label>الوصف</label>
        <textarea name="description"><?= h($p['description']) ?></textarea>

        <label>صورة المنتج (اختياري - لرفع صورة جديدة بدل الحالية)</label>
        <input type="file" name="product_image" accept=".jpg,.jpeg,.png,.webp">

        <div class="sizes-box">
          <label style="margin-bottom:8px">الأحجام والأسعار</label>
          <?php foreach ($p['sizes'] as $sz): ?>
          <div class="size-row">
            <span class="lbl"><?= h($sz['label']) ?></span>
            <input type="number" step="0.01" min="0" name="size_price_<?= (int)$sz['id'] ?>" value="<?= h($sz['price']) ?>" title="السعر (ر.س)">
            <input type="text" name="size_cal_<?= (int)$sz['id'] ?>" value="<?= h($sz['calories_label']) ?>" title="السعرات الحرارية">
            <button class="btn btn-del" type="submit" form="delform_<?= (int)$sz['id'] ?>">حذف</button>
          </div>
          <?php endforeach; ?>
          <div class="size-row" style="margin-top:12px">
            <input type="text" name="new_size_label" placeholder="حجم جديد مثل: عائلي">
            <input type="number" step="0.01" min="0" name="new_size_price" placeholder="السعر">
            <input type="text" name="new_size_cal" placeholder="السعرات مثل 900–1300 سعرة">
            <span></span>
          </div>
        </div>

        <div class="chk"><input type="checkbox" name="is_active" id="active_<?= (int)$p['id'] ?>" <?= $p['is_active'] ? 'checked' : '' ?>><label for="active_<?= (int)$p['id'] ?>" style="margin:0">مفعّل ويظهر في المتجر</label></div>
        <div class="chk"><input type="checkbox" name="is_featured" id="feat_<?= (int)$p['id'] ?>" <?= $p['is_featured'] ? 'checked' : '' ?>><label for="feat_<?= (int)$p['id'] ?>" style="margin:0">مميز (يظهر بالصفحة الرئيسية)</label></div>
        <div class="chk"><input type="checkbox" name="is_new" id="new_<?= (int)$p['id'] ?>" <?= $p['is_new'] ? 'checked' : '' ?>><label for="new_<?= (int)$p['id'] ?>" style="margin:0">وضع شارة "جديد"</label></div>

        <button class="btn" type="submit">حفظ التعديلات</button>
      </form>

      <?php foreach ($p['sizes'] as $sz): ?>
      <form id="delform_<?= (int)$sz['id'] ?>" method="post" style="display:none">
        <input type="hidden" name="action" value="delete_size">
        <input type="hidden" name="active_tab" value="products">
        <input type="hidden" name="size_id" value="<?= (int)$sz['id'] ?>">
      </form>
      <?php endforeach; ?>
    </details>
    <?php endforeach; ?>

    <div class="card">
      <h3 style="margin-bottom:14px">إضافة منتج جديد</h3>
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="action" value="add_product">
        <input type="hidden" name="active_tab" value="products">
        <div class="pgrid">
          <div><label>الاسم بالعربي</label><input type="text" name="name_ar" required></div>
          <div><label>الاسم بالإنجليزي</label><input type="text" name="name_en"></div>
          <div>
            <label>الفئة</label>
            <select name="category">
              <?php foreach ($CATEGORIES as $c): ?><option value="<?= h($c) ?>"><?= h($c) ?></option><?php endforeach; ?>
            </select>
          </div>
          <div><label>الإيموجي</label><input type="text" name="emoji" value="🍽️"></div>
        </div>
        <label>الوصف</label>
        <textarea name="description"></textarea>
        <label>صورة المنتج (اختياري)</label>
        <input type="file" name="product_image" accept=".jpg,.jpeg,.png,.webp">
        <div class="pgrid">
          <div><label>اسم الحجم الأول</label><input type="text" name="size_label" value="الحصة"></div>
          <div><label>السعر (ر.س)</label><input type="number" step="0.01" min="0" name="size_price" required></div>
        </div>
        <label>السعرات الحرارية</label>
        <input type="text" name="size_cal" placeholder="مثل: 900–1300 سعرة">
        <button class="btn" type="submit">إضافة المنتج</button>
      </form>
    </div>

  <?php else: ?>

    <?php if (!$orders): ?>
      <div class="card">لا توجد طلبات بعد</div>
    <?php endif; ?>
    <?php foreach ($orders as $o): ?>
    <details class="card">
      <summary>
        <span>
          #<?= h($o['order_number']) ?> — <?= h($o['first_name'] . ' ' . $o['last_name']) ?>
          <span class="badge st-<?= h($o['status']) ?>"><?= h($STATUS_LABELS[$o['status']] ?? $o['status']) ?></span>
        </span>
        <span style="font-size:13px;font-weight:900;color:#0095A7"><?= h(number_format((float)$o['total'], 2)) ?> ر.س</span>
      </summary>
      <table style="margin-top:12px">
        <tr><th>الجوال</th><td dir="ltr" style="text-align:right"><?= h($o['phone']) ?></td></tr>
        <tr><th>المدينة</th><td><?= h($o['city']) ?></td></tr>
        <tr><th>العنوان</th><td><?= h($o['address']) ?></td></tr>
        <?php if ($o['notes']): ?><tr><th>ملاحظات</th><td><?= h($o['notes']) ?></td></tr><?php endif; ?>
        <tr><th>الدفع</th><td><?= h($o['payment_method']) ?></td></tr>
        <tr><th>التاريخ</th><td><?= h($o['created_at']) ?></td></tr>
      </table>
      <div class="items-list">
        <?php foreach ($o['items'] as $it): ?>
          <div><?= h($it['product_name']) ?> — <?= h($it['size_label']) ?> × <?= (int)$it['qty'] ?> = <?= h(number_format($it['unit_price'] * $it['qty'], 2)) ?> ر.س</div>
        <?php endforeach; ?>
      </div>
      <form method="post" style="margin-top:14px;display:flex;gap:8px;align-items:center">
        <input type="hidden" name="action" value="update_order_status">
        <input type="hidden" name="active_tab" value="orders">
        <input type="hidden" name="order_id" value="<?= (int)$o['id'] ?>">
        <select name="status" style="margin:0">
          <?php foreach ($STATUS_LABELS as $k => $lbl): ?>
          <option value="<?= h($k) ?>" <?= $o['status'] === $k ? 'selected' : '' ?>><?= h($lbl) ?></option>
          <?php endforeach; ?>
        </select>
        <button class="btn" type="submit">تحديث الحالة</button>
      </form>
    </details>
    <?php endforeach; ?>

  <?php endif; ?>
</div>
</body>
</html>
