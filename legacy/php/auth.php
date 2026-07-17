<?php
/** يجب استدعاء config.php قبل هذا الملف */

function admin_logged_in(): bool
{
    return !empty($_SESSION['admin_id']);
}

/** استخدمها في بداية أي صفحة أدمن HTML */
function require_admin_page(): void
{
    if (!admin_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

/** استخدمها في بداية أي endpoint يرجّع JSON ويتطلب تسجيل دخول */
function require_admin_api(): void
{
    if (!admin_logged_in()) {
        json_out(['error' => 'يجب تسجيل الدخول'], 401);
    }
}
