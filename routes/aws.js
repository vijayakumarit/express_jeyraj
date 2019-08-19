var aws = require('../controllers/aws');
var express = require('express');
var app = express.Router();



app.get('/aws/s3Policy', aws.getS3Policy);

module.exports = app;
