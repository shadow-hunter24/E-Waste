<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);

// Limit to POST and multipart/form-data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	json_response(['success' => false, 'error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
	json_response(['success' => false, 'error' => 'No file uploaded'], 400);
}

$file = $_FILES['avatar'];

// Basic validation
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$mime = mime_content_type($file['tmp_name']);
if (!isset($allowed[$mime])) {
	json_response(['success' => false, 'error' => 'Invalid image type'], 400);
}

$ext = $allowed[$mime];
$uploadsDir = __DIR__ . '/../uploads/avatars';
if (!is_dir($uploadsDir)) {
	mkdir($uploadsDir, 0775, true);
}

$filename = 'user_' . $user['id'] . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
$destPath = $uploadsDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
	json_response(['success' => false, 'error' => 'Failed to save file'], 500);
}

// Public URL path relative to backend/public
$publicUrl = (isset($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'] : 'http') . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/../uploads/avatars/' . $filename;

// Store relative path for portability
$relativePath = 'uploads/avatars/' . $filename;

$stmt = $pdo->prepare('UPDATE users SET profile_image_url = ? WHERE id = ?');
$stmt->execute([$relativePath, $user['id']]);

$stmt = $pdo->prepare('SELECT id, name, email, phone, momo_number, address, profile_image_url, created_at, updated_at FROM users WHERE id = ?');
$stmt->execute([$user['id']]);
$updated = $stmt->fetch();

json_response(['success' => true, 'data' => ['user' => $updated, 'url' => $publicUrl]]);
?>


