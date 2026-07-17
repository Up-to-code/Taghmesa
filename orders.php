<?php
/**
 * /api/orders.php
 *  - POST : إنشاء طلب جديد (يستخدمها موقع المتجر عند "تأكيد الطلب") — عام، بدون تسجيل دخول
 *  - GET  : عرض كل الطلبات — للأدمن فقط (يتطلب تسجيل دخول من admin/login.php)
 */
require __DIR__ . '/../config.php';
require __DIR__ . '/../admin/includes/auth.php';

$conn = db();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();

    $firstName = trim($data['firstName'] ?? '');
    $lastName  = trim($data['lastName'] ?? '');
    $phone     = trim($data['phone'] ?? '');
    $city      = trim($data['city'] ?? '');
    $address   = trim($data['address'] ?? '');
    $notes     = trim($data['notes'] ?? '');
    $payment   = trim($data['paymentMethod'] ?? 'cod');
    $items     = is_array($data['items'] ?? null) ? $data['items'] : [];

    if ($firstName === '' || $lastName === '' || $phone === '' || $city === '' || $address === '' || !$items) {
        json_out(['error' => 'يرجى تعبئة جميع الحقول المطلوبة واختيار منتجات في السلة'], 422);
    }

    // نعيد حساب الأسعار من قاعدة البيانات (لا نثق بالأسعار المرسلة من المتصفح)
    $productIds = array_unique(array_map(fn($i) => (int)($i['pid'] ?? 0), $items));
    $productIds = array_filter($productIds);
    if (!$productIds) {
        json_out(['error' => 'عناصر السلة غير صالحة'], 422);
    }
    $idsSql = implode(',', $productIds);
    $priceMap = []; // pid => ['label'=>price,...]
    $nameMap  = [];
    $sres = $conn->query("SELECT p.id AS pid, p.name_ar, s.label, s.price
                           FROM product_sizes s JOIN products p ON p.id = s.product_id
                           WHERE p.id IN ($idsSql) AND p.is_active = 1");
    while ($row = $sres->fetch_assoc()) {
        $priceMap[$row['pid']][$row['label']] = (float)$row['price'];
        $nameMap[$row['pid']] = $row['name_ar'];
    }

    $subtotal = 0.0;
    $validItems = [];
    foreach ($items as $item) {
        $pid   = (int)($item['pid'] ?? 0);
        $label = trim($item['varLbl'] ?? '');
        $qty   = max(1, (int)($item['qty'] ?? 1));
        if (!isset($priceMap[$pid][$label])) {
            continue; // نتجاهل أي عنصر غير موجود فعلياً في قاعدة البيانات
        }
        $unitPrice = $priceMap[$pid][$label];
        $subtotal += $unitPrice * $qty;
        $validItems[] = [
            'pid' => $pid, 'name' => $nameMap[$pid], 'label' => $label,
            'price' => $unitPrice, 'qty' => $qty,
        ];
    }
    if (!$validItems) {
        json_out(['error' => 'لم يتم التحقق من أي عنصر في السلة'], 422);
    }

    $deliveryFee = defined('DELIVERY_FEE') ? (float)DELIVERY_FEE : 0.0;
    $total = $subtotal + $deliveryFee;
    $orderNumber = 'TG-' . random_int(10000, 99999);

    $conn->begin_transaction();
    try {
        $stmt = $conn->prepare("INSERT INTO orders
            (order_number, first_name, last_name, phone, city, address, notes, payment_method, subtotal, delivery_fee, total, status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,'new')");
        $stmt->bind_param('ssssssssddd', $orderNumber, $firstName, $lastName, $phone, $city, $address, $notes, $payment, $subtotal, $deliveryFee, $total);
        $stmt->execute();
        $orderId = $conn->insert_id;
        $stmt->close();

        $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, size_label, unit_price, qty)
                                     VALUES (?,?,?,?,?,?)");
        foreach ($validItems as $vi) {
            $itemStmt->bind_param('iissdi', $orderId, $vi['pid'], $vi['name'], $vi['label'], $vi['price'], $vi['qty']);
            $itemStmt->execute();
        }
        $itemStmt->close();

        $conn->commit();
    } catch (Throwable $e) {
        $conn->rollback();
        error_log('order insert failed: ' . $e->getMessage());
        json_out(['error' => 'تعذّر حفظ الطلب، حاول مرة أخرى'], 500);
    }

    json_out([
        'orderNumber' => $orderNumber,
        'subtotal' => $subtotal,
        'deliveryFee' => $deliveryFee,
        'total' => $total,
    ], 201);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_admin_api();

    $orders = [];
    $res = $conn->query("SELECT id, order_number, first_name, last_name, phone, city, address, notes,
                                 payment_method, subtotal, delivery_fee, total, status, created_at
                          FROM orders ORDER BY created_at DESC LIMIT 200");
    while ($row = $res->fetch_assoc()) {
        $orders[$row['id']] = $row + ['items' => []];
    }
    if ($orders) {
        $ids = implode(',', array_map('intval', array_keys($orders)));
        $ires = $conn->query("SELECT order_id, product_name, size_label, unit_price, qty
                               FROM order_items WHERE order_id IN ($ids)");
        while ($irow = $ires->fetch_assoc()) {
            $orders[$irow['order_id']]['items'][] = $irow;
        }
    }
    json_out(array_values($orders));
}

json_out(['error' => 'Method not allowed'], 405);
