<?php
$pdo = new PDO("mysql:host=localhost;dbname=db_global_help", "root", "");

$fromDate = $_POST['fromDate'] ?? '';
$toDate = $_POST['toDate'] ?? '';
$category = $_POST['category'] ?? '';

$query = "SELECT category, total, date FROM tbl_category_totals 
          WHERE date BETWEEN :fromDate AND :toDate AND category = :category
          ORDER BY date DESC";

$stmt = $pdo->prepare($query);
$stmt->execute([
  ':fromDate' => $fromDate,
  ':toDate' => $toDate,
  ':category' => $category
]);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($data);
