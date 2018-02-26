-- MySql database schema
DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  item_id INTEGER NOT NULL,
  product_name VARCHAR (100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(13,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(13,2),
  PRIMARY KEY (id)
);


CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100),
over_head_costs DECIMAL(13,2),
PRIMARY KEY (department_id)
);