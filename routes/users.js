var users = require('../controllers/users');
//var demography = require('../controllers/demography');
var express = require('express');
var app = express.Router();
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


// Patients
app.post('/addUser', users.addUser);

app.get('/patients', users.findAllPatients);
app.get('/patient/:id', users.findByPatientId);
app.put('/patient/:id', users.updatePatient);
app.get('/out-patient-count', users.outPatientCount);
//Delete Patient will come here
// app.get('/patients/filter', users.findPatientsByFilter);
app.get('/getRegisteredPatients', users.getRegisteredPatientsList);


app.post('/upload-patients/:author/:authorType', multipartyMiddleware, users.uploadPatients);
app.post('/upload-patients-for-center/:author/:authorType/:center_id/:camp_date/:address/:state/:district/:municipality/:location/:city/:zipcode', multipartyMiddleware, users.uploadPatientsForCenter);

app.post('/patients-mapping', multipartyMiddleware, users.patientsMapping);

//ASHA - Munich Get all patients API
app.get('/patients-uploaded-vitals', users.getPatientsWithVitalsByCenterID);
app.get('/patient-uploaded-vitals-by-id/:id',users.getPatientsWithVitalsByPatientID);
app.get('/patients-list-with-vitals', users.exportPatientsWithVitals);

//CM Dashboard KPIs
app.get('/out-patients/count', users.findPatientsCountForCMDashboard);
app.get('/out-patients/cumulative', users.getoutpatientCumilative);
app.get('/out-patients/count/date-wise', users.getoutpatientDateWise);

app.get('/out-patients/count/zone-wise', users.getoutpatientZoneWise);

app.post('/eUPHC/eUPHCKpiCountInsert', users.saveAdultToCM)

//Demography APIs
//app.post('/demography', demography.addDemographyDetails); //For Update and create
//app.get('/demography', demography.getDemographyDetails);







module.exports = app;
