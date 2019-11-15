DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("vanilla", "ICE", 10.20,10);