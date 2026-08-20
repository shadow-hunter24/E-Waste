<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);
$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) json_response(['success' => false, 'error' => 'Invalid id'], 400);

$stmt = $pdo->prepare('SELECT * FROM pickup_requests WHERE id = ? AND user_id = ?');
$stmt->execute([$id, $user['id']]);
$request = $stmt->fetch();
if (!$request) json_response(['success' => false, 'error' => 'Request not found'], 404);

$itemStmt = $pdo->prepare('SELECT pri.*, wt.name, wt.unit FROM pickup_request_items pri JOIN waste_types wt ON wt.id = pri.waste_type_id WHERE pri.request_id = ?');
$itemStmt->execute([$id]);
$items = $itemStmt->fetchAll();
$request['items'] = $items;

json_response(['success' => true, 'data' => $request]);
