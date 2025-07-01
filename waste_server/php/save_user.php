<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);


if (!isset($data['fullname'], $data['username'], $data['account_id'], $data['password'])) {
    echo json_encode(["success" => false, "message" => "Incomplete input"]);
    exit;
}


$fullname = $data['fullname'];
$username = $data['username'];
$account_id = $data['account_id'];
$password = $data['password']; 


$conn = new mysqli("localhost", "root", "", "db_global_help");


if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}


$conn->begin_transaction();

try {
    
    $stmt = $conn->prepare("INSERT INTO tbl_account (fullname, username, account_id, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $fullname, $username, $account_id, $password);
    $stmt->execute();
    $new_user_id = $stmt->insert_id;
    $stmt->close();


    $log = $conn->prepare("INSERT INTO tbl_logs (user_id) VALUES (?)");
    $log->bind_param("i", $new_user_id);
    $log->execute();
    $log->close();

    $conn->commit();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
