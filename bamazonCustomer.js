var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '********',
    database: 'bamazonDB'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + "\n");
    showProductList();
});

function showProductList() {
    console.log('Here is the current list of items available for purchase: ');
    var table = new Table({
        head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity']
    });

    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        whatToBuy();
    })
};

function whatToBuy() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemToBuy",
            message: "Enter the Item ID of the item would you like to purchase",
            validate: function(input) {
                if (isNaN(input)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (user) {

        console.log('Okay, you are about to buy: ' + user.itemToBuy);
        connection.end();

    });
};

//   connection.end();