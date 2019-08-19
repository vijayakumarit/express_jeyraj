var admin = require('../controllers/admin');
//var hospital = require('../controllers/refer_to_hospitals');
var express = require('express');
var app = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


//app.get('/specialities', admin.getSpecialities);
app.get('/languages', admin.getLanguages);


//hopsitals

//app.post('/refer-hospital/new', hospital.addHospital);
//app.get('/refer-hospitals', hospital.findAllHospitals);
//app.get('/refer-hospital/:hospitalID', hospital.findHospitalsByID);
//app.put('/refer-hospital/:hospitalID', hospital.updateHospitalByID);
//app.put('/delete-hospitals/:hospitalID', hospital.deleteHospital);


//upload Hospitals from CSV
//app.post('/upload-hospitals/:author/:authorType', multipartyMiddleware, hospital.uploadHospitals);





module.exports = app;