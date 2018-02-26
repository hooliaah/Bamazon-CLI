// require node packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// connection to MySql database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // enter your username and password
    user: '********',
    password: '********',

    database: 'bamazonDB'
});

connection.connect(function (err) {
    if (err) throw err;
    // un-comment line below when need to check connection
    // console.log('connected as id ' + connection.threadId + "\n");

    // call function managerOptions when connection established
    managerOptions();
});

// function to prompt manager with options on what to do next
function managerOptions() {
    inquirer.prompt([
        {
            type: "checkbox",
            name: "managerTask",
            message: "Hi manager. What would you like to do?",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add New Product"]
        }
    ]).then(function (manager) {
        var task = manager.managerTask;
        if (task == "View products for sale") {
            viewProducts();
        }
        else if (task == "View low inventory") {
            lowinventory();
        }
        else if (task == "Add to inventory") {
            addToInvetory();
        }
        else if (task == "Add New Product") {
            addProduct();
        }
    });
};

// function to view current inventory
function viewProducts() {
    console.log('Here is the current inventory: ');
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Price', 'Quantity']
    });
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        managerOptions();
    })
};

// function to view low inventory
function lowinventory() {
    console.log("Low inventory items: ");
    var tableLow = new Table({
        head: ['Product Name', 'Quantity']
    });
    connection.query("SELECT product_name, stock_quantity FROM products WHERE stock_quantity <= 5", function (err, res) {
        for (var j = 0; j < res.length; j++) {
            tableLow.push(
                [res[j].product_name, res[j].stock_quantity]
            );
        }
        console.log(tableLow.toString());
        managerOptions();
    })
};

// function to increase inventory for existing item
function addToInvetory() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the Item ID of the item to be updated",
            validate: function (input) {
                if (isNaN(input)) {
                    return "Enter the product number";
                } else {
                    return true;
                }
            }
            // future development: validate against list of product item_ids
        },
        {
            type: "input",
            name: "quantityToUpdate",
            message: "How many should be added to inventory?",
            validate: function (input) {
                if (isNaN(input)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (manager) {
        var itemToUpdate = manager.itemID;
        var quantityToUpdate = parseInt(manager.quantityToUpdate);

        connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
            [
                quantityToUpdate,
                itemToUpdate
            ],
            function (err, res) {
                if (err) throw err;
                console.log("Quantity of " + itemToUpdate + " has been updated");
                console.log('\n*******************');
                managerOptions();
            })

    });
};

// function to add a new item to inventory
function addProduct() {
    // future development: add validation for all prompts
    inquirer.prompt([
        {
            type: "input",
            name: "itemIdNew",
            message: "Enter the NEW Item ID",
            validate: function (input) {
                if (isNaN(input)) {
                    return "Enter a number";
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "productNew",
            message: "Enter the NEW product name"
        },
        {
            type: "input",
            name: "departmentNew",
            message: "Enter the NEW department"
        },
        {
            type: "input",
            name: "priceNew",
            message: "Enter the NEW product price"
        },
        {
            type: "input",
            name: "productQuantity",
            message: "Enter the NEW product stock quantity",
            validate: function (input) {
                if (isNaN(input)) {
                    return "Enter a number";
                } else {
                    return true;
                }
            }
        }
    ]).then(function (manager) {
        connection.query("INSERT INTO products SET ?",
            {
                item_id: manager.itemIdNew,
                product_name: manager.productNew,
                department_name: manager.departmentNew,
                price: manager.priceNew,
                stock_quantity: manager.productQuantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(manager.productNew + " has been added to the product list");
                console.log('\n*******************');
                managerOptions();
            })

    });
};