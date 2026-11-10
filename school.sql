CREATE DATABASE IF NOT EXISTS school;
USE school;
//terminalnpm install express-session bcryptjs//
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

INSERT INTO students (name, course) VALUES
  ('Ana Reyes', 'BSIT'),
  ('Ben Cruz', 'BSCS'),
  ('Carla Diaz', 'BSIS');