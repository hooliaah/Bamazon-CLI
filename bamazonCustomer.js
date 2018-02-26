// require node packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// global variables
var itemToBuy = "";
var quantityToBuy = 0;

// connection to MySql database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // enter your username and password
    user: '****',
    password: '****',

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
    console.log('Here is the current list of items available for purchase: ');
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
        whatToBuy();
    })
};

// function to ask the user what and how much they would like to purchase
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
        },
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
        itemToBuy = user.itemID;
        quantityToBuy = parseInt(user.quantityToBuy);
        checkIfAvailable();
    });
};

// function to check if sufficient quantity of item
function checkIfAvailable() {
    connection.query("SELECT stock_quantity, product_name, price FROM products WHERE item_id=?", [itemToBuy], function (err, res) {
        if (err) throw err;
        else if (quantityToBuy > parseInt(res[0].stock_quantity)) {
            console.log("Insufficient stock!");
            console.log('\n*******************');
            showProductList();
        } else {
            console.log("Ok, you just purchased " + quantityToBuy + " " + res[0].product_name);
            console.log("The total cost was: $" + (quantityToBuy * res[0].price));
            console.log('\n*******************');
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
// function update product sales
function updateProductSale() {
    connection.query("SELECT price, item_id FROM products WHERE item_id =?", [itemToBuy], function (err, res) {
        if (err) throw err;
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