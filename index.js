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
        // connection.query("SELECT * FROM employee ORDER BY ", function(err, res){
        //     if (err) console.log(err);
        //     console.table(res);
        //     init();
        // })
    }

    else if (action === "View All Employees By Manager") {

    }

    else if (action === "Add Employee") {
        // Inquire the basic employee information
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
        var {role} = await inquirer.prompt([
            {
                type: "input",
                name: "role",
                message: "What is the employee's role?",
            }
            
        ])
        var {manager} = await inquirer.prompt([
            {
                type: "input",
                name: "manager",
                message: "Who is the employee's manager?",
            }
        ])

        // Deconstruct the inputted manager's name into first and last names
        var nameArray = manager.split()
        var managerFirst = nameArray[0]
        var managerLast = nameArray[1]

        // Find the foreign keys for role and manager using the inputting strings
        var xxx = await connection.query("SELECT role_id FROM role WHERE ?",
        {
            title: role
        },
        function(err, res){
            if (err) throw err;
            // console.log(res[0].role_id)
        }
        )

        console.log(xxx)

        //Input all the data into the employee table

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