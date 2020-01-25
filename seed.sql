drop database if exists employeeTracker_db;
create database employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department(
	department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role(
	role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id),
    PRIMARY KEY (role_id)
);

CREATE TABLE employee(
	employee_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id),
    PRIMARY KEY (employee_id)
);

-- Insert some initial values

INSERT INTO department(name)
VALUES ("Management");

INSERT INTO department(name)
VALUES ("Tech Support");

INSERT INTO role(title, salary, department_id)
VALUES ("Manager", "100000", 1);

INSERT INTO role(title, salary, department_id)
VALUES ("Coder", "100", 2);

-- I'm the boss

INSERT INTO employee(first_name, last_name, role_id)
VALUES ("Kevin", "Suh", 1);