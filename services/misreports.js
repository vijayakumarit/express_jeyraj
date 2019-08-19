var consultation_model = require('../models/consultations');
var patient_model = require('../models/users');
var test_model = require('../models/lims');
var lims_ranges_model = require('../models/lims_ranges');
var center_model = require('../models/centers');
var district_model = require('../models/districts');
var muncipal_model = require('../models/muncipality');
var immunization_model = require('../models/immunizations');
var resource_model = require("../models/resource");
var speciality_model = require("../models/specialities");


var Q = require('q');
var async = require('async');
var crypto = require('crypto');
var moment = require('moment');
var _ = require('underscore');
var config = require("../configurations/filters/users");

require('../configurations/dev')
var cm = require('../controllers/cmdashboard');


/**
* @api {get}  /mis/outpatient-reports?center_id = ** & created = {date}
* @apiParam {Number} center_id, {String} date
* @apiExample /mis/outpatient-reports?center_id = 162 & created = 2017-06-01

* @apiDescription
*  Get the out patients counts for reporting purpose. 
*  The output will be in the form of New petient and existing Patient along with
*  male child, female child, male adult, female adult and total

* @apiServiceDefinition {getOutPatientService}
*  filter - based on center_id and created date
*  lookup - Join two collection using patient_uhid
*  map - new patient or existing patient array
*  result - based on gender, age reduce and sum the total

*/
exports.getOutPatientService = function(req) {

    var consultations = consultation_model.model(false);
    var outpatients = patient_model.model(false);
    var deferred = Q.defer();

    var startOfMonth = moment(req.query.date).startOf('month').format('YYYY-MM-DD');
    var endOfMonth = moment(req.query.date).endOf('month').format('YYYY-MM-DD');

   // var start_date = req.query.start_date;
    var start_date = new Date(req.query.start_date);
    var end_date = moment(req.query.end_date).add(1, 'day').format('YYYY-MM-DD')
    var tmrw = moment().add(1, 'day').format('YYYY-MM-DD')
    var tday = moment().format('YYYY-MM-DD')

    var filter = {
        created : {$gte: new Date(tday), $lt: new Date(tmrw)},
        is_remote_consultation : false
       /* $and: [
            //{ center_id: parseInt(req.query.center_id) },
            { created: { $gte: new Date() } },
            { created: { $lt: new Date() } }
        ]*/
    }
    var cumulativeFilter = {
        created : {$gte: new Date(start_date), $lt: new Date(end_date)},
        is_remote_consultation : false
        /*$and: [
            //{ center_id: parseInt(req.query.center_id) },
            { created: { $gte: new Date(start_date) } },
            { created: { $lt: new Date(end_date) } }
        ]*/
    };

    if (req.query.center_id && req.query.center_id != '') {
        filter.center_id = parseInt(req.query.center_id);
        cumulativeFilter.center_id = parseInt(req.query.center_id);
    }
    if (req.query.application_id && req.query.application_id != '') {
        filter.application_id = req.query.application_id;
        cumulativeFilter.application_id = req.query.application_id;
    }
    var newPatientsFilter = Object.assign({}, cumulativeFilter);
    newPatientsFilter.visit_type = {'$regex':"new", $options:"i"};

    var existingPatientsFilter = Object.assign({}, cumulativeFilter);
    existingPatientsFilter.$or = [{visit_type:'REPEAT'},{visit_type:'REVIEW'}];

    /*async.parallel([function(callback) {  // CALLBACK FOR CUMULATIVE (BASED ON DATE RANGE)
        // $Lookup
        consultations.aggregate([{
            $match: cumulativeFilter
        }, {
            $lookup: {
                from: 'patients',
                localField: 'patient_id',
                foreignField: '_id',
                as: 'outpatient'
            }
        },
        {
            $match : {"outpatient.0":{$exists:true}}
        },
        {
            $project:{
                "_id":1, 
                "patient_id":1, 
                "patient_uhid":1,
                "outpatient.gender":1, 
                "outpatient.age":1, 
                "outpatient.created":1
            }
        }]).allowDiskUse(true).exec(function(err, list) {

            var result = {};
            var existing_patient = [];
            var new_patient = [];

            if (list.length > 0) {
                _.map(list, function(patient) {
                    if(patient.outpatient.length>0){
                        if ((new Date(patient.outpatient[0].created)).setHours(0, 0, 0, 0) === (new Date().setHours(0, 0, 0, 0))) {
                        //new_patient.total = new_patient.total + 1
                        new_patient.push(patient.outpatient[0])
                        } else {
                            //existing_patient.total = existing_patient.total + 1
                            existing_patient.push(patient.outpatient[0])
                        }
                    }
                })

                // Existing Patient
                var existing_male_child = existing_patient.filter(value => value.age < 6 && value.gender.toLowerCase() == 'male').length;
                var existing_female_child = existing_patient.filter(value => value.age < 6 && value.gender.toLowerCase() == 'female').length;
                var existing_male_adult = existing_patient.filter(value => value.age > 5 && value.gender.toLowerCase() == 'male').length;
                var existing_female_adult = existing_patient.filter(value => value.age > 5 && value.gender.toLowerCase() == 'female').length;
                var existing_patient_length = existing_patient.length;

                // New Patient
                var new_male_child = new_patient.filter(value => value.age < 6 && value.gender.toLowerCase() == 'male').length;
                var new_female_child = new_patient.filter(value => value.age < 6 && value.gender.toLowerCase() == 'female').length;
                var new_male_adult = new_patient.filter(value => value.age > 5 && value.gender.toLowerCase() == 'male').length;
                var new_female_adult = new_patient.filter(value => value.age > 5 && value.gender.toLowerCase() == 'female').length;
                var new_patient_length = new_patient.length


                result.existing_patient = {
                    male_child: existing_male_child,
                    female_child: existing_female_child,
                    male_adult: existing_male_adult,
                    female_adult: existing_female_adult,
                    total: existing_patient_length
                }
                result.new_patient = {

                    male_child: new_male_child,
                    female_child: new_female_child,
                    male_adult: new_male_adult,
                    female_adult: new_female_adult,
                    total: new_patient_length
                }
                result.total = {
                    male_child_total: existing_male_child + new_male_child,
                    female_child_total: existing_female_child + new_female_child,
                    male_adult_total: existing_male_adult + new_male_adult,
                    female_adult_total: existing_female_adult + new_female_adult,
                    cumulative_count: existing_patient_length + new_patient_length
                }

            } else {
                result.existing_patient = {
                    male_child: 0,
                    female_child: 0,
                    male_adult: 0,
                    female_adult: 0,
                    total: 0
                }
                result.new_patient = {

                    male_child: 0,
                    female_child: 0,
                    male_adult: 0,
                    female_adult: 0,
                    total: 0
                }
                result.total = {
                    male_child_total: 0,
                    female_child_total: 0,
                    male_adult_total: 0,
                    female_adult_total: 0,
                    cumulative_count: 0
                }
            }


            if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                callback(null, result);
            }
        })  // Aggregation - END
    }, function(callback) {   // CALLBACK FOR GETTING TODAY'S COUNT
        consultations.aggregate([{
            $match: filter
        },{
            $count : "today_count"
        }], function(err, list) {

            if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                var result = {};
                result.today_count = list.length>0 ? list[0].today_count : 0;
                callback(null, result);
            }
        })
    }], function done(error, result) {
        if (error) {
            deferred.reject({
                status: "error",
                message: error
            })
        } else {
            var finalResult = {};
            finalResult = result[0];
            finalResult.total.today_count = result[1].today_count;
            deferred.resolve({
                status: "success",
                message: finalResult
            })
        }
    })*/

    consultations.aggregate([
    {
        $facet:{
            "cumulative_count" : [
                {$match:cumulativeFilter},
                {$count:"total"}
            ],
            "today_count": [
                 {$match:filter},
                 {$count:"total"}
                ],
            "new_patients": [
                    {$match: newPatientsFilter},
                    {$lookup:{
                            "from": "patients",
                            "localField": "patient_id",
                            "foreignField": "_id",
                            "as" : "patient_details"
                        }
                     },
                     {$match : {"patient_details.0":{$exists:true}}},
                     {$unwind:"$patient_details"},
                     {$project : {
                         _id:1, 
                         patient_id:1, 
                         patient_uhid:1, 
                         "gender":"$patient_details.gender", 
                         "age":"$patient_details.age",
                         "male_child":{$cond:[{$and:[{$lt:["$patient_details.age", 6]},{$eq:["$patient_details.gender", 'Male']}]},1,0]},
                         "female_child":{$cond:[{$and:[{$lt:["$patient_details.age", 6]},{$eq:["$patient_details.gender", 'Female']}]},1,0]},
                         "male_adult":{$cond:[{$and:[{$gt:["$patient_details.age", 5]},{$eq:["$patient_details.gender", 'Male']}]},1,0]},
                         "female_adult":{$cond:[{$and:[{$gt:["$patient_details.age", 5]},{$eq:["$patient_details.gender", 'Female']}]},1,0]}
                         }
                         },
                         {
                             $group : {_id:"new_patients",
                                 male_child : {$sum:"$male_child"},
                                 female_child : {$sum:"$female_child"},
                                 male_adult : {$sum:"$male_adult"},
                                 female_adult : {$sum:"$female_adult"},
                                 total : {$sum:1}
                                 }
                             }
                     
                     //{$project : {_id:1, patient_id:1, patient_uhid:1, "gender":"$patient_details.gender", "age":"$patient_details.age"}},
                     //{$count:"total"}
                 ],
            "existing_patients": [
                    {$match:existingPatientsFilter},
                    {$lookup:{
                            "from": "patients",
                            "localField": "patient_id",
                            "foreignField": "_id",
                            "as" : "patient_details"
                        }
                     },
                     {$match : {"patient_details.0":{$exists:true}}},
                     {$unwind:"$patient_details"},
                     {$project : {
                         _id:1, 
                         patient_id:1, 
                         patient_uhid:1, 
                         "gender":"$patient_details.gender", 
                         "age":"$patient_details.age",
                         "male_child":{$cond:[{$and:[{$lt:["$patient_details.age", 6]},{$eq:["$patient_details.gender", 'Male']}]},1,0]},
                         "female_child":{$cond:[{$and:[{$lt:["$patient_details.age", 6]},{$eq:["$patient_details.gender", 'Female']}]},1,0]},
                         "male_adult":{$cond:[{$and:[{$gt:["$patient_details.age", 5]},{$eq:["$patient_details.gender", 'Male']}]},1,0]},
                         "female_adult":{$cond:[{$and:[{$gt:["$patient_details.age", 5]},{$eq:["$patient_details.gender", 'Female']}]},1,0]}
                         }
                         },
                         {
                             $group : {_id:"existing_patients",
                                 male_child : {$sum:"$male_child"},
                                 female_child : {$sum:"$female_child"},
                                 male_adult : {$sum:"$male_adult"},
                                 female_adult : {$sum:"$female_adult"},
                                 total : {$sum:1}
                                 }
                             }
                 ] 
        
        }}

    ]).allowDiskUse(true).exec(function(err, list) {

        if(err){
            deferred.reject({
                status : "error",
                message : err
            })
        }else{
            deferred.resolve({
                status : "success",
                message : list
            })
        }
    })

    return deferred.promise;

}


/**
* @api {get}  /mis/tele-consultancy?center_id = ** & created = {date}
* @apiParam {Number} center_id, {String} date
* @apiExample /mis/tele-consultancy?center_id = 162 & created = 2017-06-01

* @apiDescription
*  Get the Teleconsultancy counts for reporting purpose. 
*  The output will be in the form of specialities along with
*  male child, female child, male adult, female adult and total

* @apiServiceDefinition {getTeleconsultancyService}
*  filter - based on center_id and created date
*  lookup - Join two collection using patient_uhid
*  groupby - grouping based on speciality
*  map - new patient or existing patient array
*  result - based on gender, age reduce and sum the total

*/
exports.getTeleconsultancyService = function(req) {
    var consultations = consultation_model.model(false);
    var outpatients = patient_model.model(false);
    var deferred = Q.defer();

    /*var filter = {
        center_id: parseInt(req.query.center_id),
        created: {
            $gte: new moment().format('YYYY-MM-DD'),
            $lt: new moment().add(1, 'day').format('YYYY-MM-DD')
        }
    }*/
    var filter = {
         //"created" : {$gte:new Date(start_date), $lt : new Date(end_date)},
         "speciality" : {$exists: true },
         "is_remote_consultation": true
    }
    if((req.query.start_date && req.query.start_date != '') && (req.query.end_date && req.query.end_date != '')){

        var start_date = moment(req.query.start_date).format('YYYY-MM-DD')
        var end_date = moment(req.query.end_date).add(1, 'days').format('YYYY-MM-DD')
        filter.created = {'$gte':new Date(start_date), '$lt' : new Date(end_date)}
    }
    if (req.query.center_id && req.query.center_id != '') {
        filter.center_id = parseInt(req.query.center_id)
    }
    if (req.query.application_id && req.query.application_id != '') {
        filter.application_id = req.query.application_id
    }
    consultations.aggregate([{
        $match: filter
    }, {
        $lookup: {
            from: 'patients',
            localField: 'patient_id',
            foreignField: '_id',
            as: 'teleconsultancy'
        }
    },{
        $match : {'teleconsultancy.0':{$exists:true}}
    }, {
        $project : {_id:1, "teleconsultancy":1, created:1, "speciality":1}
    }]).allowDiskUse(true).exec(function(err, list) {

        if(list.length>0){

            // _.chain - chain of functions. groupby speciality then map each objects 
        //and getting only patients details. Then push patient details into array, then count the length
        var result = _.chain(list)
            .groupBy('speciality')
            .map(function(value, key) {
                let teleconsultancyobjs = []
                _.each(value, function(item) {
                    if(item.teleconsultancy.length>0){
                        teleconsultancyobjs.push(item.teleconsultancy[0])
                    }
                    
                })

                // Find Array length based on conditions in Underscore
                let male_child_total = _.countBy(teleconsultancyobjs, function(num) {
                    return (num.age < 6 && num.gender.toLowerCase() == 'male')
                }).true || 0
                let female_child_total = _.countBy(teleconsultancyobjs, function(num) {
                    return (num.age < 6 && num.gender.toLowerCase() == 'female')
                }).true || 0
                let male_adult_total = _.countBy(teleconsultancyobjs, function(num) {
                    return (num.age > 6 && num.gender.toLowerCase() == 'male')
                }).true || 0
                let female_adult_total = _.countBy(teleconsultancyobjs, function(num) {
                    return (num.age > 6 && num.gender.toLowerCase() == 'female')
                }).true || 0

                // Find Array length based on conditions in ES6
                //let male_child_total = teleconsultancyobjs.filter(value1 => value1.age < 6 && value1.gender.toLowerCase() == 'male').length 
                //let female_child_total = teleconsultancyobjs.filter(value1 => value1.age < 6 && value1.gender.toLowerCase() == 'female').length
                //let male_adult_total = teleconsultancyobjs.filter(value1 => value1.age > 5 && value1.gender.toLowerCase() == 'male').length 
                //let female_adult_total = teleconsultancyobjs.filter(value1 => value1.age > 5 && value1.gender.toLowerCase() == 'female').length

                // Return data(count) based on speciality
                return {
                    //[key]: {
                    title: key,
                    male_child: male_child_total,
                    female_child: female_child_total,
                    male_adult: male_adult_total,
                    female_adult: female_adult_total,
                    total: male_child_total + female_child_total + male_adult_total + female_adult_total
                    //}
                }
            })
            .value();

        // map - to format array of objects
        var groupMapList = _.map(result, function(num, key) {
            return num
        })


        // map - getting count in the form of array. i.e [0,1,6]
        var total_m_c = _.map(groupMapList, function(x, y) {
            return x.male_child
        })

        var total_fm_c = _.map(groupMapList, function(x) {
            return x.female_child
        })
        var total_m_a = _.map(groupMapList, function(x) {
            return x.male_adult
        })
        var total_fm_a = _.map(groupMapList, function(x) {
            return x.female_adult
        })
        var total_total = _.map(groupMapList, function(x) {
            return x.total
        })


        // reduce - reduce the above array into single value. i.e [0,5,8] into 13 and assign into total object
        let final_total = {
            //total: {
            title: "total",
            male_child_total: _.reduce(total_m_c, function(pre, next) {
                return pre + next
            }, 0),
            female_child_total: _.reduce(total_fm_c, function(pre, next) {
                return pre + next
            }, 0),
            male_adult_total: _.reduce(total_m_a, function(pre, next) {
                return pre + next
            }, 0),
            female_adult_total: _.reduce(total_fm_a, function(pre, next) {
                return pre + next
            }, 0),
            all_total: _.reduce(total_total, function(pre, next) {
                return pre + next
            }, 0)
            // }
        }

        // Append the final_total after last index of results array
        result[result.length] = final_total

        if (err) {
            deferred.reject({
                status: 'error',
                message: err
            })
        } else {
            deferred.resolve({
                status: 'success',
                message: result
            })
        }

        }
        else{
            deferred.resolve({
                status : 'success',
                message : []
            })
        }
        
    })

    return deferred.promise;

}

/**
* @api {get}  /mis/attendance-month?center_id = ** & created = {date}
* @apiParam {Number} center_id, {String} date
* @apiExample /mis/attendance-month?center_id = 162 & created = 2017-06-01

* @apiDescription
*  Get the attendance report for month.

* @apiServiceDefinition {getAttendanceForMonth}
*  filter - based on center_id and created date. created date will any date in a month.
    filter automatically take the whole month and give the result.

*/


// Get attendance for particular month
exports.getAttendanceForMonth = function(req, res) {
    var consultations = consultation_model.model(false);
    var deferred = Q.defer()
    var currentdate = new Date();

    var month = currentdate.getMonth();
    var year = currentdate.getFullYear();
    var result = {}
    result.morning = []
    result.evening = []
    //var firstDay = new Date(year, month, 1);
    //var lastDay = new Date(year, month + 1, 0);
    var firstDay = moment().startOf('month');
    var lastDay = moment().endOf('month');

    console.log(firstDay, lastDay)

    var filter = {
        center_id: 109,
        created: {
            $gte: new Date(firstDay),
            $lte: new Date(lastDay)
        }
    }
    filter.application_id = req.query.application_id;

    consultations.find(filter, { _id: 1, created: 1 }, function(err, list) {
        console.log(list.length)

        for (var m = moment(firstDay); m.isBefore(lastDay); m.add(1, 'days')) {
            // console.log(moment(m.format('YYYY-MM-DD') + " " + '08:00:00'));

            let morning_start = moment(m.format('YYYY-MM-DD') + " " + '08:00:00.000Z');
            let morning_end = moment(m.format('YYYY-MM-DD') + " " + '12:00:00.000Z');
            let evening_start = moment(m.format('YYYY-MM-DD') + " " + '16:00:00.000Z');
            let evening_end = moment(m.format('YYYY-MM-DD') + " " + '20:00:00.000Z');
            //console.log(evening_start, evening_end) 

            let attend_morn = _.find(list, function(num) {
                return moment(num.created).
                isBetween(morning_start, morning_end);
            });
            let attend_even = _.find(list, function(num) {
                return moment(num.created).
                isBetween(evening_start, evening_end);
            });
            //console.log(attend);
            /* if(attend_morn){

             }*/

            result.morning.push(attend_morn !== undefined ? 1 : 0)
            result.evening.push(attend_even !== undefined ? 1 : 0)


        }
        console.log(result.morning.length)
        console.log(result.evening.length)
        let total_morning_shifts = _.countBy(result.morning, function(num) {
            return num
        })
        let total_evening_shifts = _.countBy(result.evening, function(num) {
            return num
        })
        console.log(total_morning_shifts, total_evening_shifts)

        result.total_shifts_working = total_morning_shifts['1'] + total_evening_shifts['1'] || 0;
        result.total_shifts_not_working = total_morning_shifts['0'] + total_evening_shifts['0'];
        let total_days_not_working = 0;
        let total_days_working = 0;
        for (let i = 0; i < result.morning.length; i++) {
            if (result.morning[i] == 0 && result.evening[i] == 0) {
                total_days_not_working += 1;
            } else {
                total_days_working += 1;
            }
            console.log(i)
        }
        result.total_days_working = total_days_working;
        result.total_days_not_working = total_days_not_working;

        // Convert to PDF
        var layout = `<ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
        </ul>`;

        //toPDF(layout);

        deferred.resolve({
            status: 'success',
            message: result
        })


    })

    return deferred.promise;
}

function toPDF(htmlw) {

}


exports.getLabTestFromCMDashboard = function(passcode, CenterId, AttrId, Count, ProviderId, date) {
    var options = {
        host: '103.15.74.27',
        port: 8094,
        path: '/api/eUPHC/eUPHCKpiCountInsert?passcode=' + passcode + '&CenterId=' + CenterId + '&AttrId=' + AttrId + '&Count=' + Count + '&ProviderId=' + ProviderId + '&date=' + date,
        method: 'POST'

    };


    var req = http.request(options, function(res) {
        // console.log("response ", res)
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log("body: " + chunk);
        });
    });

    req.write(data.toString());
    req.end()
    res.send("Submitted Successfully");
}



exports.findTeleconsultancyCount = function(req) {

    var consultations = consultation_model.model(false);
    var users = patient_model.model(false);
    var doctor = resource_model.model(false);
    var specialitys = speciality_model.model(false);
    var today = new moment().format('YYYY-MM-DD');
    var deferred = Q.defer();
    if (req.query.type === 'existing') {
        var first_day_of_month = moment().startOf('month').format('YYYY-MM-DD');
        var last_day_of_month = moment().endOf('month').format('YYYY-MM-DD');
        console.log(first_day_of_month, last_day_of_month)
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


    var result = [];
    j = 0;
    specialitys.find({

    }, function(e, specialitiesList) {
        async.forEach(specialitiesList, function(speciality, callback) {

            consultations.find({
                    application_id: req.query.application_id,
                    speciality: speciality.title,
                    is_remote_consultation: true,
                    is_closed: true,
                    created: created
                }).populate(['patient_id', 'doctor_id'])
                .exec(function(error, consultationsList) {


                    final_results = {};
                    final_results.speciality = speciality.title;

                    final_results.total = consultationsList.length;

                    var maleChildResult = _.filter(_.where(_.pluck(consultationsList, 'patient_id'), {
                        gender: 'Male'
                    }), function(v) {
                        return v.age <= 15
                    });

                    final_results.male_childs = maleChildResult.length;

                    var femaleChildResult = _.filter(_.where(_.pluck(consultationsList, 'patient_id'), {
                        gender: 'Female'
                    }), function(v) {
                        return v.age <= 15
                    });

                    final_results.female_childs = femaleChildResult.length;
                    var maleAdultResults = _.filter(_.where(_.pluck(consultationsList, 'patient_id'), {
                        gender: 'Male'
                    }), function(v) {
                        return v.age > 15
                    });

                    final_results.male_adults = maleAdultResults.length;

                    var femaleAdultResult = _.filter(_.where(_.pluck(consultationsList, 'patient_id'), {
                        gender: 'Female'
                    }), function(v) {
                        return v.age > 15
                    });

                    final_results.female_adults = femaleAdultResult.length;

                    result.push(final_results);

                    if (error) {
                        deferred.reject({
                            status: 'error',
                            message: error
                        });
                    } else if (result.length == j) {
                        /*
                                                for (var i = 0; i <= result.length - 1; i++) {
                                                    if (result[i].speciality == "General Medicine") {

                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 116, result[0].male_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 117, result[0].female_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 118, result[0].male_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 119, result[0].female_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 204, result[0].total, PROVIDERID, today, function(res) {});
                                                    }
                                                    if (result[i].speciality == "Cardiology") {

                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 120, result[0].male_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 121, result[0].female_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 122, result[0].male_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 123, result[0].female_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 205, result[0].total, PROVIDERID, today, function(res) {});
                                                    }
                                                    if (result[i].speciality == "Orthopedics/Rheumatology") {

                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 124, result[0].male_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 125, result[0].female_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 126, result[0].male_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 127, result[0].female_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 206, result[0].total, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 128, result[0].male_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 129, result[0].female_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 130, result[0].male_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 131, result[0].female_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 207, result[0].total, PROVIDERID, today, function(res) {});
                                                    }
                                                    if (result[i].speciality == "Endocrinology") {

                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 132, result[0].male_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 133, result[0].female_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 134, result[0].male_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 135, result[0].female_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 208, result[0].total, PROVIDERID, today, function(res) {});
                                                    }
                                                    if (result[i].speciality == "Diabetology") {

                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 136, result[0].male_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 137, result[0].female_adults, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 138, result[0].male_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 139, result[0].female_childs, PROVIDERID, today, function(res) {});
                                                        cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 209, result[0].total, PROVIDERID, today, function(res) {});
                                                    }

                                                }*/

                        deferred.resolve({
                            status: "success",
                            message: result

                        });
                    }
                });
            j++;
            callback();
        });

    });
    return deferred.promise;
};


exports.findLISBiochemistryCount = function(req) {

    var test = test_model.model(false);
    var users = patient_model.model(false);
    var testrange = lims_ranges_model.model(false);
    var deferred = Q.defer();
    var today = new moment().format('YYYY-MM-DD');
    var start_date = req.query.start_date || moment().format('YYYY-MM-DD');
    var end_date = moment(req.query.end_date).add(1, 'day').format('YYYY-MM-DD') || moment().add(1, 'day').format('YYYY-MM-DD')

    var result = [];
    j = 0;

    var filter = {
        test_group: {
            $regex: req.query.group_name,
            $options: 'i'
        }
    }
    var filter_tests = {
        created: { $gte: new Date(start_date), $lt: new Date(end_date) },
        //test_name: tests.test_name,
        is_reports_authenticated: true
    }
    if (req.query.center_id && req.query.center_id != '') {
        filter.center_id = req.query.center_id
        filter_tests.center_id = parseInt(req.query.center_id)
    }
    if (req.query.application_id && req.query.application_id != '') {
        filter.application_id = req.query.application_id
        filter_tests.application_id = req.query.application_id
    }


    test.find(filter, function(err, testlist) {
        async.forEach(testlist, function(tests, callback) {
            filter_tests.test_name = tests.test_name;
            test.find(filter_tests).populate('patient_id')
                .exec(function(error, results) {

                    var final_results = {};

                    final_results.testname = tests.test_name;

                    final_results.total = results.length;

                    var maleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.male_childs = maleChildResult.length;

                    var femaleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.female_childs = femaleChildResult.length;
                    var maleAdultResults = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.male_adults = maleAdultResults.length;

                    var femaleAdultResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.female_adults = femaleAdultResult.length;

                    result.push(final_results);

                    if (error) {
                        deferred.reject({
                            status: 'error',
                            message: error
                        });
                    } else if (result.length == j) {
                        var final = _.uniq(result, 'testname')
                        final[final.length] = {
                            test_name: "total",
                            male_childs: final.reduce((val1, val2) => { return val1 + val2.male_childs }, 0),
                            female_childs: final.reduce((val1, val2) => { return val1 + val2.female_childs }, 0),
                            male_adults: final.reduce((val1, val2) => { return val1 + val2.male_adults }, 0),
                            female_adults: final.reduce((val1, val2) => { return val1 + val2.female_adults }, 0),
                            total: final.reduce((val1, val2) => { return val1 + val2.total }, 0)
                        }


                        deferred.resolve({
                            status: "success",
                            message: final

                        });
                    }

                })
            j++;
            callback();
        })

    });


    return deferred.promise;
};

exports.getParameterWiseLabReportsCount = function(req){
    var test = test_model.model(false);
    var users = patient_model.model(false);
    var testrange = lims_ranges_model.model(false);
    var deferred = Q.defer();

    var start_date = req.query.start_date;
    var end_date = moment(req.query.end_date).add(1, 'day').format('YYYY-MM-DD');
    var tmrw = moment().add(1, 'day').format('YYYY-MM-DD');
    var tday = moment().format('YYYY-MM-DD')

    var cumulative_filter = {
        "is_reports_authenticated" : true,
        "reports.0" : {$exists : true},
        "created" : {$gte:new Date(start_date), $lt : new Date(end_date)}
    }
    var today_filter = {
        "is_reports_authenticated" : true,
        "reports.0" : {$exists : true},
        "created" : {$gte:new Date(tday), $lt : new Date(tmrw)}
    }
    if (req.query.center_id && req.query.center_id != '') {
        cumulative_filter.center_id = parseInt(req.query.center_id)
        today_filter.center_id = parseInt(req.query.center_id)
    }
    if (req.query.application_id && req.query.application_id != '') {
        cumulative_filter.application_id = req.query.application_id
        today_filter.application_id = req.query.application_id
    }

    async.parallel([function(callback) { // CALLBACK FOR CUMULATIVE (BASED ON DATE RANGE)
        // $Lookup
        test.aggregate([
        {  
            $match : cumulative_filter
        },
        {   $lookup:{
                from : 'patients',
                localField : 'patient_id',
                foreignField : '_id', 
                as : 'patientDetails'
            }
        },
        {
            $addFields : {'reports.test_id':'$test_id', 'reports.test_name':'$test_name',
                          'reports.patient_age': {$arrayElemAt: [ "$patientDetails.age", 0 ]},
                          'reports.patient_gender':{$arrayElemAt: ["$patientDetails.gender", 0]},
                          'reports.patient_male_child':{$cond:[{$and:[{$lt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 6]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Male"]}
                                                                      ]},1,0
                                                                      ]},
                           'reports.patient_female_child':{$cond:[{$and:[{$lt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 6]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Female"]}
                                                                      ]},1,0
                                                                      ]},
                           'reports.patient_male_adult':{$cond:[{$and:[{$gt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 5]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Male"]}
                                                                      ]},1,0
                                                                      ]},
                           'reports.patient_female_adult':{$cond:[{$and:[{$gt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 5]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Female"]}
                                                                      ]},1,0
                                                                      ]}           
                        }
        },
            
        {
            $unwind : "$reports"
        },
        {
            $group : {
                        _id : "$reports.parameter",
                        'male_child' : {$sum : '$reports.patient_male_child'},
                        'female_child': {$sum : '$reports.patient_female_child'},
                        'male_adult': {$sum : '$reports.patient_male_adult'},
                        'female_adult': {$sum : '$reports.patient_female_adult'},
                        'total' : {$sum:1}
                    }
        }
            
            
], function(err, list) {
        if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                list[list.length] = {
                    'male_child_total' : list.reduce((val1, val2) => { return val1 + val2.male_child }, 0),
                    'female_child_total' : list.reduce((val1, val2) => { return val1 + val2.female_child }, 0),
                    'male_adult_total' : list.reduce((val1, val2) => { return val1 + val2.male_adult }, 0),
                    'female_adult_total' : list.reduce((val1, val2) => { return val1 + val2.female_adult }, 0),
                    'total_total' : list.reduce((val1, val2) => { return val1 + val2.total }, 0)
                }
                callback(null, list);
            }
        })
    }, function(callback) { // CALLBACK FOR TODAY COUNT 
        test.countDocuments(today_filter, function(err, count){
            if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                var result = {};
                result.today_count = count;
                callback(null, result);
            }
        })
        /*test.find(today_filter, function(err, list) {
            if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                var result = {};
                result.today_count = list.length;
                callback(null, result);
            }
        })*/
    }], function done(error, result) {
        if (error) {
            deferred.reject({
                status: "error",
                message: error
            })
        } else {
            var finalResult = {};
            finalResult.result = result[0];
            finalResult.today_count = result[1].today_count;
            finalResult.cumulative_count = result[0][result[0].length-1].total_total;
            deferred.resolve({
                status: "success",
                message: finalResult
            })
        }
    })   
        return deferred.promise
}


exports.getCenterOutReachConsultationsCount = function(req){
    var consultations = consultation_model.model(false);
    var patients = patient_model.model(false);
    var deferred = Q.defer();

     var start_date = req.query.start_date;
    var end_date = moment(req.query.end_date).add(1, 'day').format('YYYY-MM-DD')
    var tmrw = moment().add(1, 'day').format('YYYY-MM-DD')
    var tday = moment().format('YYYY-MM-DD')


    var outreach_filter_today = {
         "created" : {$gte:new Date(tday), $lt : new Date(tmrw)},
         "status" : "closed",
         "camp_vitals.author": {"$exists":true}
    }
    var center_filter_today = {
        "status" : "closed",
        "created" : {$gte:new Date(tday), $lt : new Date(tmrw)},
        "camp_vitals.author": {"$exists":false}
    }
    var outreach_cumulative_filter = {
        "created" : {$gte:new Date(start_date), $lt : new Date(end_date)},
         "status" : "closed",
         "camp_vitals.author": {"$exists":true}
    }
    var center_cumulative_filter = {
        "created" : {$gte:new Date(start_date), $lt : new Date(end_date)},
        "status" : "closed",
        "camp_vitals.author": {"$exists":false}
    }
   
    if (req.query.center_id && req.query.center_id != '') {
        outreach_filter_today.assign_to_center = parseInt(req.query.center_id);
        center_filter_today.center_id = parseInt(req.query.center_id);
        outreach_cumulative_filter.assign_to_center = parseInt(req.query.center_id);
        center_cumulative_filter.center_id = parseInt(req.query.center_id);

    }
    if (req.query.application_id && req.query.application_id != '') {
        outreach_filter_today.application_id = req.query.application_id;
        center_filter_today.application_id = req.query.application_id;
        outreach_cumulative_filter.application_id = req.query.application_id;
        center_cumulative_filter.application_id = req.query.application_id;
    }

    async.parallel([function(callback){
        // Out Reach - CALLBACK FOR CUMULATIVE (BASED ON DATE RANGE)
        consultations.aggregate([
            {$match: outreach_cumulative_filter },
            {$lookup:{from:'patients',localField:'patient_id',foreignField:'_id', as:'patientDetails'}},
            {
            $addFields : {
                          'patient_age': {$arrayElemAt: [ "$patientDetails.age", 0 ]},
                          'patient_gender':{$arrayElemAt: ["$patientDetails.gender", 0]},
                          'patient_male_child':{$cond:[{$and:[{$lt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 6]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Male"]}
                                                                      ]},1,0
                                                                      ]},
                           'patient_female_child':{$cond:[{$and:[{$lt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 6]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Female"]}
                                                                      ]},1,0
                                                                      ]},
                           'patient_male_adult':{$cond:[{$and:[{$gt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 5]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Male"]}
                                                                      ]},1,0
                                                                      ]},
                           'patient_female_adult':{$cond:[{$and:[{$gt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 5]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Female"]}
                                                                      ]},1,0
                                                                      ]}           
                        }
        },
        {
            $group: 
                {   _id:"outreach", 
                  "male_child_total":{$sum:"$patient_male_child"},
                  "female_child_total":{$sum:"$patient_female_child"},
                  "male_adult_total":{$sum:"$patient_male_adult"},
                  "female_adult_total":{$sum:"$patient_female_adult"},
                  "total":{$sum:1}
               }
        }
    ], function(err, list){
        if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                callback(null, list);
            }
    })

    }, function(callback){
        // Out Reach - CALLBACK FOR TODAY COUNT
        consultations.countDocuments(outreach_filter_today, function(err, count){
            if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                var result = {};
                result.outreach_today_count = count;
                callback(null, result);
            }
        })

    }, function(callback){
        // Center - CALLBACK FOR CUMULATIVE (BASED ON DATE RANGE)
        consultations.aggregate([
            {$match: center_cumulative_filter },
            {$lookup:{from:'patients',localField:'patient_id',foreignField:'_id', as:'patientDetails'}},
            {
            $addFields : {
                          'patient_age': {$arrayElemAt: [ "$patientDetails.age", 0 ]},
                          'patient_gender':{$arrayElemAt: ["$patientDetails.gender", 0]},
                          'patient_male_child':{$cond:[{$and:[{$lt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 6]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Male"]}
                                                                      ]},1,0
                                                                      ]},
                           'patient_female_child':{$cond:[{$and:[{$lt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 6]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Female"]}
                                                                      ]},1,0
                                                                      ]},
                           'patient_male_adult':{$cond:[{$and:[{$gt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 5]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Male"]}
                                                                      ]},1,0
                                                                      ]},
                           'patient_female_adult':{$cond:[{$and:[{$gt:[{$arrayElemAt: [ "$patientDetails.age", 0 ]}, 5]},
                                                                      {$eq:[{$arrayElemAt: [ "$patientDetails.gender", 0 ]}, "Female"]}
                                                                      ]},1,0
                                                                      ]}           
                        }
        },
        {
            $group: 
                {   _id:"center", 
                  "male_child_total":{$sum:"$patient_male_child"},
                  "female_child_total":{$sum:"$patient_female_child"},
                  "male_adult_total":{$sum:"$patient_male_adult"},
                  "female_adult_total":{$sum:"$patient_female_adult"},
                  "total":{$sum:1}
               }
        }
    ], function(err, list){

        if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                callback(null, list);
            }
    })

    }, function(callback){
        //Center - CALLBACK FOR TODAY COUNT FOR CENTER
        consultations.countDocuments(center_filter_today, function(err, count){
            if (err) {
                deferred.reject({
                    status: "error",
                    message: err
                })
            } else {
                var result = {};
                result.center_today_count = count;
                callback(null, result);
            }
        })

    }], function done(error, result){
            var outreach_empty ={
                "_id": "outreach",
                "male_child_total": 0,
                "female_child_total": 0,
                "male_adult_total": 0,
                "female_adult_total": 0,
                "total": 0
            }
            var center_empty = {
                "_id": "center",
                "male_child_total": 0,
                "female_child_total": 0,
                "male_adult_total": 0,
                "female_adult_total": 0,
                "total": 0
            }
            if(error){
                deferred.reject({
                    status : 'error',
                    message : error
                })
            }else{
                var finalResult = {};
                finalResult.outreach = result[0].length>0 ? result[0][0] : outreach_empty;
                finalResult.outreach_cumulative = result[0].length>0 ? result[0][0].total : 0;
                finalResult.outreach_today_count = result[1].outreach_today_count;
                finalResult.center = result[2].length>0 ? result[2][0] : center_empty;
                finalResult.center_cumulative = result[2].length>0 ? result[2][0].total : 0;
                finalResult.center_today_count = result[3].center_today_count;
                deferred.resolve({
                    status : 'success',
                    message : finalResult
                })
            }
    })
    return deferred.promise;

}

exports.findLISClinicalPathologyCount = function(req) {

    var test = test_model.model(false);
    var users = patient_model.model(false);
    var testrange = lims_ranges_model.model(false);
    var deferred = Q.defer();
    var today = new moment().format('YYYY-MM-DD');;

    var result = [];
    j = 0;

    test.find({
        application_id: req.query.application_id,
        test_group: "Clinical Pathology Test"

    }, function(err, testlist) {
        async.forEach(testlist, function(tests, callback) {
            test.find({
                    application_id: req.query.application_id,
                    test_name: tests.test_name,
                    is_reports_authenticated: true


                }).populate('patient_id')
                .exec(function(error, results) {


                    var final_results = {};

                    final_results.testname = tests.test_name;

                    final_results.total = results.length;

                    var maleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.male_childs = maleChildResult.length;

                    var femaleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.female_childs = femaleChildResult.length;
                    var maleAdultResults = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.male_adults = maleAdultResults.length;

                    var femaleAdultResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.female_adults = femaleAdultResult.length;

                    result.push(final_results);

                    if (error) {
                        deferred.reject({
                            status: 'error',
                            message: error
                        });
                    } else if (result.length == j) {
                        var final = _.uniq(result, 'testname')
                        for (var i = 0; i <= final.length - 1; i++) {
                            if (final[i].testname == "Blood Group (ABO-RH typing)") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 16, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 17, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 18, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 19, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };
                            if (final[i].testname == "Differential Leukocyte Count") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 20, final[0].total, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 21, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 22, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 23, final[0].male_childs, PROVIDERID, today, function(res) {});

                            };

                            if (final[i].testname == "ESR") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 24, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 25, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 26, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 27, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };
                            if (final[i].testname == "Haemoglobin Estimation (Hb)") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 28, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 29, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 30, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 31, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };
                            if (final[i].testname == "MP (Slide Method)") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 32, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 33, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 34, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 35, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };

                            if (final[i].testname == "Platelet Count") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 36, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 37, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 38, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 39, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };
                            if (final[i].testname == "Pregnancy Test") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 40, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 41, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 42, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 43, final[0].female_childs, PROVIDERID, today, function(res) {});
                            };
                            if (final[i].testname == "Total Leukocyte Count") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 44, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 45, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 46, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 47, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };


                            if (final[i].testname == "Clotting Time") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 48, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 49, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 50, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 51, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };

                        }

                        deferred.resolve({
                            status: "success",
                            message: final

                        });
                    }

                })
            j++;
            callback();
        })

    });


    return deferred.promise;
};



exports.findLISMicrobiologyCount = function(req) {

    var test = test_model.model(false);
    var users = patient_model.model(false);
    var testrange = lims_ranges_model.model(false);
    var deferred = Q.defer();
    var today = new moment().format('YYYY-MM-DD');;

    var result = [];
    j = 0;

    test.find({
        application_id: req.query.application_id,
        test_group: "Sero microbiology Tests"

    }, function(err, testlist) {
        async.forEach(testlist, function(tests, callback) {
            test.find({
                    application_id: req.query.application_id,
                    test_name: tests.test_name,
                    is_reports_authenticated: true


                }).populate('patient_id')
                .exec(function(error, results) {


                    var final_results = {};

                    final_results.testname = tests.test_name;

                    final_results.total = results.length;

                    var maleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.male_childs = maleChildResult.length;

                    var femaleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.female_childs = femaleChildResult.length;
                    var maleAdultResults = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.male_adults = maleAdultResults.length;

                    var femaleAdultResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.female_adults = femaleAdultResult.length;

                    result.push(final_results);

                    if (error) {
                        deferred.reject({
                            status: 'error',
                            message: error
                        });
                    } else if (result.length == j) {
                        var final = _.uniq(result, 'testname')
                        for (var i = 0; i <= final.length - 1; i++) {
                            if (final[i].testname == "HIV Test") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 217, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 218, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 219, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 220, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };
                            if (final[i].testname == "Sputum for AFB") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 221, final[0].total, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 222, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 223, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 224, final[0].male_childs, PROVIDERID, today, function(res) {});

                            };

                            if (final[i].testname == "  Stool for OVA and Cyst") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 225, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 226, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 227, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 228, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };


                        }

                        deferred.resolve({
                            status: "success",
                            message: final

                        });
                    }

                })
            j++;
            callback();
        })

    });


    return deferred.promise;
};

exports.findLISHemotologyCount = function(req) {

    var test = test_model.model(false);
    var users = patient_model.model(false);
    var testrange = lims_ranges_model.model(false);
    var deferred = Q.defer();
    var today = new moment().format('YYYY-MM-DD');;

    var result = [];
    j = 0;

    test.find({
        application_id: req.query.application_id,
        test_group: "Hematology"

    }, function(err, testlist) {
        async.forEach(testlist, function(tests, callback) {
            test.find({
                    application_id: req.query.application_id,
                    test_name: tests.test_name,
                    is_reports_authenticated: true


                }).populate('patient_id')
                .exec(function(error, results) {


                    var final_results = {};

                    final_results.testname = tests.test_name;

                    final_results.total = results.length;

                    var maleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.male_childs = maleChildResult.length;

                    var femaleChildResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age <= MAX_CHILD_AGE

                    });

                    final_results.female_childs = femaleChildResult.length;
                    var maleAdultResults = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Male'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.male_adults = maleAdultResults.length;

                    var femaleAdultResult = _.filter(_.where(_.pluck(results, 'patient_id'), {
                        gender: 'Female'

                    }), function(v) {
                        return v.age > MAX_CHILD_AGE

                    });

                    final_results.female_adults = femaleAdultResult.length;

                    result.push(final_results);

                    if (error) {
                        deferred.reject({
                            status: 'error',
                            message: error
                        });
                    } else if (result.length == j) {
                        var final = _.uniq(result, 'testname')
                        for (var i = 0; i <= final.length - 1; i++) {
                            if (final[i].testname == "Complete Blood Picture") {
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 211, final[0].male_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 212, final[0].female_adults, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 213, final[0].male_childs, PROVIDERID, today, function(res) {});
                                cm.sendTOCMDashboard(PASSCODE, req.query.center_id, 224, final[0].female_childs, PROVIDERID, today, function(res) {});

                            };


                        }

                        deferred.resolve({
                            status: "success",
                            message: final

                        });
                    }

                })
            j++;
            callback();
        })

    });


    return deferred.promise;
};

exports.getAreawiseCount = function(req, res) {


    var op = patient_model.model(false);
    var tc = consultation_model.model(false);
    var lt = test_model.model(false);
    var ce = center_model.model(false);
    var di = district_model.model(false);
    var mu = muncipal_model.model(false);
    var im = immunization_model.model(false);
    var deferred = Q.defer();


    var result = [];
    var obj = {};
    var j = 0;
    var n;

    ce.find({ application_id: req.query.application_id }, function(err, list) {

        // var i = 0;
        async.forEach(list, function(center, callback) {


            op.find({ center_id: center._id }, function(e, plist) {

                tc.find({ center_id: center._id }, function(er, clist) {
                    lt.find({ center_id: center._id }, function(err1, tlist) {
                        im.find({ center_id: center._id }, function(err, ilist) {

                            var final_results = {};
                            final_results.SNO = 0;
                            final_results.DISTRICT = center.district;
                            final_results.MUNCIPALITY = center.muncipality;
                            final_results.PHC_NAME = center.first_name;
                            final_results.OP_COUNT = plist.length;
                            final_results.TC_COUNT = clist.length;
                            final_results.LT_COUNT = tlist.length;
                            final_results.IM_COUNT = ilist.length;

                            result.push(final_results);

                            if (err) {
                                deferred.reject({
                                    status: "error",
                                    message: err
                                })
                            } else if (result.length == j) {


                                var myData1 = _.sortBy(_.sortBy(result, 'MUNCIPALITY'), 'DISTRICT');


                                let total_obj = {
                                    S_NO: 1,
                                    a: 0,
                                    b: 0,
                                    PHC_NAME: "Total",
                                    OP_COUNT: 0,
                                    TC_COUNT: 0,
                                    LT_COUNT: 0,
                                    IM_COUNT: 0
                                }

                                for (var i = 0; i < myData1.length; i++) {
                                    total_obj.OP_COUNT += myData1[i].OP_COUNT;
                                    total_obj.TC_COUNT += myData1[i].TC_COUNT;
                                    total_obj.LT_COUNT += myData1[i].LT_COUNT;
                                    total_obj.IM_COUNT += myData1[i].IM_COUNT;
                                }
                                myData1.push(total_obj);
                                n = 1;
                                _.map(myData1, function(data) {
                                    data.S_NO = n++;
                                })

                                deferred.resolve({

                                    myData1

                                })
                            }

                        }) //im
                    }) //lt
                }) //tc
            }) //pat  

            j++;
            callback();
        });

    }) //cen
    return deferred.promise;


}
//Dashboard Entry