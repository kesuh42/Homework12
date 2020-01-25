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

//Function that gives the option menu to the user. Initial call to start the program and recursive calls at the end of an action to keep the program going
async function init() {
    var {action} = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Employees", 
            "View Departments",
            "View Roles",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Remove Employee",
            "Update Employee Role"]
        }
    ])

    if (action === "View All Employees") {
        connection.query("SELECT * from employee a INNER JOIN role b on a.role_id = b.role_id", function(err, res){
            if (err) console.log(err);
            console.table(res);
            init();
        })
    }

    else if (action === "View Departments") {
        connection.query("SELECT * FROM department", function(err, res){
            if (err) console.log(err);
            console.table(res);
            init();
        })
    }

    else if (action === "View Roles") {
        connection.query("SELECT * FROM role a INNER JOIN department b on a.department_id = b.department_id", function(err, res){
            if (err) console.log(err);
            console.table(res);
            init();
        })
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
                message: "Who is the employee's manager? If none, leave blank",
            }
        ])

        if (manager === "") {
            connection.query("SELECT role_id FROM role WHERE ?? = ?",
            [
                "title",
                role
            ],
            function(err, res){
                if (err) console.log(err);
        
                var roleID = res[0].role_id
                insertEmployee(roleID, null)
            }
            )
        }

        else {
        // Deconstruct the inputted manager's name into first and last names
        var nameArray = manager.split(" ")
        var managerFirst = nameArray[0]
        var managerLast = nameArray[1]


        // Find the foreign keys for role and manager using the inputting strings
        connection.query("SELECT role_id FROM role WHERE ?? = ?",
        [
            "title",
            role
        ],
        function(err, res){
            if (err) console.log(err);

            var roleID = res[0].role_id
            connection.query(`SELECT employee_id FROM employee WHERE ?? = ? and ?? = ?`,
            [
                "first_name",
                managerFirst,
                "last_name",
                managerLast
            ],
            function(err, res){
                if (err) console.log(err)
                var managerID = res[0].employee_id
                insertEmployee(roleID, managerID)
            })
        }
        )

    }
        //Function to input all the data into the employee table
        function insertEmployee(roleID, managerID) {
            connection.query("INSERT INTO employee SET ?",
            {
                first_name: firstName,
                last_name: lastName,
                role_id: roleID,
                manager_id: managerID
            },
            function(err, res){
                init()
            })
            console.log("Employee has been added")
        }
    }

    else if (action === "Add Department") {
        //Inquire department information
        var {name} = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the new department's name?",
            }
        ])

        //Input into the department table
        connection.query("INSERT INTO department SET ?",
        {
            name: name
        },
        function(err, res){
            init()
        })
    }

    else if (action === "Add Role") {
        //Inquire role information
        var {title} = await inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the new role's title?",
            }
        ])
        var {salary} = await inquirer.prompt([
            {
                type: "input",
                name: "salary",
                message: "What is the new role's salary?",
            }
        ])
        var {department} = await inquirer.prompt([
            {
                type: "input",
                name: "department",
                message: "To what department does this new role belong?",
            }
        ])

        //Query the department ID
        connection.query("SELECT department_id FROM department WHERE ?? = ?",
        [
            "name",
            department
        ],
        function(err, res){
            if (err) throw err;
            var departmentID = res[0].department_id
            insertRole(title, salary, departmentID)
        })

        //Input into the role table
        function insertRole(title, salary, departmentID){
            connection.query("INSERT INTO role SET ?",
            {
                title: title,
                salary: salary,
                department_ID: departmentID
            },
            function(err, res){
                init()
            })
        }
    }

    else if (action === "Remove Employee") {
        //Inquire the name of the employee to be removed
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
        //Delete that employee, or do nothing if the employee is not found
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
        var {firstName} = await inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is target employee's first name?",
            }
        ])
        var {lastName} = await inquirer.prompt([
            {
                type: "input",
                name: "lastName",
                message: "What is target employee's last name?",
            }
        ])
        var {newRole} = await inquirer.prompt([
            {
                type: "input",
                name: "newRole",
                message: "What is this employee's new role?",
            }
        ])

        connection.query("SELECT role_id FROM role WHERE ?? = ?",
        [
            "title",
            newRole
        ],
        function(err, res){
            if (err) throw err;
            var roleID = res[0].role_id
            updateEmployee(roleID)
        })

        function updateEmployee(roleID){
            connection.query("UPDATE employee SET ? WHERE ? and ?", [
                {
                    role_id: roleID
                },
                {
                    first_name: firstName
                },
                {
                    last_name: lastName
                }
            ],
            function(err, res) {
                if (err) throw err;
                console.log("Employee Updated");
                init()
            })
        }
    }
}

init()