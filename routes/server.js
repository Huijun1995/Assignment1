var express = require('express');
var app = express();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var mysql = require('mysql');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    name: 'skey',
    secret: 'chyingp',
    store: new FileStore(),
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 900000
    }
}));

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    database: 'ass1',
    username: 'root',
    password: '102564',
    dialect: 'mysql',
    host: 'localhost',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});


const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
});

// sequelize.sync({force: true})
//     .then(() => User.create({
//         firstName: 'Henry',
//         lastName: 'Smith',
//         username: 'hsmith',
//         password: 'smith'
//     }))
//     .then(() => User.create({
//         firstName: 'Tim',
//         lastName: 'Bucktoo',
//         username: 'tbucktoo',
//         password: 'bucktoo'
//     }));


//login
app.post('/login', function(req, res){
    if(req.body) {
        if(req.body.username && req.body.password) {
            User.findAll({
                where: {
                    username: req.body.username
                }
            }).then(User => {
                if (User != null && User[0].password === req.body.password) {
                    req.session.user = req.body.username;
                    res.json({"message": "Welcome " + User[0].firstName});
                }
                else {
                    res.json({"message": "There seems to be an issue with the username/password combination that you entered"});
                }
            }).catch((err) => reject(error))
        }
        else{
            res.json({"message": "There seems to be an issue with the username/password combination that you entered"});
        }
    }
    else{
        res.json({"message": "post request error"});
    }
});


//logout
app.post('/logout', function (req, res) {
    if(req.session.user){
        req.session.destroy();
        res.json({"message": "You have been successfully logged out"});
    }
    else{
        res.json({"message": "You are not currently logged in"});
    }
});


//add
app.post('/add', function (req, res) {
    if(req.session.user){
        if(req.body.num1 && req.body.num2) {
            var num1 = req.body.num1;
            var num2 = req.body.num2;
            if (isInt(num1) && isInt(num2)) {
                res.json({"message": "The action was successful", "result": Number(num1) + Number(num2)});
            }
            else {
                res.json({"message": "The numbers you entered are not valid"});
            }
        }
        else{
            res.json({"message": "The numbers you entered are not valid"});
        }
    }
    else{
        res.json({"message": "You are not currently logged in"});
    }
});


//divide
app.post('/divide', function (req, res) {
    if(req.session.user){
        if(req.body.num1 && req.body.num2) {
            var num1 = req.body.num1;
            var num2 = req.body.num2;
            if (isInt(num1) && isInt(num2) && num2 != 0) {
                res.json({"message": "The action was successful", "result": Number(num1) / Number(num2)});
            }
            else {
                res.json({"message": "The numbers you entered are not valid"});
            }
        }
        else{
            res.json({"message": "The numbers you entered are not valid"});
        }
    }
    else{
        res.json({"message": "You are not currently logged in"});
    }
});


//multiply
app.post('/multiply', function (req, res) {
    if(req.session.user){
        if(req.body.num1 && req.body.num2) {
            var num1 = req.body.num1;
            var num2 = req.body.num2;
            if (isInt(num1) && isInt(num2)) {
                res.json({"message": "The action was successful", "result": Number(num1) * Number(num2)});
            }
            else {
                res.json({"message": "The numbers you entered are not valid"});
            }
        }
        else{
            res.json({"message": "The numbers you entered are not valid"});
        }
    }
    else{
        res.json({"message": "You are not currently logged in"});
    }
});

function isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}

app.listen(4000);
console.log("app running at http://localhost:4000");