<?php
/**
 * ملف الإعدادات — عدّل القيم الأربعة بالأسفل فقط بمعلومات قاعدة
 * البيانات اللي أنشأتها من لوحة تحكم الاستضافة (cPanel > MySQL Databases).
 * لا تغيّر أي شي آخر في هذا الملف.
 */

// بيانات الاتصال بقاعدة البيانات (MySQL)
define('DB_HOST', 'localhost');           // غالباً تبقى localhost
define('DB_NAME', 'your_cpanel_dbname');  // اسم قاعدة البيانات كامل (يشمل بادئة الحساب مثل user_taghmesa)
define('DB_USER', 'your_cpanel_dbuser');  // مستخدم قاعدة البيانات
define('DB_PASS', 'your_cpanel_dbpass');  // كلمة مرور قاعدة البيانات

// رابط رسوم التوصيل الثابت (اختياري، بالريال السعودي)
define('DELIVERY_FEE', 0.00);

// ------------- لا تعدّل تحت هذا السطر -------------

error_reporting(E_ALL);
ini_set('display_errors', '0'); // ما نطلع أخطاء PHP للزوار، بس نسجلها
ini_set('log_errors', '1');

date_default_timezone_set('Asia/Riyadh');

session_set_cookie_params([
    'lifetime' => 60 * 60 * 8,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
]);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function db(): mysqli
{
    static $conn = null;
    if ($conn === null) {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        try {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $conn->set_charset('utf8mb4');
        } catch (Throwable $e) {
            error_log('DB connection failed: ' . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'تعذّر الاتصال بقاعدة البيانات. تأكد من إعدادات config.php'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    return $conn;
}

function json_out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
