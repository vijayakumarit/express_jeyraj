var auth = require('../controllers/auth');
var express = require('express');
var app = express.Router();


app.post('/reset-password', auth.resetPassword);



module.exports = app;
