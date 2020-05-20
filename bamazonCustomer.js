var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "blappers",
    database: "bamazon"
});

var productIdArray = [];

function connectToServer(connection){
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Thread connection ID: " + connection.threadId);
        selectAll();
    });
}

function selectAll(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(i=0;i<res.length;i++){
            productIdArray.push(res[i].item_id.toString());
            formatQuery(res,i);
        }
        buy();
    });
}

function formatQuery(query, index){
    console.log("\nProduct ID: " + query[index].item_id + "\nProduct name: " + query[index].product_name +
                "\nPrice: " + query[index].price + " Galactic Credits\nIn Stock: " + query[index].stock_quantity + "\n");
}

function buy(){
    inquirer.prompt([
        {
            type: "list",
            message: "Select the product ID for the product you would like to buy:",
            choices: productIdArray,
            name: "selection"
        },
        {
            type: "number",
            name: "buyNum",
            message: "How many would you like to buy?"
        }]).then(function(inquirerResponse) {
            console.log(inquirerResponse.buyNum);
            if(isNaN(inquirerResponse.buyNum) || inquirerResponse.buyNum <= 0 || !Number.isInteger(inquirerResponse.buyNum)){
                console.log("You must enter a whole number greater than zero to purchase items!")
            }
            else{
                connection.query("SELECT * FROM products WHERE item_id = ?",[inquirerResponse.selection], function(err, res) {
                    if (err) throw err;
                    console.log("\nPurchase amount: " + inquirerResponse.buyNum);
                    console.log("Price per unit: ₾" + res[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    if(res[0].stock_quantity >= inquirerResponse.buyNum){
                        var updatedStock = res[0].stock_quantity - inquirerResponse.buyNum;
                        var purchasePrice = res[0].price * inquirerResponse.buyNum;
                        connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[updatedStock, inquirerResponse.selection], function(err, res) {
                            if (err) throw err;
                        });
                        console.log("\n|PURCHASE SUCCESSFUL|");
                        console.log("You have automatically been charged ₾" + 
                                    purchasePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
                                    ". \nThank you for your purchase.");
                    } else {
                        console.log("Sorry, there is not enough product to fulfill your order.");
                    }
                    connection.end();
                });
            }
    });
}

connectToServer(connection);