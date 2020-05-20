DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

UPDATE products SET stock_quantity = 5 WHERE item_id = 3;

SELECT * FROM products;

ALTER USER 'root'@'localhost' IDENTIFIED BY 'blappers';

DROP DATABASE IF EXISTS chirpy;
CREATE database chirpy;

USE chirpy;