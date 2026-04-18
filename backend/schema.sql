CREATE DATABASE IF NOT EXISTS smart_exit_db;
USE smart_exit_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Teacher', 'Parent', 'Security', 'Admin') NOT NULL
);

CREATE TABLE IF NOT EXISTS exit_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    reason TEXT NOT NULL,
    leave_date DATE NOT NULL,
    leave_time TIME NOT NULL,
    status ENUM('Pending', 'Teacher_Approved', 'Parent_Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed an admin user (password format will need to be bcrypt hashed in real life, but we will seed users from app later)
-- Wait, let's just create the tables. User can register.

CREATE TABLE IF NOT EXISTS qr_passes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validity_status ENUM('Valid', 'Used', 'Expired') DEFAULT 'Valid',
    FOREIGN KEY (request_id) REFERENCES exit_requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    qr_id INT NOT NULL,
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('Exit', 'Entry') NOT NULL,
    status ENUM('Success', 'Failed', 'Fraud_Attempt') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (qr_id) REFERENCES qr_passes(id) ON DELETE CASCADE
);
