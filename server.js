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
                    // 'View All Employees by Department',
                    // 'View All Employees by Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee Role',
                    // 'Update Employee Manager',
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
                // case 'View All Employees by Department':
                //     empDepView();
                //     break;
                // case 'View All Employees by Manager':
                //     empManView();
                //     break;
                case 'Add Employee':
                    addEmp();
                    break;
                case 'Remove Employee':
                    remEmp();
                    break;
                case 'Update Employee Role':
                    updateEmpRole();
                    // Get list of roles
                    // Grab employee data
                    // Update role from list
                    break;
                // case 'Update Employee Manager':
                //     updateEmpMan();
                //     break;
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
    console.log('Viewing Roles...\n');
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
                init();
    });
    })
}

const addRole = () => {
    let depts = [];
    connection.query(`select * from department`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            depts.push(res[i]);
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
            console.log('Adding Position...\n');
            console.log(`${response.roleDepName}`);
            connection.query(`INSERT INTO role(title, salary, department_id)
            VALUES ('${response.roleName}', '${response.salary}', (SELECT id from department WHERE name='${response.roleDepName.id}'));`, (err, res) => {
                if (err) throw err;
                console.log(res);
                init();
    });
    })
}

const remDep = () => {
    let remDepts = [];
    connection.query(`select * from department`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            remDepts.push(res[i].name);
        }
    })
    
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'remConfirm',
                message: 'Do you want to remove a department'
            },
        ])
        .then((response) => {
            if (response.remConfirm == true) {
                inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'deleteID',
                        message: 'Please choose the department you wish to delete',
                        choices: remDepts,
                    }
                ])
                .then((response2) => {
                    connection.query( `DELETE FROM department WHERE name='${response2.deleteID}'`, function (err, result) {
                        if (err) throw err;
                        console.log("Number of records deleted: " + result.affectedRows);
                        init();
                    })
                })
            } else {
                init();
            }
        });

}

const remRole = () => {
    let remRoles = [];
    connection.query(`select * from role`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            remRoles.push(res[i].title);
        }
    })

    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'remConfirm',
                message: 'Do you want to remove a role'
            },
        ])
        .then((response) => {
            if (response.remConfirm == true) {
                inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'deleteID',
                        message: 'Please choose the role you wish to delete',
                        choices: remRoles,
                    }
                ])
                .then((response2) => {
                    connection.query( `DELETE FROM role WHERE title='${response2.deleteID}'`, function (err, result) {
                        if (err) throw err;
                        console.log("Number of records deleted: " + result.affectedRows);
                        init();
                    })
                })
            } else {
                init();
            }
        });
}

const updateEmpRole = () => {
    chngEmpList = []
    let newRole = [];
    let selectedEmployee;
    connection.query(`select * from employee`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            chngEmpList.push(res[i].first_name);
        }
    })
    connection.query(`select * from role`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            newRole.push(res[i].title);
        }
    })
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'reconfirm',
                message: 'Are you sure you wish to change a role?'
            },
            {
                type: 'list',
                name: 'selectedEmployee',
                message: 'Which employee do you want to change ',
                choices: chngEmpList
            }
        ])
        .then((response) => {
            selectedEmployee = response.selectedEmployee
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'Select their new role',
                        choices: newRole
                    }
                ])
                .then((nextResponse) => {
                    console.log(nextResponse);
                    var sql = `
                    UPDATE employee
                    SET role_id = (SELECT id FROM role WHERE title = "${nextResponse.newRole}")
                    WHERE first_name = "${selectedEmployee}";`
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("Number of records deleted: " + result.affectedRows);
                        init();
                    });
                });
        })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    init();
})