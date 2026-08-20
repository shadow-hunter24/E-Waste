<?php
require_once __DIR__ . '/../config.php';

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$name = trim($payload['name'] ?? '');
$email = strtolower(trim($payload['email'] ?? ''));
$password = $payload['password'] ?? '';
$phone = trim($payload['phone'] ?? '');
$momo = trim($payload['momo_number'] ?? '');
$address = trim($payload['address'] ?? '');

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6 || !$phone || !$momo) {
	json_response(['success' => false, 'error' => 'Invalid input'], 400);
}

try {
	$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
	$stmt->execute([$email]);
	if ($stmt->fetch()) {
		json_response(['success' => false, 'error' => 'Email already registered'], 409);
	}

	$hash = password_hash($password, PASSWORD_DEFAULT);
	$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, phone, momo_number, address) VALUES (?, ?, ?, ?, ?, ?)');
	$stmt->execute([$name, $email, $hash, $phone, $momo, $address ?: null]);
	$user_id = (int)$pdo->lastInsertId();

	$token = issue_token($pdo, $user_id);
	
	$stmt = $pdo->prepare('SELECT id, name, email, phone, momo_number, address, profile_image_url, created_at, updated_at FROM users WHERE id = ?');
	$stmt->execute([$user_id]);
	$user = $stmt->fetch();

	json_response(['success' => true, 'data' => ['user' => $user, 'token' => $token]]);
} catch (Throwable $e) {
	json_response(['success' => false, 'error' => 'Registration failed'], 500);
}
