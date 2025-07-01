<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

$conn = new mysqli("localhost", "root", "", "db_global_help");
$stmt = $conn->prepare("UPDATE tbl_account SET fullname=?, username=?, account_id=?, password=? WHERE user_id=?");
$stmt->bind_param("ssssi", $data['fullname'], $data['username'], $data['account_id'], $data['password'], $data['id']);
$stmt->execute();
echo json_encode(["success" => true]);
?>
