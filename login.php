<?php
require __DIR__ . '/../config.php';
require __DIR__ . '/includes/auth.php';

$error = '';

if (admin_logged_in()) {
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = (string)($_POST['password'] ?? '');

    $stmt = db()->prepare("SELECT id, password_hash FROM admin_users WHERE username = ? LIMIT 1");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    if ($row && password_verify($password, $row['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int)$row['id'];
        $_SESSION['admin_username'] = $username;
        header('Location: dashboard.php');
        exit;
    }
    $error = 'اسم المستخدم أو كلمة المرور غير صحيحة';
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>تسجيل الدخول — لوحة تحكم تغميسة</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;background:#0e1a1d;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.box{background:#152227;border-radius:20px;padding:36px 32px;width:100%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
h1{color:#fff;font-size:20px;font-weight:900;margin-bottom:6px;text-align:center}
p.sub{color:#8fb0b6;font-size:13px;text-align:center;margin-bottom:26px}
label{color:#93acb1;font-size:12px;font-weight:800;display:block;margin-bottom:6px}
input{width:100%;background:#0e1a1d;border:1.5px solid #243338;border-radius:12px;padding:11px 14px;color:#eaf3f4;font-family:'Tajawal',sans-serif;font-size:14px;margin-bottom:16px;outline:none;direction:rtl}
input:focus{border-color:#12b3c4}
button{width:100%;background:#12b3c4;color:#fff;border:none;border-radius:12px;padding:13px;font-family:'Tajawal',sans-serif;font-size:15px;font-weight:800;cursor:pointer}
button:hover{background:#0d8f9c}
.err{background:#3a1f22;color:#ff9a9a;border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:16px;text-align:center}
</style>
</head>
<body>
  <form class="box" method="post">
    <h1>لوحة تحكم تغميسة</h1>
    <p class="sub">سجّل دخولك لإدارة المنتجات والطلبات</p>
    <?php if ($error): ?><div class="err"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <label>اسم المستخدم</label>
    <input type="text" name="username" required autofocus>
    <label>كلمة المرور</label>
    <input type="password" name="password" required>
    <button type="submit">دخول</button>
  </form>
</body>
</html>
