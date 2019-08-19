var mis = require('../controllers/misreports');
var immunizations = require('../controllers/immunizations');
var immunization_module = require('../controllers/immunizations_module');

var express = require('express');
var app = express.Router();



//MIS - Reports API

app.get('/mis/outpatient-reports', mis.getOutPatientService);
app.get('/mis/tele-consultancy', mis.getTeleconsultancyService);
app.get('/mis/attendance-month', mis.getAttendanceForMonth);
app.get('/mis/immunization-reports', immunizations.getImmunizationMISReports);
app.get('/mis/immunizations-reports', immunization_module.getImmunizationModuleMISReports);

//CM Dashboard
app.get('/cm/lab-tests', mis.getLabTestFromCMDashboard);


app.get('/teleconsultancy/count', mis.findTeleconsultancyCount);
app.get('/mis/areawise-count', mis.getAreawiseCount);
app.get('/mis/parameter-wise-lab-reports-count', mis.getParameterWiseLabReportsCount);
app.get('/mis/center-outreach-reports', mis.getCenterOutReachConsultationsCount);
app.get('/mis/test-reports-count', mis.findLISBiochemistryCount); // Both Bio chemistry and Hematology tests - working based on test_group name from query parameter
//app.get('/lis/biochemistry-reports-count', mis.findLISBiochemistryCount);
app.get('/lis/clinicalpathology-reports-count', mis.findLISClinicalPathologyCount);
app.get('/lis/Sero-microbiology-reports-count', mis.findLISMicrobiologyCount);
app.get('/lis/hemotology-reports-count', mis.findLISHemotologyCount);


module.exports = app;
