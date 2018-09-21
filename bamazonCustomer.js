// require node packages
require('dotenv').config()
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// global variables
var itemToBuy = "";
var quantityToBuy = 0;

// connection to MySql database
var connection = mysql.createConnection({
    // get host from .env
    host: process.env.DB_HOST,
    // use port 3306
    port: 3306,

    // get username and password from .env
    user: process.env.DB_USER,
    password: process.env.DB_PASS,

    // connect to database
    database: 'bamazonDB'
});

connection.connect(function (err) {
    if (err) throw err;
    // un-comment line below when need to check connection
    // console.log('connected as id ' + connection.threadId + "\n");

    // call function showProductList when connection established
    showProductList();
});

// function to show list of available products to purchase
function showProductList() {
    console.log('*******************');
    console.log('\nHere is the current list of items available for purchase: ');
    // create new table
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Price', 'Quantity']
    });

    // get product info from bamazon DB, products table
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        // call whatToBuy function
        whatToBuy();
    })
};

// function to ask the user what they would like to purchase
function whatToBuy() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the Item ID of the item would you like to purchase",
            validate: function (input) {
                if (isNaN(input)) {
                    return "Enter the product number";
                } else {
                    return true;
                }
            }
        }
    ]).then(function (user) {
        itemToBuy = user.itemID;
        // after user input is entered, call checkIfItem function
        checkIfItem();
    });
};

// function to check if valid item #
function checkIfItem() {
    // query bamazon DB for the entered item
    connection.query("SELECT item_id FROM products WHERE item_id=?", [itemToBuy], function (err, res) {
        if (err) throw err;
        // if itemToBuy exists in the databse, call howManyToBuy function
        else if (res[0].item_id == itemToBuy) {
            // call update Quantity function
            howManyToBuy();
        }
        // if item does not exist in database, ask user to enter valid ID and go back to product list
        else {
            console.log("Please enter a valid item ID!");
            console.log('\n*******************');
            showProductList();
        }
    });
}

// function to ask the user how much they would like to purchase
function howManyToBuy() {
    inquirer.prompt([
        {
            type: "input",
            name: "quantityToBuy",
            message: "How many would you like to purchase?",
            validate: function (input) {
                if (isNaN(input)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (user) {
        quantityToBuy = parseInt(user.quantityToBuy);
        // after user input is entered, call checkIfAvailable function
        checkIfAvailable();
    });
};

// function to check if sufficient quantity of item
function checkIfAvailable() {
    // query bamazon DB for the entered item and available quantity
    connection.query("SELECT stock_quantity, product_name, price FROM products WHERE item_id=?", [itemToBuy], function (err, res) {
        if (err) throw err;
        // if quantity entered is higher than quantity available, alert user there is insufficient stock then call showProductList function to start over
        else if (quantityToBuy > parseInt(res[0].stock_quantity)) {
            console.log("Insufficient stock!");
            console.log('\n*******************');
            showProductList();
        } else {
            // if quantity entered is equal or lower than quantity available, alert user of the purchase and total cost
            console.log("Ok, you just purchased " + quantityToBuy + " " + res[0].product_name);
            console.log("The total cost was: $" + (quantityToBuy * res[0].price));
            console.log('\n*******************');
            // call update Quantity function
            updateQuantity();
        }
    });
}

// function to update quantity in MySql
function updateQuantity() {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [
            quantityToBuy,
            itemToBuy
        ],
        function (err, res) {
            if (err) throw err;
            updateProductSale();
        })
};

// function to update product sales
function updateProductSale() {
    // select the item in database
    connection.query("SELECT price, item_id FROM products WHERE item_id =?", [itemToBuy], function (err, res) {
        if (err) throw err;
        // update sales of item in database
        connection.query("UPDATE products SET product_sales=product_sales + ? WHERE item_id=?",
            [
                (parseFloat(res[0].price) * quantityToBuy),
                itemToBuy
            ],
            function (err, res) {
                if (err) throw err;
                showProductList();
            })
    }
    )
}