var service = require('../services/misreports');
var logs = require('../services/application_logs');
var csvparse = require('json2csv');
var moment = require('moment');

var paginate = function(req) {
    return require('./paginate').paginate(req);
}




/**
* @api {get}  /mis/outpatient-reports?center_id = ** & created = {date}
* @apiParam {Number} center_id, {String} date
* @apiExample /mis/outpatient-reports?center_id = 162 & created = 2017-06-01

* @apiDescription
  Get the out patients counts for reporting purpose. 
  The output will be in the form of New petient and existing Patient along with
  male child, female child, male adult, female adult and total

*/
exports.getOutPatientService = function(req, res) {
    try {
        service.getOutPatientService(req).then(function(data) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getOutPatientService', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getOutPatientService', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'getOutPatientService', false, err);
        };
        res.send(err);
    }
}

/**
* @api {get}  /mis/tele-consultancy?center_id = ** & created = {date}
* @apiParam {Number} center_id, {String} date
* @apiExample /mis/tele-consultancy?center_id = 162 & created = 2017-06-01

* @apiDescription
*  Get the Teleconsultancy counts for reporting purpose. 
*  The output will be in the form of specialities along with
*  male child, female child, male adult, female adult and total
*/
exports.getTeleconsultancyService = function(req, res) {

    try {
        service.getTeleconsultancyService(req).then(function(data) {

            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getTeleconsultancyService', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getTeleconsultancyService', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'getTeleconsultancyService', false, err);
        };
        res.send(err);
    }
}


/**
* @api {get}  /mis/attendance-month?center_id = ** & created = {date}
* @apiParam {Number} center_id, {String} date
* @apiExample /mis/attendance-month?center_id = 162 & created = 2017-06-01

* @apiDescription
*  Get the attendance report for month.
*/
exports.getAttendanceForMonth = function(req, res) {

    try {
        service.getAttendanceForMonth(req).then(function(data) {

            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getAttendanceForMonth', true, data);
            };
            res.send(data);

        }).fail(function(err) {

            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getAttendanceForMonth', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'getAttendanceForMonth', false, err);
        };
        res.send(err);
    }


}


//subhash
exports.findTeleconsultancyCount = function(req, res) {
    try {
        service.findTeleconsultancyCount(req).then(function(data) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findTeleconsultancyCount', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findTeleconsultancyCount', false, err);
            };
            res.send(err);
        })


    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'findTeleconsultancyCount', false, err);
        };
        res.send(err);
    }
}


exports.getLabTestFromCMDashboard = function(req, res) {
    try {
        service.getLabTestFromCMDashboard(req.query.passcode, req.query.center_id, req.query.attr_id, req.query.count, req.query.provider_id, req.query.date).then(function(data) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getLabTestFromCMDashboard', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getLabTestFromCMDashboard', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'getLabTestFromCMDashboard', false, err);
        };
        res.send(err);
    }
}


exports.findLISBiochemistryCount = function(req, res) {
    try {
        service.findLISBiochemistryCount(req).then(function(data) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISBiochemistryCount', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISBiochemistryCount', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'findLISBiochemistryCount', false, err);
        };
        res.send(err);
    }
}

exports.getParameterWiseLabReportsCount = function(req, res){
    try {
        service.getParameterWiseLabReportsCount(req).then(function(data) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getParameterWiseLabReportsCount', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getParameterWiseLabReportsCount', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'getParameterWiseLabReportsCount', false, err);
        };
        res.send(err);
    }
}

exports.getCenterOutReachConsultationsCount = function(req, res){
     try {
        service.getCenterOutReachConsultationsCount(req).then(function(data) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getCenterOutReachConsultationsCount', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getCenterOutReachConsultationsCount', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'getCenterOutReachConsultationsCount', false, err);
        };
        res.send(err);
    }
}

exports.findLISClinicalPathologyCount = function(req, res) {
    try {
        service.findLISClinicalPathologyCount(req).then(function(data) {

            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISClinicalPathologyCount', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISClinicalPathologyCount', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'findLISClinicalPathologyCount', false, err);
        };
        res.send(err);
    }
}

exports.findLISMicrobiologyCount = function(req, res) {
    try {
        service.findLISMicrobiologyCount(req).then(function(data) {

            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISMicrobiologyCount', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISMicrobiologyCount', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'findLISMicrobiologyCount', false, err);
        };
        res.send(err);
    }
}

exports.findLISHemotologyCount = function(req, res) {
    try {
        service.findLISHemotologyCount(req).then(function(data) {

            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISHemotologyCount', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'findLISHemotologyCount', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'findLISHemotologyCount', false, err);
        };
        res.send(err);
    }
}
exports.getAreawiseCount = function(req, res) {
    try {
        service.getAreawiseCount(req).then(function(data) {


            var fields = ['SNO', 'DISTRICT', 'MUNCIPALITY', 'PHC_NAME', 'OP_COUNT', 'TC_COUNT', 'LT_COUNT', 'IM_COUNT'];
            count = csvparse({ data: data.myData1, fields: fields });

            res.attachment('eUPHC TOP SHEET - ' + moment().format('DD MMMM YYYY') + '.csv');
            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getAreawiseCount', true, count);
            };

            res.send(count);

        }).fail(function(err) {

            if (CMDASHBOARD_LOGS) {
                logs.create(req, 'misreports', 'getAreawiseCount', false, err);
            };
            res.send(err);
        })
    } catch (err) {
        if (CMDASHBOARD_LOGS) {
            logs.create(req, 'misreports', 'getAreawiseCount', false, err);
        };
        res.send(err);
    }
}