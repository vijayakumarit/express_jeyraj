var model = require('../models/users');
var trash_model = require('../models/trash/users');
var center_model = require('../models/trash/centers');
var groups_model = require('../models/trash/groups');
var district_model = require('../models/trash/districts');
var municipality_model = require('../models/trash/muncipality');
var location_model = require('../models/trash/locations');
var state_model = require('../models/states');
//var auto_vitals_upload_model = require('../models/auto_vitals_upload');
var Q = require('q');
var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
var _ = require('underscore');
var config = require("../configurations/filters/users");
var dev = require("../configurations/dev.js");
var parse = require('csv-parse');
var fs = require('file-system');
const { Pool, Client } = require('pg');



// Generate uhid for patient based State code, center id and date
var uIDFormat = function (number, width) {
    // console.log("uid ", number, width);
    return Array(Math.max(width - String(number).length + 1, 0)).join(0) + number;
    // return new Array(+width + 1 - (number + '').length).join('0') + number;
    // return [+width + 1 - (number + '').length].join('0') + number;
    //console.log([+width + 1 - (number + '').length].join('0') + number)
}
var centerIdFormat = function (number, width) {
    return number + new Array(+width + 1 - (number + '').length).join('0');
}

exports.getLastUUID = function (req) {
    var user = model.model(false);
    var centers_list = center_model.model(false);
    var deferred = Q.defer();


    user.find({
        created: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(24, 0, 0, 0))
        }

    }).sort('_id').exec(function (err, patientsData) {

        if (err) {
            console.log(err)
            deferred.reject({
                status: "error",
                message: err
            })

        } else if (patientsData.length > 0) {

            var patient = {};
            patient.uhid = uIDFormat(req.body.STATE_CODE, 2) + uIDFormat(req.body.center_id, 4) + new moment().format('YYMMDD') + uIDFormat(patientsData.length + 1, 4);
            patient.center_id = req.body.center_id;
            deferred.resolve(patient);
        } else {
            console.log("");
            var patient = {};
            patient.uhid = uIDFormat(req.body.STATE_CODE, 2) + uIDFormat(req.body.center_id, 4) + new moment().format('YYMMDD') + uIDFormat(1, 4);
            patient.center_id = req.body.center_id;
            deferred.resolve(patient);
        }
    })



    return deferred.promise;
}


// Create(Register) new patient
exports.addUser = function (req) {
    var users = model.model(true);
    var find_users = model.model(false);
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId;


    users._id = new ObjectId(); // Assign all the req.body data to respective model fileds
    users.uhid = req.body.uhid;
    users.application_id = req.body.application_id;

    users.center_id = req.body.center_id;
    users.client_id = req.body.client_id;
    users.title = req.body.title;
    users.first_name = req.body.first_name;
    users.middle_name = req.body.middle_name;
    users.last_name = req.body.last_name;
    users.email = req.body.email;
    users.phone = req.body.phone || '0000000000';
    users.alternative_phone = req.body.alternative_phone;
    users.gender = req.body.gender;
    users.marital_status = req.body.marital_status;
    users.age = req.body.age.years; // Extra field for existing patients
    users.age_years = req.body.age.years;
    users.age_months = req.body.age.months;
    users.age_days = req.body.age.days;
    users.age_group = req.body.age_group;
    users.age_type = req.body.age_type;
    users.birthDate = req.body.birthDate;
    users.bloodgroup = req.body.bloodgroup;

    //console.log("users........", users);
    users.relationship.relation_type = req.body.relationship.relation_type;
    users.relationship.relation_value = req.body.relationship.relation_value;
    users.mother_name = req.body.mother_name;
    users.yearly_income = req.body.yearly_income;
    //users.image = req.body.image;
    //console.log("subhash", users.relationship.relation_type);
    users.aadhar_card = req.body.aadhar_card;
    users.present_address.address = req.body.present_address.address;
    users.present_address.location = req.body.present_address.location;
    users.present_address.address2 = req.body.present_address.address2;
    users.present_address.municipality = req.body.present_address.municipality;
    users.present_address.district = req.body.present_address.district;
    users.present_address.city = req.body.present_address.city;
    users.present_address.state = req.body.present_address.state;
    users.present_address.country = req.body.present_address.country || 'INDIA';
    users.present_address.zipcode = req.body.present_address.zipcode;
    users.is_same_address = req.body.is_same_address;

    users.permanent_address.address = req.body.permanent_address.address;
    users.permanent_address.address2 = req.body.permanent_address.address2;
    users.permanent_address.location = req.body.permanent_address.location;
    users.permanent_address.municipality = req.body.permanent_address.municipality;
    users.permanent_address.district = req.body.permanent_address.district;
    users.permanent_address.city = req.body.permanent_address.city;
    users.permanent_address.state = req.body.permanent_address.state;
    users.permanent_address.country = req.body.permanent_address.country || 'INDIA';
    users.permanent_address.zipcode = req.body.permanent_address.zipcode;

    users.address_proof_type = req.body.address_proof_type;
    users.address_proof_number = req.body.address_proof_number;
    users.citizenship = req.body.citizenship;
    users.occupation = req.body.occupation;
    users.education = req.body.education;
    users.religion = req.body.religion;
    users.caste = req.body.caste;
    users.incomegroup = req.body.incomegroup;
    users.mcts_id = req.body.mcts_id;
    users.height = req.body.height;
    users.height_units = req.body.height_units;
    users.weight = req.body.weight;
    users.weight_units = req.body.weight_units;
    users.on_boarding_start_time = req.body.on_boarding_start_time;
    users.on_boarding_end_time = req.body.on_boarding_end_time;
    users.medmantra_instant_UHID = req.body.medmantra_instant_UHID;
    users.clinic_uhid = req.body.clinic_uhid;
    users.consent_form = req.body.consent_form;
    users.is_consent_JH = req.body.is_consent_JH;

    users.isActive = req.body.isActive || true;
    users.role = "patient";
    users.author = req.body.author;
    users.author_type = req.body.author_type;
    // users.created = new Date();
    users.created = new moment().utcOffset(0);
    users.isDeleted = false;

    if (req.body.image && req.body.image.length > 0) {
        var imageBuffer = decodeBase64Image(req.body.image);
        require("fs").writeFile("../atnf/images/profile_pictures/" + users._id + '.png', imageBuffer.data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("profile picture saved!");
            }
        });
        users.image = "images/profile_pictures/" + users._id + '.png';

    }

    find_users.find({ first_name: { $regex: users.first_name, $options: 'i' }, gender: users.gender, phone: users.phone }, function (err, list) {
        if (err) {
            deferred.reject({
                status: "error",
                message: errorMessage
            });
        }
        else if (list.length > 1) {
            deferred.reject({
                status: "error",
                message: "Patient already exists.."
            });
        }
        else {
            users.save(function (error, userData) { // Save into the collection
                if (error) {
                    var errorMessage = require('./error_logs').getModelErrors(error);
                    deferred.reject({
                        status: "error",
                        message: errorMessage
                    });
                } else {
                    if (req.body.isPendingVitals && req.body.isPendingVitals == true) {
                       // addPatientToPendingVitals(userData); ---As per the V 1.0.45 requirement commented  
                    }
                    deferred.resolve({
                        status: "success",
                        message: userData
                    });
                }
            });
        }
    })


    return deferred.promise;
}

// Decode base64 into image
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}
// Find all the patients which are match with filter queries. i.e name or uhid

exports.findAllPatients = function (filter, pagination) {
    var users = model.model(false);
    var centers = center_model.model(false);
    var deferred = Q.defer();

    var apollo_clinics = false;
    var clinic_uhid = "";

    if (filter.is_apollo_clinics && filter.is_apollo_clinics == 'true') {
        apollo_clinics = true;
        clinic_uhid = filter.searchValue;
        delete (filter.is_apollo_clinics);
    }

    /**
    CHecking whether searchValue is Integer or not.
    If it is integer then search for Phone number or UUID
    If it is String then search for First_name or
    **/
    if (filter.searchValue && filter.searchValue.length > 0) {

        if (isNaN(filter.searchValue) === true) { // If search value is not number means, it will filter trough 
            filter = { // Patient name
                $or: [{
                    first_name: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    last_name: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    old_uhid: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    clinic_uhid: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }],
                application_id: filter.application_id
            }
        } else {

            filter = { // If search value will be  number, it will filter through mobile number
                $or: [{
                    phone: parseInt(filter.searchValue)
                }, {
                    uhid: filter.searchValue
                },{
                    aadhar_card: filter.searchValue
                },
                {
                    address_proof_number: filter.searchValue
                }],
                application_id: filter.application_id
            }
            
        }
    } else {
        filter = { application_id: filter.application_id };
    }



    users.paginate(
        filter, {
            columns: config.select_patient_list[0],
            page: pagination.page,
            limit: parseInt(pagination.limit),
            sort: pagination.sortBy
        },
        function (err, list) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            }

            else if (list.docs.length == 0 && apollo_clinics == true) // Need to search with PostgreSQL
            {
                searchWithPostgreSQL(clinic_uhid.toUpperCase()).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (err) {
                    deferred.reject(err)
                })
            }

            else {

                deferred.resolve({
                    status: 'success',
                    message: list.docs,
                    total_pages: list.pages,
                    total_items: list.total
                });


            }
        }
    );


    return deferred.promise;
};


exports.getPatientsWithVitalsByCenterID = function(filter, pagination){
    var users = model.model(false);
    var centers = center_model.model(false);
    var auto_vitals_upload = auto_vitals_upload_model.model(false);
    var deferred = Q.defer();


    /**
    CHecking whether searchValue is Integer or not.
    If it is integer then search for Phone number or UUID
    If it is String then search for First_name or
    **/
    var dateFilter = {
            $gte: new moment(filter.from).format('YYYY-MM-DD'),
            $lt: new moment(filter.to).add(1, 'day').format('YYYY-MM-DD')
    }
    if (filter.searchValue && filter.searchValue.length > 0) {

        if (isNaN(filter.searchValue) === true) { // If search value is not number means, it will filter trough 
            filter = { // Patient name
                $or: [{
                    first_name: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    last_name: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    old_uhid: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    clinic_uhid: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }],
                application_id: filter.application_id
            }
        } else {

            filter = { // If search value will be  number, it will filter through mobile number
                $or: [{
                    phone: parseInt(filter.searchValue)
                }, {
                    uhid: filter.searchValue
                }],
                application_id: filter.application_id
            }
        }
    } else if(filter.center_id && filter.center_id.length>0){
        filter = { application_id: filter.application_id, center_id : filter.center_id, created : dateFilter };
    }else{
        filter = { application_id: filter.application_id, created : dateFilter, auto_vitals_id:{$exists:true} };
    }

    users.paginate(
        filter, {
            columns: config.select_patient_vitals_list[0],
            page: pagination.page,
            limit: parseInt(pagination.limit),
            sort: pagination.sortBy,
            populate: [{
                path: 'auto_vitals_id',
                model: 'auto_vitals_upload',
                select: '_id  center_id vitals.BPM vitals.SPO2 vitals.THERM vitals.GLUCO isECG isSTETH'
            }]
        },
        function(err, list) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } 

            else {
                
                deferred.resolve({
                    status: 'success',
                    message: list.docs,
                    total_pages: list.pages,
                    total_items: list.total
                });


            }
        }
    );


    return deferred.promise;
}

exports.exportPatientsWithVitals = function(filter){
    var users = model.model(false);
    var centers = center_model.model(false);
    var auto_vitals_upload = auto_vitals_upload_model.model(false);
    var deferred = Q.defer();


    /**
    CHecking whether searchValue is Integer or not.
    If it is integer then search for Phone number or UUID
    If it is String then search for First_name or
    **/
    var dateFilter = {
            $gte: new moment(filter.from).format('YYYY-MM-DD'),
            $lt: new moment(filter.to).add(1, 'day').format('YYYY-MM-DD')
    }
    if (filter.searchValue && filter.searchValue.length > 0) {

        if (isNaN(filter.searchValue) === true) { // If search value is not number means, it will filter trough 
            filter = { // Patient name
                $or: [{
                    first_name: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    last_name: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    old_uhid: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }, {
                    clinic_uhid: {
                        '$regex': filter.searchValue,
                        '$options': 'i'
                    }
                }],
                application_id: filter.application_id
            }
        } else {

            filter = { // If search value will be  number, it will filter through mobile number
                $or: [{
                    phone: parseInt(filter.searchValue)
                }, {
                    uhid: filter.searchValue
                }],
                application_id: filter.application_id
            }
        }
    } else if(filter.center_id && filter.center_id.length>0){
        filter = { application_id: filter.application_id, center_id : parseInt(filter.center_id), created : dateFilter };
    }else{
        filter = { application_id: filter.application_id, created : dateFilter };
    }


    users.find(
        filter, {_id:1, first_name:1, last_name:1, uhid:1, age:1, gender:1, phone:1, email:1, created:1, present_address:1, auto_vitals_id:1})
        .populate([{
            path: 'auto_vitals_id',
            model: 'auto_vitals_upload',
            select: '_id  center_id vitals.BPM vitals.SPO2 vitals.THERM vitals.GLUCO isECG isSTETH'
        }])
        .exec(function(err, list) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } 

            else {
                
                deferred.resolve({
                    status: 'success',
                    message: list
                });


            }
        }
    );


    return deferred.promise;
}

function searchWithPostgreSQL(clinicUHID){

    var deferred = Q.defer();
    const connectionString = 'postgresql://mediintegra@52.66.177.40/hms'
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect((err) => {
        if (err) {
            console.error('connection error..', err.stack)
        } else {
            console.log('connected to postgresql')
        }
    })

    client.query('SELECT * FROM ahllclinics.custom_visit_wise_demographic_data WHERE mr_no = $1', [clinicUHID], (err, res) => {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            })
        }
        else if (res.rows && res.rows.length > 0) {
            res.rows[0].is_postgresql = true;
            deferred.resolve({
                status: "success",
                message: res.rows,
                total_pages: 1,
                total_items: res.rows.length
            })
        } else {
            deferred.resolve({
                status: "success",
                message: res.rows,
                total_pages: 1,
                total_items: res.rows.length
            })
        }

        client.end()
    })

    return deferred.promise;
}

// Getting particular Patient's Details based on _id
exports.findByPatientId = function (id) {
    var users = model.model(false);
    var centers = center_model.model(false);
    var districtModel = district_model.model(false);
    var municipalityModel = municipality_model.model(false);
    var locationModel = location_model.model(false);
    var stateModel = state_model.model(false);
    var deferred = Q.defer();


    users.find({
        _id: id // _id filter

    }).populate({
        path: 'present_address.district' // Populate present and permanent adderss with objects
    }).populate({
        path: 'present_address.location'
    }).populate({
        path: 'present_address.municipality'
    }).populate({
        path: 'present_address.state'
    }).populate({
        path: 'permanent_address.district'
    }).populate({
        path: 'permanent_address.municipality'
    }).populate({
        path: 'permanent_address.state'
    }).populate({
        path: 'permanent_address.location'
    }).exec(function (error, details) {

        if (error) {
            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });

        } else {
            deferred.resolve({
                status: "success",
                message: details
            })
        }
    });

    return deferred.promise;
}

exports.getPatientsWithVitalsByPatientID = function(id){
    var users = model.model(false);
    var centers = center_model.model(false);
    var districtModel = district_model.model(false);
    var municipalityModel = municipality_model.model(false);
    var locationModel = location_model.model(false);
    var stateModel = state_model.model(false);
    var auto_vitals_upload = auto_vitals_upload_model.model(false);
    var deferred = Q.defer();


    users.find({
        _id: id // _id filter

    }).populate([{
        path: 'auto_vitals_id',
        model: 'auto_vitals_upload',
        select: '_id  center_id vitals isECG isSTETH'
    }]).exec(function(error, details) {

        if (error) {
            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });

        } else {
            deferred.resolve({
                status: "success",
                message: details
            })
        }
    });

    return deferred.promise;
}

// Update the patients details based on _id
exports.updatePatient = function (data) {
    var users = model.model(false);
    var deferred = Q.defer();
    
    var tofind = data._id;
    data.age = data.age.years || data.age; // Extra field for existing patients
    var status_log = { // Setting status log for update
        message: data.log.changed_message,
        author: data.log.author,
        author_type: data.log.author_type,
        created: new Date()
    };
    if (data.status_log) {

        if (data.status_log && data.status_log.length > 0) {
            data.status_log.push(status_log);
        } else {
            data.status_log = [];
            data.status_log.push(status_log);
        }
    }

    if (data.image && data.image != 'undefined' && data.image.indexOf('images/profile_pictures') < 0) {
        var imageBuffer = decodeBase64Image(data.image);
        require("fs").writeFile("../atnf/images/profile_pictures/" + tofind + '.png', imageBuffer.data, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("profile picture updated!");
            }
        });
        data.image = "images/profile_pictures/" + tofind + '.png';

    } else {
        delete data.image;
    }

    delete (data._id);

    saveUserTrash(tofind).then(function (info) {
        users.findOneAndUpdate({ // Find the document and update
            _id: tofind
        }, data, function (err, updatedata) {
            if (err) {

                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } else {
                deferred.resolve({
                    status: 'success',
                    message: updatedata
                });

            }
        })


    })

    return deferred.promise;

}

// Delete patient record based on _id
exports.deletePatient = function (req) {

    var users = model.model(false);
    var deferred = Q.defer();
    var tofind = req.body._id;
    delete (req.body._id);
    req.body.isDeleted = true;
    req.body.deleted_time = new Date();

    var status_log = {
        message: 'Deleted by ' + req.body.deleted_person_name,
        author: req.body.deleted_by,
        author_type: req.body.deleted_by_role,
        created: new Date()
    };
    if (req.body.status_log && req.body.status_log.length > 0) {
        req.body.status_log.push(status_log);
    } else {
        req.body.status_log = [];
        req.body.status_log.push(status_log);
    }
    users.findOneAndRemove({
        _id: tofind
    }, function (err, data) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else {
            deferred.resolve({
                status: "success",
                message: "Resource Deleted Successfully"
            });
        }
    })
    return deferred.promise;

}


exports.checkPatientUniqueFields = function (data) {
    var patients = model.model(false);
    var deferred = Q.defer();

    patients.find({
        address_proof_number: data.address_proof_number
    },
        function (err, patientData) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } else if (patientData.length > 1) {
                deferred.reject({
                    status: 'error',
                    message: 'Already Someone have register with same Address Proof'
                });
            } else {
                deferred.resolve({
                    status: 'success',
                    message: 'NOT_DUPLICATE'
                });
            }
        })
    return deferred.promise;
}

// To get total count of out patients
exports.outPatientCount = function (req) {

    var patients = model.model(false);
    var deferred = Q.defer();
    var filters = {};
    if (req.query.days == 1) {
        var dat = new moment().format('DD-MM-YYYY');

        filters.created = {


            $gte: new Date(dat),
            $lt: new Date(dat)

        };
    } else {
        var first_day_of_month = new moment().date(1).format('YYYY-MM-DD');
        var last_day_of_month = new moment().date(30).add(1, 'days').format('YYYY-MM-DD');
        // if you take last day of month and given only lessthan so added one day to last day of month
        filters.created = {
            $gte: new moment(first_day_of_month).format('YYYY-MM-DD'), // Filter for current month
            $lt: new moment(last_day_of_month).format('YYYY-MM-DD')
        }

    }

    filters.center_id = req.query.center_id;

    patients.countDocuments(filters, function (err, list) {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            })
        } else {
            deferred.resolve({
                status: "success",
                message: list
            });
        }
    })
    return deferred.promise;

}

exports.findPatientsCountForCMDashboard = function (req) {
    var patients = model.model(false);
    var deferred = Q.defer();
    if (req.query.type == 'existing') {
        var first_day_of_month = new moment().date(1).format('YYYY-MM-DD');
        var last_day_of_month = new moment().date(30).add(1, 'days').format('YYYY-MM-DD');

        created = {
            $gte: new moment(first_day_of_month).format('YYYY-MM-DD'),
            $lt: new moment(last_day_of_month).format('YYYY-MM-DD')
        }
    } else {

        created = {
            $gte: new moment().format('YYYY-MM-DD'),
            $lt: new moment().add(1, 'day').format('YYYY-MM-DD')
        };
    };
    var final_results = {};

    async.parallel([

        function (callback) {
            patients.countDocuments({
                application_id: req.query.application_id,
                created: created
            },function (error, results) {

                final_results.total = results;

            });

        },

        function (callback) {

            patients.countDocuments({
                gender: "Male",
                age: {
                    $lte: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.male_childs = results;

            });

        },
        function (callback) {

            patients.countDocuments({
                gender: "Male",
                age: {
                    $gt: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.male_adults = results;

            });

        },
        function (callback) {

            patients.countDocuments({
                gender: "Female",
                age: {
                    $lte: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.female_childs = results;
            });

        },

        function (callback) {

            patients.countDocuments({
                gender: "Female",
                age: {
                    $gt: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.female_adults = results;

                deferred.resolve({
                    status: "success",
                    message: final_results
                });
            });
            callback();
        }
    ], function (err, result) {

        if (err) {

            deferred.reject({
                status: 'error',
                message: err
            });

        } else {

        }
    });

    return deferred.promise;

};

exports.getoutpatientCumilative = function (req) {
    var patients = model.model(false);
    var deferred = Q.defer();
    var first_day_of_month = new moment().date(1).format('YYYY-MM-DD');
    var last_day_of_month = new moment().date(30).add(1, 'days').format('YYYY-MM-DD');
    var filters = {};
    var created = {
        $gte: new moment(first_day_of_month).format('YYYY-MM-DD'),
        $lt: new moment(last_day_of_month).format('YYYY-MM-DD')
    }

    var dat = new moment().format('DD-MM-YYYY');

    var todayCreated = {

        $gte: new moment().format('YYYY-MM-DD'),
        $lt: new moment().add(1, 'days').format('YYYY-MM-DD')

    };
    var filterToday = {};
    var filterMonth = {};

    if (req.query.center_id) {
        filterToday.created = todayCreated;
        filterToday.center_id = req.query.center_id;

        filterMonth.created = created;
        filterMonth.center_id = req.query.center_id;

    } else if (!req.query.center_id) {
        filterToday.created = todayCreated;
        filterMonth.created = created;
    }

    filterMonth.application_id = req.query.application_id;
    filterToday.application_id = req.query.application_id;


    final_results = {};
    async.parallel([
        function (callback) {

            patients.countDocuments(filterMonth,function (error, results) {
                final_results.cumulative = results;

                callback(null, results);
            });

        },
        function (callback) {

            patients.countDocuments(filterToday, function (error, results) {
                final_results.today = results;
                callback(null, results);

            });

        }
    ], function done(err, result) {
        console.log("&&&&&&", final_results)
        if (err) {
            deferred.reject({
                status: 'error',
                message: err
            });
        } else {
            deferred.resolve({
                status: 'success',
                message: final_results
            });
        }
    });
    return deferred.promise;
};

// Once the patient get registered, then need to move that patient to pending vitals collection.
function addPatientToPendingVitals(user) {
    var pending_vital = require('../models/pending_vitals').model(true);
    var ObjectId = require('mongoose').Types.ObjectId;

    pending_vital._id = new ObjectId();
    pending_vital.patient_details = user._id;
    pending_vital.application_id = user.application_id;
    pending_vital.center_id = user.center_id;
    pending_vital.pending_vitals = true;
    pending_vital.is_remote_consultation = false;
    pending_vital.scheduled_on = new Date();
    pending_vital.created = new Date();
    pending_vital.save(function (error, userData) {
        if (error) {
            var errorMessage = require('./error_logs').getModelErrors(error);
            console.log(errorMessage);
        } else {
            console.log(userData);

        }
    })

}
exports.outPatientTotal = function (req) {
    var patients = model.model(false);
    var deferred = Q.defer();
    if (req.query.type == 'existing') {


        created = {
            $lt: new moment().format('YYYY-MM-DD')
        };

    } else {

        created = {
            $gte: new moment().format('YYYY-MM-DD'),
            $lt: new moment().add(1, 'day').format('YYYY-MM-DD')
        };
    };
    patients.find({
        created: created,
        application_id: req.query.application_id
    }, function (error, results) {
        results.length;

        if (error) {
            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: 'error',
                message: error
            });

        } else {
            deferred.resolve({
                status: "success",
                message: results
            })
        }
    });

    return deferred.promise;
}

exports.outPatientChild = function (req, res) {

    var patients = model.model(false);
    var deferred = Q.defer();
    if (req.query.type == 'existing') {


        created = {
            $lt: new moment().format('YYYY-MM-DD')
        };

    } else {

        created = {
            $gte: new moment().format('YYYY-MM-DD'),
            $lt: new moment().add(1, 'day').format('YYYY-MM-DD')
        };
    };
    patients.find({
        gender: req.query.gender,
        age: {
            $lte: MAX_CHILD_AGE
        },
        created: created,
        application_id: req.query.application_id
    }, function (error, results) {
        results.length;

        if (error) {
            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });

        } else {
            deferred.resolve({
                status: "success",
                message: results
            })
        }
    });

    return deferred.promise;
};

exports.outPatientAdult = function (req, res) {

    var patients = model.model(false);
    var deferred = Q.defer();
    if (req.query.type == 'existing') {
        created = {
            $lt: new moment().format('YYYY-MM-DD')
        };

    } else {

        created = {
            $gte: new moment().format('YYYY-MM-DD'),
            $lt: new moment().add(1, 'day').format('YYYY-MM-DD')
        };
    };
    patients.find({
        gender: req.query.gender,
        age: {
            $gt: 15
        },
        created: created,
        application_id: req.query.application_id
    }, function (error, results) {
        results.length;

        if (error) {
            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: 'error',
                message: error
            });

        } else {
            deferred.resolve({
                status: "success",
                message: results
            })
        }
    });

    return deferred.promise;

};
exports.getoutpatientDateWise = function (req) {
    var patients = model.model(false);
    var deferred = Q.defer();


    if (req.query.date == "today") {
        created = {
            $gte: new moment().format('YYYY-MM-DD'),
            $lt: new moment().add(1, 'day').format('YYYY-MM-DD')
        };

    } else if (req.query.date == "yesterday") {
        created = {
            $lt: new moment().format('YYYY-MM-DD'),
            $gte: new moment().add(-1, 'day').format('YYYY-MM-DD')
        };

    } else if (req.query.date == "lastweek") {
        created = {
            $lt: new moment().format('YYYY-MM-DD'),
            $gte: new moment().add(-6, 'day').format('YYYY-MM-DD')
        };

    } else if (req.query.date == "lastmonth") {
        created = {
            $lt: new moment().format('YYYY-MM-DD'),
            $gte: new moment().add(-30, 'day').format('YYYY-MM-DD')
        };

    }
    var final_results = {};
    async.parallel([

        function (callback) {
            patients.countDocuments({
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.total = results;

            });

        },

        function (callback) {

            patients.countDocuments({
                gender: "Male",
                age: {
                    $lte: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.male_childs = results;

            });

        },
        function (callback) {

            patients.countDocuments({
                gender: "Male",
                age: {
                    $gt: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.male_adults = results;

            });

        },
        function (callback) {

            patients.countDocuments({
                gender: "Female",
                age: {
                    $lte: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.female_childs = results;
            });

        },

        function (callback) {

            patients.countDocuments({
                gender: "Female",
                age: {
                    $gt: MAX_CHILD_AGE
                },
                created: created,
                application_id: req.query.application_id
            },function (error, results) {

                final_results.female_adults = results;

                deferred.resolve({
                    status: "success",
                    message: final_results
                });
            });
            callback();
        }
    ], function (err, result) {

        if (err) {

            deferred.reject({
                status: 'error',
                message: err
            });

        } else {

        }
    });

    return deferred.promise;
}



exports.uploadPatients = function (req) {

    var patientsData = model.model(true);
    var deferred = Q.defer();


    var inputFile = req.files.file.path;


    var finalData;

    var parser = parse({
        delimiter: ','
    }, function (err, data) {

        if (data && data.length > 1) {
            data.splice(0, 1); //array[0] is titles so deleting that
            var i = 0;
            async.eachSeries(data, function (line, callback) {


                finalData = {
                    center_name: "ntpc",
                    application_id: req.query.application_id || req.body.application_id,
                    center_id: 50,
                    created: new Date(),
                    on_boarding_start_time: new Date(),
                    on_boarding_end_time: new Date(),
                    old_uhid: line[0],
                    title: line[1],
                    age: line[6],
                    bloodgroup: line[7],
                    gender: line[4],
                    birthDate: line[5] != "NULL" ? new Date(line[5]) : "null",
                    phone: line[11],
                    marital_status: line[8],
                    occupation: line[9],
                    city: line[9],
                    address: line[10],
                    first_name: line[2],
                    //middle_name: line[10],
                    last_name: line[3],
                    //mother_name: line[12],
                    aadhar_card: line[16],
                    state: 4,
                    district: 300,
                    municipality: 2001,
                    location: 279595,
                    zipcode: 279595,
                    author: req.params.author,
                    author_type: req.params.authorType
                };

                // insertCenter(finalData, i);                
                insertPatient(finalData, i).then(function (data) {
                    i++;
                    callback();
                }).fail(function (err) {
                    callback();

                });
                //    i++;
                // callback();  

            })


            /* deferred.resolve({
                 status: "success",
                 message:finalData
             });*/


        } else {
            callback();

            /*
            deferred.reject({
                status: "error",
                message: "Please upload Valid Drug List"
            });*/


        }





    })



    fs.createReadStream(inputFile).pipe(parser);
    return deferred.promise;

}


function insertPatient(patientData, i) {
    var patients = model.model(false);
    var centers = center_model.model(false);
    var new_patient = model.model(true);

    var deferred = Q.defer();
    var patient;
    centers.find({
        first_name: patientData.center_name
    }).exec(function (e, centerData) {
        if (e) {
            deferred.reject({
                status: "error",
                message: e
            })
        } else if (centerData.length > 0) {
            patientData.center_id = centerData[0].center_id;

            patients.find({
                created: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(24, 0, 0, 0))
                }
            }).sort('_id').exec(function (err, patientsInfo) {

                if (err) {
                    deferred.reject({
                        status: "error",
                        message: err
                    })
                } else if (patientsInfo.length > 0) {
                    patientData.uhid = uIDFormat(patientData.state, 2) + uIDFormat(patientData.center_id, 4) + new moment().format('YYMMDD') + uIDFormat(patientsInfo.length + 1, 4);
                    patientData.center_id = patientData.center_id;
                    addPatientInfo(patientData).then(function (dt) {
                        deferred.resolve(dt);
                    });


                } else {
                    patientData.uhid = uIDFormat(patientData.state, 2) + uIDFormat(patientData.center_id, 4) + new moment().format('YYMMDD') + uIDFormat(patientsInfo.length + 1, 4);

                    patientData.center_id = patientData.center_id;
                    addPatientInfo(patientData).then(function (dt) {
                        deferred.resolve(dt);
                    });

                }

            })

        } else {
            deferred.reject({
                status: "error",
                message: "No center having name like " + patientData.center_name
            })
        }
    })
    return deferred.promise;

}

function addPatientInfo(patientData) {
    var new_patient = model.model(true);
    var deferred = Q.defer();

    var ObjectId = require('mongoose').Types.ObjectId;
    if (patientData.aadhar_card === 'NULL') {
        delete (patientData.aadhar_card);
    }

    new_patient._id = new ObjectId();
    new_patient.application_id = patientData.application_id;
    new_patient.uhid = patientData.uhid;
    new_patient.old_uhid = patientData.old_uhid;
    new_patient.center_id = patientData.center_id;
    new_patient.title = patientData.title || 'Mr.';
    new_patient.first_name = patientData.first_name;
    new_patient.middle_name = patientData.middle_name;
    new_patient.last_name = patientData.last_name;
    new_patient.email = patientData.email;
    //new_patient.phone = typeof(patientData.phone) == 'number' ? patientData.phone : 0000000000;
    new_patient.phone = patientData.phone ? parseInt(patientData.phone) : 0000000000;
    new_patient.alternative_phone = patientData.alternative_phone;
    new_patient.gender = patientData.gender;
    new_patient.marital_status = patientData.marital_status;
    new_patient.age = patientData.age;
    new_patient.birthDate = patientData.birthDate;
    new_patient.bloodgroup = patientData.bloodgroup || 'Unknown';
    new_patient.mother_name = patientData.mother_name;
    new_patient.relationship.relation_type = patientData.relation_type;
    new_patient.relationship.relation_value = patientData.relation_value;

    new_patient.aadhar_card = patientData.aadhar_card;
    new_patient.present_address.address = patientData.address;
    new_patient.present_address.municipality = patientData.municipality;
    new_patient.present_address.location = patientData.location;
    new_patient.present_address.district = patientData.district;
    new_patient.present_address.city = patientData.city;
    new_patient.present_address.state = patientData.state;
    new_patient.present_address.country = patientData.country || 'INDIA';
    new_patient.present_address.zipcode = patientData.zipcode;
    new_patient.is_same_address = patientData.is_same_address || true;

    new_patient.permanent_address = new_patient.present_address;

    new_patient.address_proof_type = patientData.address_proof_type;
    new_patient.address_proof_number = patientData.address_proof_number;
    new_patient.citizenship = patientData.citizenship || 'India';
    new_patient.occupation = patientData.occupation || 'self employee';
    new_patient.education = patientData.education;
    new_patient.religion = patientData.religion;
    new_patient.caste = patientData.caste;
    new_patient.incomegroup = patientData.incomegroup || 'Low';
    new_patient.mcts_id = patientData.mcts_id;
    new_patient.height = patientData.height;
    new_patient.height_units = patientData.height_units;
    new_patient.weight = patientData.weight;
    new_patient.weight_units = patientData.weight_units;
    new_patient.on_boarding_start_time = patientData.on_boarding_start_time || new Date();
    new_patient.on_boarding_end_time = patientData.on_boarding_end_time || new Date();

    new_patient.isActive = patientData.isActive || true;
    new_patient.role = "patient";
    new_patient.author = patientData.author;
    new_patient.author_type = patientData.author_type;
    new_patient.created = new Date(patientData.created) || new Date();
    new_patient.isDeleted = false;

    new_patient.save(function (error, userData) {
        if (error) {
            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: "error",
                message: errorMessage
            });
        } else {
            // addPatientToPendingVitals(userData);

            deferred.resolve({
                status: "success",
                message: "Patient is added "
            });
        }
    });
    return deferred.promise;

}


exports.uploadPatientsForCenter = function (req) {

    var patientsData = model.model(true);
    var deferred = Q.defer();
    var inputFile = req.files.file.path;
    var finalData;
    //req.params.camp_date = "2018-02-17"
    var parser = parse({
        delimiter: ','
    }, function (err, data) {
        if (data && data.length > 1) {
            data.splice(0, 1); //array[0] is titles so deleting that
            var i = 0;
            async.eachSeries(data, function (line, callback) {
                finalData = {

                    application_id: req.query.application_id || req.body.application_id,
                    center_id: 39,
                    created: new Date(line[25]),
                    on_boarding_start_time: new Date(line[25]),
                    on_boarding_end_time: new Date(line[25]),
                    title: line[0],
                    first_name: line[1],
                    last_name: line[2] || "---",
                    gender: line[3] || "---",
                    age: parseInt(line[4]) || 0,
                    relation_type: line[5],
                    relation_value: line[6],
                    birthDate: new Date(line[7]) || "---",
                    email: line[8],
                    phone: parseInt(line[9]),
                    bloodgroup: line[10] || "Unknown",
                    mother_name: line[11] || "---",
                    religion: line[12] || "---",
                    caste: line[13] || "---",
                    marital_status: line[14] || "UnMarried",
                    incomegroup: line[15] || "Low",
                    height: parseInt(line[16]) || 0,
                    height_units: line[17] || "cm",
                    weight: parseInt(line[18]) || 0,
                    weight_units: line[19] || "kg",
                    aadhar_card: line[20] || "000000000000",
                    education: line[21] || "---",
                    occupation: line[22] || "---",
                    citizenship: line[23] || "Indian",
                    old_uhid: line[24],
                    city: line[26] || "---",
                    address: line[28] || "---",
                    mcts_id: line[29] || "---",
                    state: req.params.state,
                    district: req.params.district,
                    municipality: req.params.municipality,
                    location: req.params.location,
                    country: line[27] || "---",
                    zipcode: req.params.zipcode,
                    author: req.params.author,
                    author_type: req.params.authorType
                };
                // insertCenter(finalData, i);                
                insertPatientForCenter(finalData, i).then(function (result) {

                    i++;
                    callback();
                    if (i == data.length) {
                        deferred.resolve({
                            status: "success",
                            message: "successfully uploaded"
                        })
                    }
                }).fail(function (err) {
                    deferred.reject({
                        status: "error",
                        message: err.message
                    })
                });
            })

        } else {
            callback();

        }
    })
    fs.createReadStream(inputFile).pipe(parser);
    return deferred.promise;
}

function insertPatientForCenter(patientData, i) {
    var patients = model.model(false);
    var centers = center_model.model(false);
    var new_patient = model.model(true);

    var deferred = Q.defer();
    var patient;
    console.log(i);
    centers.find({
        _id: patientData.center_id
        //application_id : patientData.application_id
    }).exec(function (e, centerData) {
        if (e) {
            deferred.reject({
                status: "error",
                message: e
            })
        } else if (centerData.length > 0) {

            patients.find({
                created: {
                    $gte: new moment(patientData.created),
                    $lt: new moment(patientData.created).add(1, 'days')
                }
            }).sort('_id').exec(function (err, patientsInfo) {

                if (err) {
                    deferred.reject({
                        status: "error",
                        message: err
                    })
                } else if (patientsInfo.length > 0) {
                    patientData.uhid = uIDFormat(patientData.state, 2) + uIDFormat(patientData.center_id, 4) + new moment(patientData.created).format('YYMMDD') + uIDFormat(patientsInfo.length + 1, 4);
                    patientData.center_id = patientData.center_id;
                    addPatientInfo(patientData).then(function (dt) {
                        deferred.resolve(dt);
                    });


                } else {
                    patientData.uhid = uIDFormat(patientData.state, 2) + uIDFormat(patientData.center_id, 4) + new moment(patientData.created).format('YYMMDD') + uIDFormat(1, 4);

                    patientData.center_id = patientData.center_id;
                    addPatientInfo(patientData).then(function (dt) {
                        deferred.resolve(dt);
                    });

                }

            })

        } else {
            deferred.reject({
                status: "error",
                message: "No center found"
            })
        }
    })
    return deferred.promise;
}

exports.getoutpatientZoneWise = function (req) {

    var patients = model.model(false);
    var centers = center_model.model(false);
    var groups = groups_model.model(false);
    var deferred = Q.defer();

    var filters = {};

    if (req.query.groupcode) {
        filters.center_group = req.query.groupcode;
    }
    if (req.query.district) {
        filters.district = {
            $regex: req.query.district,
            $options: 'i'
        };
    }
    if (req.query.muncipality) {
        filters.muncipality = {
            $regex: req.query.muncipality,
            $options: 'i'
        };
    }
    filters.application_id = req.query.application_id;


    centers.find(filters, function (error, centerdata) {

        var total_districts = _.groupBy(centerdata, 'district');
        var municipalities = _.map(total_districts, function (dis) {
            return _.groupBy(dis, 'muncipality');
        })


        async.forEach(municipalities, function (muncipalitylist, callback) {

            _.each(muncipalitylist, function (list) {

                var final_results = {};
                async.parallel([

                    function (callback) {
                        patients.countDocuments({
                            center_id: list[0]._id
                        },function (error, results) {

                            final_results.total = results;

                        });

                    },

                    function (callback) {

                        patients.countDocuments({
                            gender: "Male",
                            age: {
                                $lte: MAX_CHILD_AGE
                            },
                            center_id: list[0]._id
                        },function (error, results) {

                            final_results.male_childs = results;

                        });

                    },
                    function (callback) {

                        patients.countDocuments({
                            gender: "Male",
                            age: {
                                $gt: MAX_CHILD_AGE
                            },
                            center_id: list[0]._id
                        },function (error, results) {

                            final_results.male_adults = results;

                        });

                    },
                    function (callback) {

                        patients.countDocuments({
                            gender: "Female",
                            age: {
                                $lte: MAX_CHILD_AGE
                            },
                            center_id: list[0]._id
                        },function (error, results) {

                            final_results.female_childs = results;
                        });

                    },

                    function (callback) {

                        patients.countDocuments({
                            gender: "Female",
                            age: {
                                $gt: MAX_CHILD_AGE
                            },
                            center_id: list[0]._id
                        },function (error, results) {

                            final_results.female_adults = results;

                            deferred.resolve({
                                status: "success",
                                message: final_results
                            });
                        });
                        callback();
                    }
                ], function (err, result) {

                    if (err) {

                        deferred.reject({
                            status: 'error',
                            message: err
                        });

                    } else {

                    }
                });

            })
            callback();
        })
    });
    return deferred.promise;

}

//}


exports.patientsMapping = function (req) {
    var deferred = Q.defer();

    var inputFile = req.files.file.path;


    var parser = parse({
        delimiter: ','
    }, function (err, data) {

        //  if (data && data[0][0].toLowerCase() === 'drug code' && data[0][1].toLowerCase() === 'group name' && data[0][2].toLowerCase() === 'drug name' && data[0][3].toLowerCase() === 'strength' && data[0][4].toLowerCase() === 'type' && data[0][5].toLowerCase() === 'frequency' && data[0][6].toLowerCase() === 'category' && data[0][7].toLowerCase() === 'status') {
        // delete(data[0]); //array[0] is titles so deleting that

        data.splice(0, 1);
        async.forEach(data, function (line, callback) {

            // if (line[0] !== '') {
            var ObjectId = require('mongoose').Types.ObjectId;
            var users = model.model(true);
            users._id = new ObjectId();
            users.application_id = req.query.application_id || req.body.application_id;
            users.center_id = line[1];
            users.uhid = line[2];
            // users.title = line[0].title;
            users.first_name = line[3];
            // users.middle_name = line[0].middle_name;
            users.last_name = line[4];
            users.email = line[30];
            users.phone = line[16];
            users.alternative_phone = line[15];
            users.gender = line[10];
            users.marital_status = line[11];
            users.age = line[6];
            users.age_type_id = line[7];
            users.age_group_id = line[8];
            users.birthDate = line[9];
            users.bloodgroup = line[0].bloodgroup;
            users.mother_name = line[13];
            users.father_name = line[12];
            users.husband_name = line[14];
            // users.image = line[0].image;

            users.aadhar_card = line[21];
            users.present_address.address = line[35];
            users.present_address.village = line[20];
            users.present_address.municipality = line[19];
            users.present_address.district = line[18];
            users.present_address.city = line[38];
            users.present_address.state = line[17];
            users.present_address.country = 'INDIA';
            users.present_address.zipcode = line[39];
            users.is_same_address = true;

            users.permanent_address.address = line[24];
            users.permanent_address.village = line[40];
            users.permanent_address.municipality = line[28];
            users.permanent_address.district = line[27];
            users.permanent_address.city = line[25];
            users.permanent_address.state = line[26];
            users.permanent_address.country = 'INDIA';
            users.permanent_address.zipcode = line[29];

            /* users.address_proof_type = line[0].address_proof_type;
             users.address_proof_number = line[0].address_proof_number;*/
            users.citizenship = line[31];
            users.occupation = line[32];
            // users.education = line[].education;
            users.religion = line[33];
            // users.caste = line[0].caste;
            users.incomegroup = line[34];
            users.salutation = line[35];
            /*  users.mcts_id = line[0].mcts_id;
              users.height = line[0].height;
              users.height_units = line[0].height_units;
              users.weight = line[0].weight;
              users.weight_units = line[0].weight_units;
              users.on_boarding_start_time = line[0].on_boarding_start_time;
              users.on_boarding_end_time = line[0].on_boarding_end_time;*/

            users.isActive = true;
            users.role = "patient";
            users.author = line[21] || 'admin';
            users.author_type = line[0].author_type || 'admin';
            users.created = new Date();
            users.isDeleted = false;
            users.save(function (error, userData) {
                if (error) {
                    deferred.reject(error);
                } else {
                    callback();
                    deferred.resolve("success")
                }

            })

            //  }



            // callback();

        })

        //   }
    });

    fs.createReadStream(inputFile).pipe(parser);
    return deferred.promise;



}

function saveUserTrash(id) {

    var users = model.model(false);
    var users_trash = trash_model.model(true);

    var deferred = Q.defer();


    users.find({
        _id: id
    }, function (err, list) {

        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else if (list.length > 0) {
            var req = list[0];

            var ObjectId = require('mongoose').Types.ObjectId;


            users_trash._id = new ObjectId();
            users_trash.uhid = req.uhid;

            users_trash.application_id = req.application_id;
            users_trash.center_id = req.center_id;
            users_trash.users_trash_id = id;

            users_trash.title = req.title;
            users_trash.first_name = req.first_name;
            users_trash.middle_name = req.middle_name;
            users_trash.last_name = req.last_name;
            users_trash.email = req.email;
            users_trash.phone = req.phone;
            users_trash.alternative_phone = req.alternative_phone;
            users_trash.gender = req.gender;
            users_trash.marital_status = req.marital_status;
            users_trash.age = req.age;
            users_trash.birthDate = req.birthDate;
            users_trash.bloodgroup = req.bloodgroup;
            users_trash.relationship = req.relationship;
            users_trash.mother_name = req.mother_name;
            users_trash.image = req.image;

            users_trash.aadhar_card = req.aadhar_card;
            users_trash.present_address.address = req.present_address.address;
            users_trash.present_address.municipality = req.present_address.municipality;
            users_trash.present_address.district = req.present_address.district;
            users_trash.present_address.city = req.present_address.city;
            users_trash.present_address.state = req.present_address.state;
            users_trash.present_address.country = req.present_address.country || 'INDIA';
            users_trash.present_address.zipcode = req.present_address.zipcode;
            users_trash.is_same_address = req.is_same_address;

            users_trash.permanent_address.address = req.permanent_address.address;
            users_trash.permanent_address.municipality = req.permanent_address.municipality;
            users_trash.permanent_address.district = req.permanent_address.district;
            users_trash.permanent_address.city = req.permanent_address.city;
            users_trash.permanent_address.state = req.permanent_address.state;
            users_trash.permanent_address.country = req.permanent_address.country || 'INDIA';
            users_trash.permanent_address.zipcode = req.permanent_address.zipcode;

            users_trash.address_proof_type = req.address_proof_type;
            users_trash.address_proof_number = req.address_proof_number;
            users_trash.citizenship = req.citizenship;
            users_trash.occupation = req.occupation;
            users_trash.education = req.education;
            users_trash.religion = req.religion;
            users_trash.caste = req.caste;
            users_trash.incomegroup = req.incomegroup;
            users_trash.mcts_id = req.mcts_id;
            users_trash.height = req.height;
            users_trash.height_units = req.height_units;
            users_trash.weight = req.weight;
            users_trash.weight_units = req.weight_units;
            users_trash.on_boarding_start_time = req.on_boarding_start_time;
            users_trash.on_boarding_end_time = req.on_boarding_end_time;

            users_trash.isActive = req.isActive || true;
            users_trash.role = "patient";
            users_trash.author = req.author;
            users_trash.author_type = req.author_type;
            users_trash.status_log = req.status_log
            users_trash.created = new Date();
            users_trash.isDeleted = false;

            users_trash.save(function (error, userData) {
                if (error) {
                    var errorMessage = require('./error_logs').getModelErrors(error);
                    deferred.reject({
                        status: "error",
                        message: errorMessage
                    });
                } else {
                    deferred.resolve({
                        status: "success",
                        message: "move to trash Successfully "
                    });
                }
            })
        }
    })
    return deferred.promise;
}


exports.getRegisteredPatientsList = function (req, pagination) {

    var registered_users = model.model(false);
    var deferred = Q.defer();
    ///$gt: moment(date).format('YYYY-MM-DD'), $lt: moment(date).add(req.query.days || 1, 'days').format('YYYY-MM-DD')
    if (req.query.center_id) {
        var filter = {};
        var registered_date = req.query.registered_date;
        if (registered_date) {
            filter.created = { $gte: new moment(registered_date).format('YYYY-MM-DD'), $lt: new moment(registered_date).add(1, "day").format('YYYY-MM-DD') }
        }
        filter.application_id = req.query.application_id;
        filter.center_id = req.query.center_id;
        if(req.query.search)
        filter.search = req.query.search;
        
        registered_users.paginate(
            filter, {
                columns: config.select_patient_list[0],
                page: pagination.page,
                limit: parseInt(pagination.limit),
                sort: pagination.sortBy
            },
            function (err, patientsList) {
                if (err) {
                    deferred.reject({
                        status: 'error',
                        message: err
                    });
                } else {
                    deferred.resolve({
                        status: 'success',
                        message: patientsList.docs,
                        total_pages: patientsList.pages,
                        total_items: patientsList.total
                    });
                }
            }
        );
        return deferred.promise;
    }
};