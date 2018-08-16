# Bamazon-CLI
Bamazon-CLI is a node app that simulates an online store with 3 user roles: customer, manager, and supervisor. MySQL is used to store and update inventory data. 

# Getting Started
Download this repo to try it out locally. 
1. Create a .env file inside the root folder. 
2. In the .env file, add the following environment-specific variables on new lines with your own MySQL credentials: DB_HOST=localhost, DB_USER=*****, and DB_PASS=****.
3. Use the schema.sql file to create the database using your MySQL editor of choice.
4. Use the seeds.sql file to seed the new Bamazon database.
5. npm install.
6. Ensure your MySql server is running.
7. Choose which role you want (bamazonCustomer.js, bamazonManager.js, or bamazonSupervisor.js) and start the file using the node command. Make selections and follow along!

# Technologies Used
MySql</br>
Node</br>
Inquirer</br>
JavaScript</br>

# Future Development
Add validations to check item # and product in Manager and Supervisor roles