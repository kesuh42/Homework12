var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "loaclhost",

    port: 3306,

    user: "root",

    password: "beethoven",
    database: "employeeTracker_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.end();
  });

