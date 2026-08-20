<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);
$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) json_response(['success' => false, 'error' => 'Invalid id'], 400);

$stmt = $pdo->prepare('UPDATE pickup_requests SET status = "REJECTED" WHERE id = ? AND user_id = ? AND status = "PENDING"');
$stmt->execute([$id, $user['id']]);

json_response(['success' => true]);
