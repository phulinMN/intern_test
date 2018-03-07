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

app.get('/', function(req, res) {
    connection.connect();
    connection.query('SELECT * from user', function(err, rows, fields) {
        if (!err){
            console.log('The solution is: ', rows);
            res.render('index', {
                title: 'test1',
                table: rows
            });
        }
        else
          console.log('Error while performing Query.');
    });
    connection.end();
});



app.listen(3000, function(){
    console.log('Server Started on Port 3000.....');
})