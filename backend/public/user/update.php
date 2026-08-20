<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);
$payload = json_decode(file_get_contents('php://input'), true) ?? [];

$fields = [];
$params = [];

if (isset($payload['name'])) { $fields[] = 'name = ?'; $params[] = trim($payload['name']); }
if (isset($payload['phone'])) { $fields[] = 'phone = ?'; $params[] = trim($payload['phone']); }
if (isset($payload['momo_number'])) { $fields[] = 'momo_number = ?'; $params[] = trim($payload['momo_number']); }
if (isset($payload['address'])) { $fields[] = 'address = ?'; $params[] = trim($payload['address']); }
if (isset($payload['profile_image_url'])) { $fields[] = 'profile_image_url = ?'; $params[] = trim($payload['profile_image_url']); }

if (empty($fields)) {
	json_response(['success' => false, 'error' => 'No fields to update'], 400);
}

$params[] = $user['id'];
$stmt = $pdo->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?');
$stmt->execute($params);

$stmt = $pdo->prepare('SELECT id, name, email, phone, momo_number, address, profile_image_url, created_at, updated_at FROM users WHERE id = ?');
$stmt->execute([$user['id']]);
$updated = $stmt->fetch();
json_response(['success' => true, 'data' => $updated]);
