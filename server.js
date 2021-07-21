const mysql = require("mysql");
const inquirer = require('inquirer');
const cTable = require('console.table');
const ListPrompt = require("inquirer/lib/prompts/list");

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',
    password: 'root',

    database: 'mysqlhw'
});

const init = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "funcChoice",
                choices: [
                    'View All Employees',
                    'View All Employees by Department',
                    'View All Employees by Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View All Roles',
                    'Add Role',
                    'Remove Role',
                    'View All Departments',
                    'Add Department',
                    'Remove Department',
                    'done',
                    new inquirer.Separator()
                ]
            }
        ])
        .then((response) => {
             switch(response.funcChoice) {
                case 'View All Employees':
                    empView();
                    break;
                case 'View All Employees by Department':
                    empDepView();
                    break;
                case 'View All Employees by Manager':
                    empManView();
                    break;
                case 'Add Employee':
                    addEmp();
                    break;
                case 'Remove Employee':
                    remEmp();
                    break;
                case 'Update Employee Role':
                    updateEmp();
                    break;
                case 'Update Employee Manager':
                    updateEmpMan();
                    break;
                case 'View All Roles':
                    roleView();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Remove Role':
                    remRole();
                    break;
                case 'View All Departments':
                    depView();
                    break;
                case 'Add Department':
                    addDep();
                    break;
                case 'Remove Department':
                    remDep();
                    break;
                case 'Done':
                    connection.end();
                    break;
             }
            }
        )
}

const empView = () => {
    console.log('Viewing Employees...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

const depView = () => {
    console.log('Viewing Departments...\n');
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

const roleView = () => {
    console.log('Viewing Departments...\n');
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

const addDep = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'depName',
                message: 'What is the Department Name?'
            }
        ])
        .then ((response) => {
            console.log('Adding Department...\n');
            connection.query(`INSERT INTO department(name)
            VALUES('${response.depName}');`, (err, res) => {
                if (err) throw err;
                console.log(res);
    });
    })
}

const addRole = () => {
    depts = [];
    connection.query(`select * from department`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            console.log(res);
            depts.push(res[i].name);
        }
    })

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the Position?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary for this position?'
            },
            {
                type: 'list',
                name: 'roleDepName',
                message: 'Which department is this position in?',
                choices: depts
            }
        ])
        .then ((response) => {
            console.log('Adding Department...\n');
            connection.query(`INSERT INTO role(name)
            VALUES('${response.depName}');`, (err, res) => {
                if (err) throw err;
                console.log(res);
    });
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    init();
})