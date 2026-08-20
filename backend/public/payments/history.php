<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);

$stmt = $pdo->prepare('SELECT p.*, r.pickup_address, r.created_at AS request_created_at FROM payments p JOIN pickup_requests r ON r.id = p.request_id WHERE r.user_id = ? ORDER BY p.created_at DESC');
$stmt->execute([$user['id']]);
$rows = $stmt->fetchAll();

json_response(['success' => true, 'data' => $rows]);
