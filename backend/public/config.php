<?php
// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(200);
	exit;
}

// JSON helper
function json_response($data, $status = 200) {
	http_response_code($status);
	header('Content-Type: application/json');
	echo json_encode($data);
	exit;
}

// DB connection
$DB_HOST = '127.0.0.1';
$DB_NAME = 'ewastedb';
$DB_USER = 'root';
$DB_PASS = '';

try {
	$pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	]);
} catch (Throwable $e) {
	json_response(['success' => false, 'error' => 'Database connection failed'], 500);
}

// Auth helpers
function get_bearer_token() {
	$headers = getallheaders();
	foreach ($headers as $key => $value) {
		if (strtolower($key) === 'authorization') {
			$parts = explode(' ', $value);
			if (count($parts) === 2 && strtolower($parts[0]) === 'bearer') {
				return $parts[1];
			}
		}
	}
	return null;
}

function issue_token($pdo, $user_id) {
	$token = bin2hex(random_bytes(32));
	$expires = null; // or date('Y-m-d H:i:s', time() + 86400)
	$stmt = $pdo->prepare('INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)');
	$stmt->execute([$user_id, $token, $expires]);
	return $token;
}

function require_auth($pdo) {
	$token = get_bearer_token();
	if (!$token) json_response(['success' => false, 'error' => 'Unauthorized'], 401);
	$stmt = $pdo->prepare('SELECT u.* FROM auth_tokens t JOIN users u ON u.id = t.user_id WHERE t.token = ?');
	$stmt->execute([$token]);
	$user = $stmt->fetch();
	if (!$user) json_response(['success' => false, 'error' => 'Invalid token'], 401);
	return $user;
}
?>
