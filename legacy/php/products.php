<?php
/**
 * GET /api/products.php
 * يرجّع كل المنتجات النشطة مع أحجامها وأسعارها بصيغة JSON
 * تستخدمها صفحة المتجر لعرض المنتجات مباشرة من قاعدة البيانات
 */
require __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Method not allowed'], 405);
}

$conn = db();

$products = [];
$res = $conn->query("SELECT id, name_ar, name_en, category, emoji, description, image_path, is_featured, is_new
                      FROM products WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
while ($row = $res->fetch_assoc()) {
    $products[$row['id']] = [
        'id'       => (int)$row['id'],
        'nameAr'   => $row['name_ar'],
        'nameEn'   => $row['name_en'],
        'cat'      => $row['category'],
        'emoji'    => $row['emoji'],
        'desc'     => $row['description'],
        'img'      => $row['image_path'] ? $row['image_path'] : null,
        'featured' => (bool)$row['is_featured'],
        'isNew'    => (bool)$row['is_new'],
        'sizes'    => [],
    ];
}

if ($products) {
    $ids = implode(',', array_map('intval', array_keys($products)));
    $sres = $conn->query("SELECT product_id, label, price, calories_label
                           FROM product_sizes WHERE product_id IN ($ids)
                           ORDER BY product_id ASC, sort_order ASC, id ASC");
    while ($srow = $sres->fetch_assoc()) {
        $pid = (int)$srow['product_id'];
        if (isset($products[$pid])) {
            $products[$pid]['sizes'][] = [
                'l' => $srow['label'],
                'p' => (float)$srow['price'],
                'c' => $srow['calories_label'],
            ];
        }
    }
}

json_out(array_values($products));
