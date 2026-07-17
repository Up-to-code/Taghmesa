<?php
require __DIR__ . '/../config.php';
require __DIR__ . '/includes/auth.php';
require_admin_page();

$msg = '';
$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current = (string)($_POST['current_password'] ?? '');
    $new1 = (string)($_POST['new_password'] ?? '');
    $new2 = (string)($_POST['new_password2'] ?? '');

    $stmt = db()->prepare("SELECT password_hash FROM admin_users WHERE id = ?");
    $stmt->bind_param('i', $_SESSION['admin_id']);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();

    if (!$row || !password_verify($current, $row['password_hash'])) {
        $err = 'كلمة المرور الحالية غير صحيحة';
    } elseif (strlen($new1) < 8) {
        $err = 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل';
    } elseif ($new1 !== $new2) {
        $err = 'كلمة المرور الجديدة غير متطابقة';
    } else {
        $hash = password_hash($new1, PASSWORD_DEFAULT);
        $u = db()->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
        $u->bind_param('si', $hash, $_SESSION['admin_id']);
        $u->execute();
        $msg = 'تم تغيير كلمة المرور بنجاح';
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>تغيير كلمة المرور</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;background:#f3f6f7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.box{background:#fff;border-radius:20px;padding:32px;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,.08)}
h1{font-size:18px;font-weight:900;margin-bottom:20px;color:#263033}
label{color:#6a7d82;font-size:12px;font-weight:800;display:block;margin-bottom:6px}
input{width:100%;border:1.5px solid #dde8ea;border-radius:12px;padding:11px 14px;font-family:'Tajawal',sans-serif;font-size:14px;margin-bottom:14px;outline:none;direction:rtl}
button{width:100%;background:#0095A7;color:#fff;border:none;border-radius:12px;padding:12px;font-family:'Tajawal',sans-serif;font-size:14px;font-weight:800;cursor:pointer}
.msg{background:#e8faf4;color:#1a7a4e;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px}
.err{background:#fdeeee;color:#c0392b;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:14px}
a{display:block;text-align:center;margin-top:14px;color:#0095A7;font-size:13px;text-decoration:none}
</style>
</head>
<body>
<form class="box" method="post">
  <h1>تغيير كلمة المرور</h1>
  <?php if ($msg): ?><div class="msg"><?= htmlspecialchars($msg) ?></div><?php endif; ?>
  <?php if ($err): ?><div class="err"><?= htmlspecialchars($err) ?></div><?php endif; ?>
  <label>كلمة المرور الحالية</label>
  <input type="password" name="current_password" required>
  <label>كلمة المرور الجديدة</label>
  <input type="password" name="new_password" required minlength="8">
  <label>تأكيد كلمة المرور الجديدة</label>
  <input type="password" name="new_password2" required minlength="8">
  <button type="submit">حفظ</button>
  <a href="dashboard.php">رجوع للوحة التحكم</a>
</form>
</body>
</html>
