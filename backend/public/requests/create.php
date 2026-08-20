<?php
require_once __DIR__ . '/../config.php';

$user = require_auth($pdo);
$payload = json_decode(file_get_contents('php://input'), true) ?? [];

$pickup_address = trim($payload['pickup_address'] ?? '');
$landmark = trim($payload['landmark'] ?? '');
$payment_method = $payload['payment_method'] ?? '';
$items = $payload['items'] ?? [];
$notes = trim($payload['notes'] ?? '');

if (!$pickup_address || !in_array($payment_method, ['MOMO','CASH'], true) || empty($items)) {
	json_response(['success' => false, 'error' => 'Invalid input'], 400);
}

try {
	$pdo->beginTransaction();

	// Create request with zero amount initially
	$stmt = $pdo->prepare('INSERT INTO pickup_requests (user_id, pickup_address, landmark, total_amount, payment_method, notes) VALUES (?, ?, ?, 0, ?, ?)');
	$stmt->execute([$user['id'], $pickup_address, $landmark ?: null, $payment_method, $notes ?: null]);
	$request_id = (int)$pdo->lastInsertId();

	$total = 0.0;
	$itemStmt = $pdo->prepare('INSERT INTO pickup_request_items (request_id, waste_type_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)');
	$priceStmt = $pdo->prepare('SELECT price_per_unit FROM waste_types WHERE id = ?');

	foreach ($items as $it) {
		$waste_type_id = (int)($it['waste_type_id'] ?? 0);
		$quantity = (float)($it['quantity'] ?? 0);
		if ($waste_type_id <= 0 || $quantity <= 0) continue;
		$priceStmt->execute([$waste_type_id]);
		$row = $priceStmt->fetch();
		if (!$row) continue;
		$unit_price = (float)$row['price_per_unit'];
		$line_total = round($unit_price * $quantity, 2);
		$total += $line_total;
		$itemStmt->execute([$request_id, $waste_type_id, $quantity, $unit_price, $line_total]);
	}

	$stmt = $pdo->prepare('UPDATE pickup_requests SET total_amount = ? WHERE id = ?');
	$stmt->execute([round($total, 2), $request_id]);

	$pdo->commit();

	$stmt = $pdo->prepare('SELECT * FROM pickup_requests WHERE id = ?');
	$stmt->execute([$request_id]);
	$request = $stmt->fetch();

	json_response(['success' => true, 'data' => $request]);
} catch (Throwable $e) {
	$pdo->rollBack();
	json_response(['success' => false, 'error' => 'Unable to create request'], 500);
}
