var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '8889',
    user     : 'root',
    password : 'root',
    database : 'intern_test'
});

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");    
    } else {
        console.log("Error connecting database ... nn");    
    }
});

app.get('/',function(req,res){
    res.render('index');
});

app.get("/test1",function(req,res){
    let sql = 'SELECT user.name AS user,COUNT(visit.user_id) AS count_user, AVG(HOUR(TIMEDIFF(visit.time_in,visit.time_out))+MINUTE(TIMEDIFF(visit.time_in,visit.time_out))/60) AS time_avg, DATEDIFF(MAX(visit.time_in),MIN(visit.time_in)) AS time_range FROM visit JOIN user ON visit.user_id = user.id GROUP BY user_id';
    connection.query(sql, function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.render('page1',{
                title: 'TEST1',
                table: rows
            });
        }
        else
            console.log('Error while performing Query.');
    });
});

app.get("/test2",function(req,res){
    let sql = 'SELECT service.name, COUNT(IFNULL(service_id,0)) AS count_service FROM visit LEFT JOIN service ON visit.service_id = service.id GROUP BY service_id';
    connection.query(sql, function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.render('page2',{
                title: 'TEST2',
                table: rows
            });
        }
        else
            console.log('Error while performing Query.');
    });
});

app.get("/test3",function(req,res){
    let sql = 'SELECT user.name AS user, visit.service_id, service.name AS service, IFNULL(visit.service_id,0) AS service_id, COUNT(IFNULL(visit.service_id,0)) AS count_service, DATE_FORMAT(visit.time_in, "%d %m %T") AS time_in, DATE_FORMAT(visit.time_out, "%d %m %T") AS time_out, AVG(HOUR(TIMEDIFF(visit.time_out,visit.time_in))*60 + MINUTE(TIMEDIFF(visit.time_out,visit.time_in))) AS time_avg FROM visit LEFT JOIN user ON visit.user_id = user.id LEFT JOIN service ON visit.service_id = service.id WHERE HOUR(TIMEDIFF(visit.time_out,visit.time_in))*60 + MINUTE(TIMEDIFF(visit.time_out,visit.time_in)) > 300 GROUP BY user_id,service_id';
    connection.query(sql, function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.render('page3',{
                title: 'TEST3',
                table: rows
            });
        }
        else
            console.log('Error while performing Query.');
    });
});



app.listen(3000, function(){
    console.log('Server Started on Port 3000.....');
})