var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({ 
    host:'localhost',
    user:'root',
    password:'',
    database:'nodelogin'
});

var app = express();
app.use(session({
secret: 'secret',
resave: true,
saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/',function(request, response){
response.sendFile(path.join(__dirname + '/login.html'));

});

app.post('/auth',function(request,response){
var username = request.body.username;
var password = request.body.password;
if(username && password){
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?',[username,password], function(error,results,fields){
    if(results.length > 0){
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect('/home.html'); // NO FUNCIONA POR EL MOMENTO
    }
    else {
        response.send('Incorect username or password');
    }
    response.end();
    
  });
}
else {
    response.send('Please Enter USERNAME AND PASSWORD');
    response.end();
}

});
app.listen(3000);