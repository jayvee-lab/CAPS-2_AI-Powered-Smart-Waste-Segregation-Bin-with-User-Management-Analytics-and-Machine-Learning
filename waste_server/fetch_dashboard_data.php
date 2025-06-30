<?php
$host = 'localhost';
$db = 'db_global_help';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


$userResult = $conn->query("SELECT COUNT(*) AS total_users FROM tbl_account");
$userCount = $userResult->fetch_assoc()['total_users'];

$totalsResult = $conn->query("
  SELECT category, SUM(total) as total
  FROM tbl_category_totals
  GROUP BY category
");

$totals = [];
while ($row = $totalsResult->fetch_assoc()) {
  $totals[strtolower($row['category'])] = (int)$row['total'];
}

$chartResult = $conn->query("
  SELECT date, category, SUM(total) AS total
  FROM tbl_category_totals
  GROUP BY date, category
  ORDER BY date ASC
");

$chartData = [];
while ($row = $chartResult->fetch_assoc()) {
  $date = $row['date'];
  $cat = strtolower($row['category']);
  $chartData[$date][$cat] = (int)$row['total'];
}

$labels = array_keys($chartData);
$glass = $plastic = $paper = $totalAll = [];

foreach ($labels as $date) {
  $g = $chartData[$date]['glass'] ?? 0;
  $p = $chartData[$date]['plastic'] ?? 0;
  $pa = $chartData[$date]['paper'] ?? 0;

  $glass[] = $g;
  $plastic[] = $p;
  $paper[] = $pa;
  $totalAll[] = $g + $p + $pa;
}

echo json_encode([
  'total_users' => $userCount,
  'totals' => $totals,
  'chart' => [
    'labels' => $labels,
    'glass' => $glass,
    'plastic' => $plastic,
    'paper' => $paper,
    'total_all' => $totalAll 
  ]
]);
?>
