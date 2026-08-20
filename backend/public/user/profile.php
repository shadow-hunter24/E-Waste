<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);
$stmt = $pdo->prepare('SELECT id, name, email, phone, momo_number, address, profile_image_url, created_at, updated_at FROM users WHERE id = ?');
$stmt->execute([$user['id']]);
$out = $stmt->fetch();
json_response(['success' => true, 'data' => $out]);
