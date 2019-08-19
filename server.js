var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var blobUtil = require('blob-util');
var fs = require('fs');
var multipart = require('multipart');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var helmet = require('helmet')
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var csrf = require('csrf');
var cors = require('cors');
var moment = require('moment');
var wkhtmltopdf = require('wkhtmltopdf');
var sockets = require('./sockets.js');
var ws = require('ws');
var json2xls = require('json2xls');
var mongoose = require('mongoose');
var mongo =require('mongodb')

// Initialize appication with route / (that means root of the application)
 var db = require('./configurations/connections/db.js');

var dev = require('./configurations/dev.js');


// var mongoDB = db.connect();

//mongoose.connect('mongodb://localhost/balance-web');
//mongo

app.use(cors());
app.use(function(req, res, next) {

    next();
}, express.static(path.join(__dirname, '../atnf_upgrade/')));


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
}

app.use(helmet());

app.use(allowCrossDomain);

// This limit is for avoid payload too large issue(When request contains base64 kind of files)
// parse application/json  
app.use(bodyParser.json({limit: "50mb"})) 
app.use(bodyParser.urlencoded({
    limit: "50mb",   // This limit is for avoid payload too large issue(When request contains base64 kind of files)
    extended: true,
    parameterLimit:50000  // This limit is for avoid payload too large issue
})) // parse application/x-www-form-urlencoded
app.use(expressValidator());
var csrfProtection = csrf({
    cookie: true
})
app.use(json2xls.middleware); //To export JSON data to xlsx

app.use(methodOverride()); // simulate DELETE and PUT
app.use(cookieParser("50m35e(4eTT3xt1sSu9905e2bhe4e"));


app.use(session({

    secret: '50m35e(4eTT3xt1sSu9905e2bhe4e',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://localhost/statgingdb'
    })
}))

http.listen(PORT, function() {
    
        console.log("Express server listening on port " + PORT);
    });
require('./routes/all')(app);


//Cron job for DB Backups
var CronJob = require('cron').CronJob;
var Cron = require('./db_backup.js');
//Mongodb backup will run for every day 05:00:00 AM
new CronJob('0 0 5 * * *', function() {
    //Cron.dbAutoBackUp();
}, null, true, 'Asia/Kolkata');
