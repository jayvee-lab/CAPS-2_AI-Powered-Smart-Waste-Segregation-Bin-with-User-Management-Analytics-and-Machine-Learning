CREATE DATABASE IF NOT EXISTS db_global_help;

USE db_global_help;

CREATE TABLE IF NOT EXISTS tbl_category_totals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  total INT NOT NULL,
  date DATE NOT NULL
);

INSERT INTO tbl_category_totals (category, total, date) VALUES
('glass', 150, '2025-06-17'),
('paper', 320, '2025-06-17'),
('plastic', 210, '2025-06-17'),
('glass', 180, '2025-06-16'),
('paper', 300, '2025-06-16'),
('plastic', 200, '2025-06-16');

