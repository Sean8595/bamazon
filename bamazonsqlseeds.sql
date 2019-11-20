DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES ("Ice Cream", "Food", 10.20,10);
INSERT INTO products (product_name, department_name, price,stock_quantity) 
VALUES ("Shampoo", "Baths", 4.10,10);
INSERT INTO products (product_name, department_name, price,stock_quantity) 
VALUES ("Banana", "Food", 10.00,10);
INSERT INTO products (product_name, department_name, price,stock_quantity) 
VALUES ("Tacos", "Food", 1.00,10);
INSERT INTO products (product_name, department_name, price,stock_quantity) 
VALUES ("Overwatch 2", "Videogames", 40, 10);