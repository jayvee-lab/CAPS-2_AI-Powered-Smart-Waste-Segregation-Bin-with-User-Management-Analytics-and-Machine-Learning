<?php
session_start();

$conn = new mysqli("localhost", "root", "", "db_global_help");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM tbl_account WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();


    if ($password === $user['password']) {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];

       
        $log = $conn->prepare("INSERT INTO tbl_logs (user_id) VALUES (?)");
        $log->bind_param("i", $user['user_id']);
        $log->execute();

        
        header("Location: http://192.168.62.121//ken_system/main.html");
        exit();
    } else {
        
        echo "<script>
                alert('Incorrect username or password.');
                window.location.href = 'http://192.168.62.121//ken_system/login.html';
              </script>";
        exit();
    }
} else {
    
    echo "<script>
            alert('Incorrect username or password.');
            window.location.href = 'http://192.168.62.121//ken_system/login.html';
          </script>";
    exit();
}
?>
