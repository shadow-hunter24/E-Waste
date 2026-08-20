<?php
require_once __DIR__ . '/../config.php';

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$email = strtolower(trim($payload['email'] ?? ''));
$password = $payload['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$password) {
	json_response(['success' => false, 'error' => 'Invalid credentials'], 400);
}

try {
	$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
	$stmt->execute([$email]);
	$user = $stmt->fetch();
	if (!$user || !password_verify($password, $user['password_hash'])) {
		json_response(['success' => false, 'error' => 'Invalid credentials'], 401);
	}

	$token = issue_token($pdo, (int)$user['id']);

	$out = $user;
	unset($out['password_hash']);
	json_response(['success' => true, 'data' => ['user' => $out, 'token' => $token]]);
} catch (Throwable $e) {
	json_response(['success' => false, 'error' => 'Login failed'], 500);
}
