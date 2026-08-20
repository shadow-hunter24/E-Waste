<?php
require_once __DIR__ . '/config.php';

$stmt = $pdo->query('SELECT id, name, description, price_per_unit, unit, category, image_url FROM waste_types ORDER BY id ASC');
$rows = $stmt->fetchAll();
json_response(['success' => true, 'data' => $rows]);
