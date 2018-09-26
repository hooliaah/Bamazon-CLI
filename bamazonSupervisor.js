// require node packages
require('dotenv').config() 
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// connection to MySql database
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,

    // get username and password from .env
    user: process.env.DB_USER,
    password: process.env.DB_PASS,

    database: 'bamazonDB'
});

connection.connect(function (err) {
    if (err) throw err;
    // un-comment line below when need to check connection
    // console.log('connected as id ' + connection.threadId + "\n");

    // call function supervisorOptions when connection established
    supervisorOptions();
});

function supervisorOptions() {
    inquirer.prompt([
        {
            type: "checkbox",
            name: "supervisorTask",
            message: "Hi supervisor. What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (supervisor) {
        var task = supervisor.supervisorTask;
        if (task == "View Product Sales by Department") {
            viewDeptSales();
        }
        else if (task == "Create New Department") {
            createDepartment();
        }
    });
}

// function to view department sales
function viewDeptSales() {
    console.log('Product sales by department: ');
    var table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
    });
    // joins data from products and departments, calculates total profit
    // there must be a better way to set up this SELECT to avoid injections...
    // need to use GROUP BY
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, products.product_sales - departments.over_head_costs AS total_profit FROM departments INNER JOIN products ON departments.department_name=products.department_name ORDER BY departments.department_name", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]
            );
        }
        if (err) throw err;
    // display table with results
    console.log(table.toString());
    console.log('\n*******************');
    supervisorOptions();
    })
};

function createDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentNew",
            message: "Enter the NEW department name",
        },
        {
            type: "input",
            name: "overheadNew",
            message: "Enter the NEW department overhead cost"
        }
    ]).then(function (supervisor) {
        connection.query("INSERT INTO departments SET ?",
            {
                department_name: supervisor.departmentNew,
                over_head_costs: supervisor.overheadNew
            },
            function (err, res) {
                if (err) throw err;
                console.log(supervisor.departmentNew + " has been added to the department list");
                console.log('\n*******************');
                supervisorOptions();
            })
    });
}