CREATE DATABASE IF NOT EXISTS clamaboo;
USE clamaboo;

CREATE USER IF NOT EXISTS 'clamaboo_user'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON clamaboo.* TO 'clamaboo_user'@'localhost';
FLUSH PRIVILEGES;