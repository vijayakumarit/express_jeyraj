var winston = require('winston');
var Mail = require('winston-mail').Mail;
var fs = require('fs');
var moment = require('moment');
var config = require('../configurations/dev.js');

var dir_step1_debugs = "/debugs";
var dir_step1_exceptions = "/exceptions";
var dir_step2 = new moment().format('YYYY');
var dir_step3 = new moment().format('MMMM');
var dir_step4 = new moment().format('DD-MM-YYYY');

//Checking Folder Structure For Debugs
if (!fs.existsSync(__dirname + dir_step1_debugs)) {
    fs.mkdirSync(__dirname + dir_step1_debugs);
}
if (!fs.existsSync(__dirname + dir_step1_debugs + '/' + dir_step2)) {
    fs.mkdirSync(__dirname + dir_step1_debugs + '/' + dir_step2);
}
if (!fs.existsSync(__dirname + dir_step1_debugs + '/' + dir_step2 + '/' + dir_step3)) {
    fs.mkdirSync(__dirname + dir_step1_debugs + '/' + dir_step2 + '/' + dir_step3);
}
if (!fs.existsSync(__dirname + dir_step1_debugs + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4)) {
    fs.mkdirSync(__dirname + dir_step1_debugs + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4);
}
if (!fs.existsSync(__dirname + dir_step1_debugs + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4 + '/debug.log')) {
    fs.writeFile(__dirname + dir_step1_debugs + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4 + '/debug.log');
}
//End Folder Structure For Debugs


//Checking Folder Structure For Exceptions
if (!fs.existsSync(__dirname + dir_step1_exceptions)) {
    fs.mkdirSync(__dirname + dir_step1_exceptions);
}
if (!fs.existsSync(__dirname + dir_step1_exceptions + '/' + dir_step2)) {
    fs.mkdirSync(__dirname + dir_step1_exceptions + '/' + dir_step2);
}
if (!fs.existsSync(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3)) {
    fs.mkdirSync(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3);
}
if (!fs.existsSync(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4)) {
    fs.mkdirSync(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4);
}
if (!fs.existsSync(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4)) {
    fs.mkdirSync(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4);
}
if (!fs.existsSync(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4 + '/exceptions.log')) {
    fs.writeFile(__dirname + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4 + '/exceptions.log');
}
//End Folder Structure For Exceptions

var debug_logs_directory = __dirname + '/' + dir_step1_debugs + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4 + '/debug.log';
var exception_logs_directory = __dirname + '/' + dir_step1_exceptions + '/' + dir_step2 + '/' + dir_step3 + '/' + dir_step4 + '/exceptions.log';


var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({ json: true, timestamp: true }),
        new winston.transports.File({ filename: debug_logs_directory, json: false })
    ],
    exceptionHandlers: [
        new(winston.transports.Console)({ json: true, timestamp: true }),
        new winston.transports.File({ filename: exception_logs_directory, json: false }),
        new winston.transports.Mail({
            to: 'vishnu_r@apollohospitals.com',
            from: 'apollotelemedicinehospital@gmail.com',
            subject: 'uncaughtException Report - ' + APPLICATION_NAME,
            host: 'smtp.gmail.com',
            username: 'apollotelemedicinehospital@gmail.com',
            password: 'apolloTelemedicine',
            ssl: true
        })
    ],
    exitOnError: false
});


module.exports = logger;