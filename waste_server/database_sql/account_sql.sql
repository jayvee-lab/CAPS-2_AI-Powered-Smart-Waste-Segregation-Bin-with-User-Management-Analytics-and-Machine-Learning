-- Create the database
CREATE DATABASE db_global_help;

-- Use the newly created database
USE db_global_help;

-- Create the tbl_account table
CREATE TABLE tbl_account (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    account_id VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    activity TEXT
);

-- Create the tbl_logs table
CREATE TABLE tbl_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES tbl_account(user_id) ON DELETE CASCADE
);
