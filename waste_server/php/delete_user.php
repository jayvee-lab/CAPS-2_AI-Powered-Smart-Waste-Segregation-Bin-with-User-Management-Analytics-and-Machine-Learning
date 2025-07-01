<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

$conn = new mysqli("localhost", "root", "", "db_global_help");
$stmt = $conn->prepare("DELETE FROM tbl_account WHERE user_id=?");
$stmt->bind_param("i", $data['id']);
$stmt->execute();
echo json_encode(["success" => true]);
?>
