var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "beethoven",
    database: "employeeTracker_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);;
  });

function addDepartment(name) {
    console.log("Adding a new department")
    connection.query("INSERT INTO department SET ?",
    {
        name: name
    },
    function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows)
    }
)}
 
async function init() {
    var {action} = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Employees", 
            "View All Employees By Department", 
            "View All Employees By Manager", 
            "Add Employee",
            "Remove Employee", 
            "Update Employee Role", 
            "Update Employee Manager"]
        }
    ])

    if (action === "View All Employees") {
        connection.query("SELECT * FROM employee", function(err, res){
            if (err) console.log(err);
            console.table(res);
            init();
        })
    }

    else if (action === "View All Employees By Department") {

    }

    else if (action === "View All Employees By Manager") {

    }

    else if (action === "Add Employee") {
        var {firstName} = await inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
            }
        ])
        var {lastName} = await inquirer.prompt([
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
            }
        ])
        connection.query("INSERT INTO employee SET ?",
        {
            first_name: firstName,
            last_name: lastName
        },
        function(err, res){
            init()
        })
        console.log("Employee has been added")
    }

    else if (action === "Remove Employee") {
        var {firstName} = await inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
            }
        ])
        var {lastName} = await inquirer.prompt([
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
            }
        ])
        connection.query("DELETE FROM employee WHERE ? and ?", 
        [{
            first_name: firstName,
        },
        {
            last_name: lastName
        }],
        function(err, res){
            if (err) throw err;

            if (res.affectedRows === 0) {
                console.log("Specified employee was not found, please try again")
                init()
            }

            else {
                console.log("Employee has been removed")
                init();
            }
        })

    }

    else if (action === "Update Employee Role") {

    }

    else if (action === "Update Employee Manager") {

    }
}

init()