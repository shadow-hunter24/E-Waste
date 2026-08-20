<?php
require_once __DIR__ . '/../config.php';

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$email = strtolower(trim($payload['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	json_response(['success' => false, 'error' => 'Invalid email'], 400);
}

// In production: generate token, store, and send email link
json_response(['success' => true, 'data' => ['message' => 'Password reset email sent']]);
