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

app.get("/",function(req,res){
    let sql = 'SELECT user_id,COUNT(user_id) AS count_user, AVG(HOUR(TIMEDIFF(time_in,time_out))+MINUTE(TIMEDIFF(time_in,time_out))/60) AS time_avg,DATEDIFF(MAX(time_in),MIN(time_in)) AS time_range FROM visit GROUP BY user_id';
    connection.query(sql, function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.render('index',{
                title: 'TEST1',
                table: rows
            });
        }
        else
            console.log('Error while performing Query.');
    });
});

app.get("/test2",function(req,res){
    let sql = 'SELECT *, COUNT(IFNULL(service_id,0)) AS count_service from visit GROUP BY service_id';
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
    // let sql = 'SELECT *,  AS count_service FROM visit GROUP BY user_id, service_id';
    let sql = 'SELECT *,IFNULL(service_id,0) AS service_id, COUNT(IFNULL(service_id,0)) AS count_service, DATE_FORMAT(time_in, "%d %m %T") AS time_in, DATE_FORMAT(time_out, "%d %m %T") AS time_out, AVG(HOUR(TIMEDIFF(time_out,time_in))*60 + MINUTE(TIMEDIFF(time_out,time_in))) AS time FROM visit WHERE HOUR(TIMEDIFF(time_out,time_in))*60 + MINUTE(TIMEDIFF(time_out,time_in)) > 300 GROUP BY user_id,service_id';
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