<?php
$conn = new mysqli("localhost", "root", "", "db_global_help");
$result = $conn->query("SELECT * FROM tbl_account");
$users = [];

while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}
echo json_encode($users);
?>
