<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);

$stmt = $pdo->prepare('SELECT * FROM pickup_requests WHERE user_id = ? ORDER BY created_at DESC');
$stmt->execute([$user['id']]);
$rows = $stmt->fetchAll();
json_response(['success' => true, 'data' => $rows]);
