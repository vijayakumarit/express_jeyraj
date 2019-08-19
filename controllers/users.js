var service = require('../services/users');
var logs = require('../services/application_logs');
var http = require('http');
var Promise = require("bluebird");
const excel = require('node-excel-export');

function check_validations(req) {

    req.checkBody({
        'first_name': {
            notEmpty: true,
            matches: {
                options: /^[A-z\s.]+$/
            },
            errorMessage: 'Invalid  first name' // Error message for the parameter
        },

        'last_name': {
            notEmpty: true,
            matches: {
                options: /^[A-z\s.]+$/
            },
            errorMessage: 'Invalid  last name' // Error message for the parameter
        },

        'mother_name': {
            notEmpty: true,
            matches: {
                options: /^[A-z\s.]+$/
            },
            errorMessage: 'Invalid  mother name' // Error message for the parameter
        },

        'gender': {
            notEmpty: true,
            errorMessage: 'Select gender' // Error message for the parameter
        },

        'age': {
            notEmpty: true,
            errorMessage: 'Enter age' // Error message for the parameter
        },
        'birthDate': {
            notEmpty: true,
            errorMessage: 'Select birthDate' // Error message for the parameter
        },
        'height': {
            notEmpty: true,
            matches: {
                options: /^[0-9][0-9]{0,2}$/
            },
            errorMessage: 'Invalid height' // Error message for the parameter
        },
        'weight': {
            notEmpty: true,
            matches: {
                options: /^[0-9][0-9]{0,2}$/
            },
            errorMessage: 'Invalid weight' // Error message for the parameter
        },
        'caste': {
            notEmpty: true,
            /*matches: {
                options: /^[A-z\s.]+$/
            },*/
            errorMessage: 'Invalid occupation' // Error message for the parameter
        },
        'occupation': {
            notEmpty: true,
            /*matches: {
                options: /^[A-z\s.]+$/
            },*/
            errorMessage: 'Invalid occupation' // Error message for the parameter
        },
        'citizenship': {
            notEmpty: true,
            /*matches: {
                options: /^[A-z\s.]+$/
            },*/
            errorMessage: 'Invalid citizenship' // Error message for the parameter
        },
        'education': {
            notEmpty: true,
            /*matches: {
                options: /^[A-z\s.]+$/
            },*/
            errorMessage: 'Invalid education' // Error message for the parameter
        }
    });
};
var paginate = function(req) {
    return require('./paginate').paginate(req);
}

exports.addUser = function(req, res) {
    try {

        //  check_validations(req);

        //var errors = req.validationErrors();

        var errors = false;
        if (errors) {
            var validation_errors = [];
            for (var i = 0; i <= errors.length - 1; i++) {
                validation_errors.push(errors[i].msg);

            }
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'adduser', false, validation_errors);
            };

            res.send({
                status: "error",
                message: validation_errors
            });
            return;

        } else if (req.body.center_id) {
            service.getLastUUID(req).then(function(patient) {
                req.body.uhid = patient.uhid;
                req.body.center_uhid = patient.center_uhid;


                service.addUser(req).then(function(data) {

                    if (PATIENT_REGISTRATION_LOGS) {
                        logs.create(req, 'users', 'adduser', true, data);
                    };
                    res.send(data);

                }).fail(function(err) {
                    if (PATIENT_REGISTRATION_LOGS) {
                        logs.create(req, 'users', 'adduser', false, err);
                    };
                    res.send(err);
                })
            }).fail(function(error) {
                res.send(error);
            })
        } else {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'adduser', false, 'Center code is required');
            };

            res.send({
                status: "error",
                message: "Center Code is required"
            })
        }

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'adduser', false, err);
        };
        res.send(err);
    }
}


exports.findAllPatients = function(req, res) {
    try {
        var filters = {
            searchValue: req.query.search,
            application_id: req.query.application_id,
            is_apollo_clinics : req.query.is_apollo_clinics
        };
        service.findAllPatients(filters, paginate(req)).then(function(data) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'findAllPatients', true, data);
                };
                res.send(data);
            })
            .fail(function(err) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'findAllPatients', false, err);
                };
                res.send(err);
            });
        //}

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'findAllPatients', false, err);
        };
        res.send(err);
    }
}

// get All patients with uploaded vitals - for Munich inegration

exports.getPatientsWithVitalsByCenterID = function(req, res){
    
    try {
        //var filters = require('./sanitize_filter').sanitizeFilters(req, 'users', 'user_search_filter');
        var filters = {
            searchValue: req.query.search,
            center_id : req.query.center_id,
            application_id: req.query.application_id,
            from : req.query.from,
            to : req.query.to
        };

        service
            .getPatientsWithVitalsByCenterID(filters, paginate(req))
            .then(function(data) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'getPatientsWithVitalsByCenterID', true, data);
                };
                res.send(data);
            })
            .fail(function(err) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'getPatientsWithVitalsByCenterID', false, err);
                };
                res.send(err);
            });
        //}

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'getPatientsWithVitalsByCenterID', false, err);
        };
        res.send(err);
    }
}

//Get patient by ID along with vitals - for Munich integration

exports.getPatientsWithVitalsByPatientID = function(req, res){
    try {
        service
            .getPatientsWithVitalsByPatientID(req.params.id)
            .then(function(data) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'getPatientsWithVitalsByPatientID', true, data);
                };
                res.send(data);
            })
            .fail(function(err) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'getPatientsWithVitalsByPatientID', false, err);
                };
                res.send(err);
            });
    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'getPatientsWithVitalsByPatientID', false, err);
        };
        res.send(err);
    }
}

exports.exportPatientsWithVitals = function(req, res){
    try {
        
                var filters = {
                    searchValue: req.query.search,
                    center_id : req.query.center_id ,
                    application_id: req.query.application_id,
                    from : req.query.from,
                    to : req.query.to
                };
                service.exportPatientsWithVitals(filters).then(function(data) {
                    Promise.delay(2000).then(function() {
                        if (CONSULTATION_LOGS) {
                            logs.create(req, 'consultations', 'exportPatientsWithVitals', true, 'Consultation reports are exported');
                        };
                        exportToExcel(data.message, res);
                    })
        
                    //setTimeout(exportToExcel(data.message, res), 3000);
                }).fail(function(err) {
                    if (CONSULTATION_LOGS) {
                        logs.create(req, 'consultations', 'exportPatientsWithVitals', false, err);
                    };
                    res.send(err);
                })
        
        
            } catch (err) {
                if (CONSULTATION_LOGS) {
                    logs.create(req, 'consultations', 'exportPatientsWithVitals', false, err);
                };
                res.send(err);
            }
}

exports.findByPatientId = function(req, res) {
    try {
        service
            .findByPatientId(req.params.id)
            .then(function(data) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'findByPatientId', true, data);
                };
                res.send(data);
            })
            .fail(function(err) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'findByPatientId', false, err);
                };
                res.send(err);
            });
    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'findByPatientId', false, err);
        };
        res.send(err);
    }
}
exports.updatePatient = function(req, res) {
    try {
        // check_validations(req);
        //var errors = req.validationErrors();

        var errors = false;
        if (errors) {
            var validation_errors = [];
            for (var i = 0; i <= errors.length - 1; i++) {
                validation_errors.push(errors[i].msg);

            }
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'updatePatient', false, validation_errors);
            };

            res.send({
                status: "error",
                message: validation_errors
            });
            return;
        } else {

            service
                .updatePatient(req.body)
                .then(function(data) {


                    if (PATIENT_REGISTRATION_LOGS) {
                        logs.create(req, 'users', 'updatePatient', true, data);
                    };
                    res.send(data);
                })
                .fail(function(err) {

                    if (PATIENT_REGISTRATION_LOGS) {
                        logs.create(req, 'users', 'updatePatient', false, err);
                    };
                    res.send(err);
                });
            /* service
                 .checkPatientUniqueFields(req.body)
                 .then(function (patientData) {
                     service
                         .updatePatient(req.body)
                         .then(function (data) {
                             
if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'adduser', true, data);
            };
        res.send(data);
                         })
                         .fail(function (err) {

                            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'adduser', false, err);
            };
        res.send(err);
                         });

                 })
                 .fail(function (err) {

                    if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'adduser', false, err);
            };
        res.send(err);
                 });*/




        }
    } catch (err) {

        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'updatePatient', false, err);
        };
        res.send(err);
    }
}

exports.deletePatient = function(req, res) {
    try {
        service.deletePatient(req).then(function(data) {

            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'deletePatient', true, data);
            };
            res.send(data);

        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'deletePatient', false, err);
            };
            res.send(err);
        })

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'deletePatient', false, err);
        };
        res.send(err);
    }
}
exports.outPatientCount = function(req, res) {
    try {
        service.outPatientCount(req).then(function(data) {

            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'outPatientCount', true, data);
            };
            res.send(data);

        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'outPatientCount', false, err);
            };
            res.send(err);
        })

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'outPatientCount', false, err);
        };
        res.send(err);
    }
}


exports.findPatientsCountForCMDashboard = function(req, res) {
    try {
        service.findPatientsCountForCMDashboard(req).then(function(data) {


            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'findPatientsCountForCMDashboard', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'findPatientsCountForCMDashboard', false, err);
            };
            res.send(err);
        })


    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'findPatientsCountForCMDashboard', false, err);
        };
        res.send(err);
    }
}
exports.getoutpatientCumilative = function(req, res) {
    try {
        service.getoutpatientCumilative(req).then(function(data) {


            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'getoutpatientCumilative', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'getoutpatientCumilative', false, err);
            };
            res.send(err);
        })

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'getoutpatientCumilative', false, err);
        };
        res.send(err);
    }
}
exports.getoutpatientDateWise = function(req, res) {
    try {
        service.getoutpatientDateWise(req).then(function(data) {

            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'getoutpatientDateWise', true, data);
            };
            res.send(data);
        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'getoutpatientDateWise', false, err);
            };
            res.send(err);
        })

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'getoutpatientDateWise', false, err);
        };
        res.send(err);
    }
}

exports.uploadPatients = function(req, res) {
    try {

        service.uploadPatients(req).then(function(data) {

            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'uploadPatients', true, data);
            };
            res.send(data);

        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'uploadPatients', false, err);
            };
            res.send(err);
        })

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'uploadPatients', false, err);
        };
        res.send(err);
    }

}

exports.uploadPatientsForCenter = function(req, res){
    try {

        service.uploadPatientsForCenter(req).then(function(data) {

            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'uploadPatientsForCenter', true, data);
            };
            res.send(data);

        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'uploadPatientsForCenter', false, err);
            };
            res.send(err);
        })

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'uploadPatientsForCenter', false, err);
        };
        res.send(err);
    }
}


exports.patientsMapping = function(req, res) {
    try {
        service.patientsMapping(req).then(function(data) {

            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'patientsMapping', true, data);
            };
            res.send(data);

        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'patientsMapping', false, err);
            };
            res.send(err);
        })

    } catch (err) {

        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'patientsMapping', false, err);
        };
        res.send(err);
    }
}

// Export excel for Munich patients
function exportToExcel(data, res) {
    
        const dataset = [];
        var vital_array_number;
    
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if((data[i]._id && data[i].first_name != null )&& (data[i].auto_vitals_id && data[i].auto_vitals_id != null))
                {
    
    
                dataset.push({
                    patient_uhid: data[i].uhid,
                    first_name: data[i].first_name,
                    last_name: data[i].last_name || "---",
                    age: data[i].age,
                    gender: data[i].gender,
                    created: data[i].created,
                    phone : data[i].phone,
                    email : data[i].email || "---",
                    address : data[i].present_address.address || "---",
                    therm_far: data[i].auto_vitals_id.vitals[0]? data[i].auto_vitals_id.vitals[0].THERM.fahrenheit : "---",
                    therm_cel: data[i].auto_vitals_id.vitals[0]? data[i].auto_vitals_id.vitals[0].THERM.celsius : "---",
                    bpm_systolic: data[i].auto_vitals_id.vitals[0]? data[i].auto_vitals_id.vitals[0].BPM.systolic : "---",
                    bpm_diastolic: data[i].auto_vitals_id.vitals[0]? data[i].auto_vitals_id.vitals[0].BPM.diastolic : "---",
                    spo2_percentage: data[i].auto_vitals_id.vitals[0]? data[i].auto_vitals_id.vitals[0].SPO2.percentage : "---",
                    spo2_bpm: data[i].auto_vitals_id.vitals[0]? data[i].auto_vitals_id.vitals[0].SPO2.bpm : "---",
                    gluco: data[i].auto_vitals_id.vitals[0]? data[i].auto_vitals_id.vitals[0].GLUCO.result_value : "---",
                    ecg : data[i].auto_vitals_id.isECG == true ? "Yes" : "No",
                    steth : data[i].auto_vitals_id.isSTETH == true ? "Yes" : "No"

    
                })
                }
                
            }
        } else {
            dataset.push({
                patient_uhid: "---",
                first_name: "---",
                last_name : "---",
                age: "---",
                gender: "---",
                created: "---",
                phone : "---",
                email : "---",
                address : "---",
                therm_far: "---",
                therm_cel : "---",
                bpm_systolic: "---",
                bpm_diastolic : "---",
                spo2_percentage: "---",
                spo2_bpm: "---",
                gluco: "---",
                ecg : "---",
                steth : "---"
            })
        }
    
        const styles = {
            headerDark: {
                fill: {
                    fgColor: {
                        rgb: '34BAAA'
                    }
                },
                font: {
                    color: {
                        rgb: 'FFFFFFFF'
                    },
                    sz: 12,
                    bold: true,
                    underline: false
                }
            },
            cellPink: {
                fill: {
                    fgColor: {
                        rgb: 'FFFFCCFF'
                    }
                }
            },
            cellGreen: {
                fill: {
                    fgColor: {
                        rgb: 'FF00FF00'
                    }
                }
            }
        };
    
        //Array of objects representing heading rows (very top) 
        const heading = [
        ] // <-- It can be only values ];
    
        //Here you specify the export structure 
        const specification = {
            patient_uhid: { // <- the key should match the actual data key 
                displayName: 'UHID', // <- Here you specify the column header 
                headerStyle: styles.headerDark,
                width: 150 // <- width in pixels 
            },
            first_name: {
                displayName: 'First Name',
                headerStyle: styles.headerDark,
                width: 180 // <- width in chars (when the number is passed as string) 
            },
            last_name: {
                displayName: 'Last Name',
                headerStyle: styles.headerDark,
                width: 180 // <- width in chars (when the number is passed as string) 
            },
            age: {
                displayName: 'Age',
                headerStyle: styles.headerDark,
                width: 50 // <- width in pixels 
            },
            gender: {
                displayName: 'Gender',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            created: {
                displayName: 'Created date',
                headerStyle: styles.headerDark,
                width: 150 // <- width in pixels 
            },
            phone: {
                displayName: 'Phone',
                headerStyle: styles.headerDark,
                width: 120 // <- width in pixels 
            },
            email: {
                displayName: 'Email',
                headerStyle: styles.headerDark,
                width: 200 // <- width in chars (when the number is passed as string) 
            },
            address: {
                displayName: 'Address',
                headerStyle: styles.headerDark,
                width: 220 // <- width in chars (when the number is passed as string) 
            },
            bpm_systolic: {
                displayName: 'BPM(systolic)',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            bpm_diastolic: {
                displayName: 'BPM(diastolic)',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            spo2_percentage: {
                displayName: 'SPO2(%)',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            spo2_bpm: {
                displayName: 'SPO2(bpm)',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            therm_far: {
                displayName: 'THERM(°F)',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            therm_cel: {
                displayName: 'THERM(°C)',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            gluco: {
                displayName: 'GLUCO',
                headerStyle: styles.headerDark,
                width: 150 // <- width in pixels 
            },
            ecg: {
                displayName: 'ECG',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            },
            steth: {
                displayName: 'STETH',
                headerStyle: styles.headerDark,
                width: 80 // <- width in pixels 
            }
        }

        // const merges = [
        //     { start: { row: 1, column: 10 }, end: { row: 1, column: 11 } }
        //     // { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
        //     // { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
        //   ]
    
    
    
        // Create the excel report. 
        // This function will return Buffer 
        const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report 
                {
                    name: 'Report', // <- Specify sheet name (optional) 
                    specification: specification, // <- Report specification 
                    //merges: merges, // <- Merge cell ranges
                    data: dataset // <-- Report data 
                }
            ]
        );
    
        // You can then return this straight 
    
        /*Promise.delay(1000).then(function(){
    
        })*/
        // This is sails.js specific (in general you need to set headers) 
        //return res.send(report);
        res.attachment('report.xlsx');
        return res.send(report);
    }

exports.getoutpatientZoneWise = function(req, res) {
    try {
        service.getoutpatientZoneWise(req).then(function(data) {


            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'getoutpatientZoneWise', true, data);
            };
            res.send(data);

        }).fail(function(err) {
            if (PATIENT_REGISTRATION_LOGS) {
                logs.create(req, 'users', 'getoutpatientZoneWise', false, err);
            };
            res.send(err);
        })

    } catch (err) {

        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'getoutpatientZoneWise', false, err);
        };
        res.send(err);
    }

}
exports.saveAdultToCM = function(req, res) {
    try {
        var data = {};
        var options = {
            host: '103.15.74.27',
            port: 8094,
            path: '/api/eUPHC/eUPHCKpiCountInsert?passcode=' + req.body.passcode + '&CenterId=' + req.body.CenterId + '&AttrId=' + req.body.AttrId + '&Count=' + req.body.Count + '&ProviderId=' + req.body.ProviderId + '&date=' + req.body.date,
            method: 'POST'

        };

        var req = http.request(options, function(res) {
            // console.log("response ", res)
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                // console.log("body: " + chunk);
            });
        });

        req.write(data.toString());
        req.end()
        res.send("SUbmitted Successfully");


        // }

    } catch (err) {
        console.log("err is ", err)
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'saveAdultToCM', false, err);
        };
        res.send(err);
    }
}

exports.getRegisteredPatientsList = function(req, res) {
    try {
        service.getRegisteredPatientsList(req, paginate(req)).then(function(data) {
                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'getRegisteredPatientsList', true, data);
                };
                res.send(data);
            })
            .fail(function(err) {

                if (PATIENT_REGISTRATION_LOGS) {
                    logs.create(req, 'users', 'getRegisteredPatientsList', false, err);
                };
                res.send(err);
            });
        //}

    } catch (err) {
        if (PATIENT_REGISTRATION_LOGS) {
            logs.create(req, 'users', 'getRegisteredPatientsList', false, err);
        };
        res.send(err);
    }
}