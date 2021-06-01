//require('dotenv').config();
const env = process.env;

const express = require('express');
const mysql = require('mysql2');

const mysqlConfig = {
    host: env.DB_HOST || 'mysql',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD  || 'root',
    database: env.DB_NAME  || 'employee_db'
}

// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'employee_db'
// });

const port = env.APP_PORT || 3000;

// const conn = mysql.createConnection({
//     // port: env.DB_PORT,
//     host: env.DB_HOST || 'mysql',
//     user: env.DB_USER || 'root',
//     password: env.DB_PASSWORD  || 'root',
//     database: env.DB_NAME  || 'employee_db'
// });

let conn = null;

const app = express();

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/connect', (req, res, next) => {

    conn = mysql.createConnection({
        // port: env.DB_PORT,
        host: env.DB_HOST || 'mysql',
        user: env.DB_USER || 'root',
        password: env.DB_PASSWORD  || 'root',
        database: env.DB_NAME  || 'employee_db'
    });

    conn.connect((error) => {
        if (error) { throw error; }
        console.log("CONNECTED to MySql Database");
        res.send('CONNECTED to MySql Database');
    })
});

app.get('/create-table', (req, res, next) => {
    conn.connect((error) => {
        if (error) { throw error; }
        conn.query(`CREATE TABLE IF NOT EXISTS employee(
                        emp_id varchar(5) primary key,
                        name varchar(30) NOT NULL,
                        salary decimal(15,2) NOT NULL
                    );`, (error) => {
        if (error) { throw error; }
        console.log("EMPLOYEE table has been created.");
        res.send('EMPLOYEE table has been created');
        });
    })
});


// conn.connect((error) => {
//     if (error) {
//         throw error;
//     }
//     console.log("CONNECTED to MySql Database");
// })

// conn.query(`CREATE TABLE IF NOT EXISTS employee(
//                 emp_id varchar(5) primary key,
//                 emp_name varchar(30) NOT NULL
//             );`, (error) => {
//     if (error) {
//         throw error;
//     }
//     console.log("EMPLOYEE table has been created.");
// });

// conn.query(`INSERT INTO 
//                 employee(emp_name, emp_id)
//             VALUES
//                 ('Alice', '10000'),
//                 ('Bob', '10001');`, (error) => {
//     if (error) {
//         throw error;
//     }
//     console.log("Employee Data has been added.");
// });

app.get('/emp', (req, res, next) => {
    let sql = `SELECT * FROM employee`;
    conn.query(sql, (error, results, fields) => {
        console.log('GET all employees');
        if (error) {
            console.log(error);
            return;
        }
        console.log(results);
        res.send(results);
    });
});

app.get('/emp/:id', (req, res, next) => {
    let id = req.params.id;
    let sql = `SELECT * FROM employee WHERE emp_id = ${id}`;
    conn.query(sql, (error, results, fields) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(results);
        res.send(results);
    });
});

app.post('/emp', (req, res, next) => {
    console.log('Request body:\n', req.body);
    conn.query(
        'INSERT INTO employee (emp_id, name, salary) VALUES (?, ?, ?)',
        [req.body.emp_id, req.body.name, req.body.salary],
        (error, results, fields) => {
            if (error) {
                console.log(error);
                return;
            }
            console.log(results);
            res.send('/POST : Employee has been added');
        });
});

app.put('/emp/:id', (req, res, next) => {
    console.log('Request body:\n', req.body);
    let id = req.params.id;
    let sql = `UPDATE employee SET salary = '${req.body.salary}' WHERE emp_id = ${id}`;
    conn.query(sql, (error, results, fields) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(results);
        res.send('/PUT : Employee has been updated');
    });
});

app.delete('/emp/:id', (req, res, next) => {
    let id = req.params.id;
    let sql = `DELETE FROM employee WHERE emp_id = ${id}`;
    conn.query(sql, (error, results, fields) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(results);
        res.send('/DELETE : Employee has been deleted');
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).send({ 'message': err.message });

    return;
})