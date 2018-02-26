-- initial table values

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
(100,"Laptop","Computers",917.63,2),
(272,"Blanket","Kids",65.86,76),
(325,"Frozen","Movies",20.35,19),
(415,"Harry Potter","Books",18.83,4),
(465,"Bandaids","Health",2.87,48),
(530,"Bottle","Baby",8.36,38),
(765,"Pasta Lasagne Fresh","Grocery",3.17,33),
(804,"Lipstick","Beauty",5.12,25),
(805,"Yahtzee","Games",7.23,28),
(924,"Thermometer","Health",83.12,83);

INSERT INTO departments (department_name, over_head_costs)
VALUES
("Computers", 10000),
("Kids", 750),
("Movies", 150),
("Books", 20),
("Health", 200),
("Baby", 600),
("Grocery", 100),
("Beauty", 100),
("Games", 89);