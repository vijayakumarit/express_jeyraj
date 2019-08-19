var fs = require('fs');
var csrf = require('csrf');
var resource_model = require('../models/resource');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens



module.exports = function(app) {
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    var users = require('./users');
    //var resources = require('./resource');
    //var consultations = require("./consultations");
    //var centers = require("./centers");
    //var assets = require("./assets");
    //var center_types = require("./center_types");
    //var groups = require("./groups");
    //var labels = require("./labels");
    //var lims = require("./lims");
   // var pharmacy = require("./pharmacy");
    //var bm_register = require("./biometric_registration");

    //var external_integration = require('./external_integration');
    var auth = require('./auth');
    //var auth_ext = require('./logout');
    var admin = require('./admin');
    //var menus = require('./menus');
   // var modules = require('./modules');
    //var titles = require('./titles');
   // var roles = require('./roles');
    //var sampletypes = require('./sampletypes');
    //var coordinators = require('./coordinator');
    //var educations = require('./education');
    //var occupations = require('./occupation');
    //var lims_qc = require('./lims_qc');
   // var units = require('./units');
   // var district = require('./districts');
   // var location = require('./locations');
   // var muncipality = require('./muncipality');
    //var marial = require('./marial_status');
   // var age_group = require('./age_group');
   // var age_type = require('./age_type');
  //  var genders = require('./genders');
   // var severity = require('./severities');
  //  var misreports = require('./misreports');
  //  var medmanthra = require('./medmantra');
  //  var camps = require('./camps');
   // var specialities = require('./specialities');
  //  var consumable_reagent_master = require('./consumable_reagent_master');
   // var logs = require('../services/application_logs');
  //  var immunization = require('./immunizations');
  //  var age_index = require('./age_index_master');
   // var payment = require('./payment');
   // var device_master = require('./device_master');
   // var triyas = require('./triyas');
  //  var superAdmin = require('./superAdmin');
   // var constraints = require('./constraints');
   // var scm_module = require('./scm_module');



    //var uploadFiles = require("./uploadFiles");

   // app.use("/api/", device_master); // checkAuthentication function has been removed from API call -Because we don't want to check headers for first two services in ASHA device integration
    //Authentication
    function checkAuthentication(req, res, next) {
        var apiKey = req.headers["x-api-key"];
        var db = resource_model.model(false);
       
        /*if(!apiKey){
                logs.create(req, 'routes', 'checkAuthentication', false, "Access Denied");
                 res.status(403).send({status:"error", message:"Access Denied"});
        
            }
            else{*/

        //checking token is exist or not in Resource collection
        /*db.find({ token: apiKey }, function(err, resourceData) {
            if (err) {
                 logs.create(req, 'routes', 'checkAuthentication', false, "Error Occured while fetching token");
                res.status(500).json({ status: "error", message: "Error occured" })
            } else if (resourceData.length > 0) {*/

        var jwttoken = req.body.jwttoken || req.query.jwttoken || req.headers['x-access-token'];
        if(jwttoken){
            jwt.verify(jwttoken, "superSecret", function(err, decoded){
                if(err){
                    res.send({
                        status: "error",
                        message: "Failed to authenticate token."
                    })
                }else{
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    if (req.headers["x-application-key"] || req.originalUrl.indexOf('application') >= 0) {
                        if (Object.keys(req.body).length > 0) {
                            req.body.application_id = req.headers["x-application-key"];
                        } else {
                            req.query.application_id = req.headers["x-application-key"];
                        }
                        next();
                    } else {
                        res.send({
                            status: "error",
                            message: "Invalid credentials, Please check with your admin."
                        })
                    }
                }
            })
        }else{
            res.send({
                status: "error",
                message: "No token provided."
            })
        }

        /* } else {
                 logs.create(req, 'routes', 'checkAuthentication', false, "Authentication failed");
                res.status(400).json({
                    status: "error",
                    message: "Authentication failed"
                })
            }
        })*/
        // }

    }

    function authenticateWithoutJWT(req, res, next) {
        var apiKey = req.headers["x-api-key"];
        var db = resource_model.model(false);
       
        /*if(!apiKey){
                logs.create(req, 'routes', 'checkAuthentication', false, "Access Denied");
                 res.status(403).send({status:"error", message:"Access Denied"});
        
            }
            else{*/

        //checking token is exist or not in Resource collection
        /*db.find({ token: apiKey }, function(err, resourceData) {
            if (err) {
                 logs.create(req, 'routes', 'checkAuthentication', false, "Error Occured while fetching token");
                res.status(500).json({ status: "error", message: "Error occured" })
            } else if (resourceData.length > 0) {*/

                if (req.headers["x-application-key"] || req.originalUrl.indexOf('application') >= 0) {
                    if (Object.keys(req.body).length > 0) {
                        req.body.application_id = req.headers["x-application-key"];
                    } else {
                        req.query.application_id = req.headers["x-application-key"];
                    }
                    next();
                } else {
                    res.send({
                        status: "error",
                        message: "Invalid credentials, Please check with your admin."
                    })
                }

       

    }
    app.post('/token', function(req, res) {

        res.send({
            status: "success",
            message: randomString(100)
        })
    })

    var randomString = function(len, bits) {
        bits = bits || 36;
        var outStr = "",
            newStr;
        while (outStr.length < len) {
            newStr = Math.random().toString(bits).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
        }
        return outStr.toUpperCase();
    };

    // app.use(require('x-api-key')(checkAuthentication ))

    //app.use("/api/", authenticateWithoutJWT, external_integration)
    app.use("/api/", checkAuthentication, auth);
    //app.use("/api/", checkAuthentication, auth_ext); //Because For Auth no need to check Header. For Logout need to check with Header, So Maintained as seperate file
    app.use("/api/", checkAuthentication, admin);
    app.use("/api/", checkAuthentication, users);
    
    /*
    app.use("/api/", checkAuthentication, resources);
    app.use("/api/", checkAuthentication, consultations);
    app.use("/api/", checkAuthentication, centers);
    app.use("/api/", checkAuthentication, groups);
    app.use("/api/", checkAuthentication, assets);
    app.use("/api/", checkAuthentication, center_types);
    app.use("/api/", checkAuthentication, labels);
    app.use("/api/", checkAuthentication, lims);
    app.use("/api/", checkAuthentication, pharmacy);
    app.use("/api/", checkAuthentication, menus);
    app.use("/api/", checkAuthentication, modules);
    app.use("/api/", checkAuthentication, roles);
    app.use("/api/", checkAuthentication, sampletypes);
    app.use("/api/", checkAuthentication, titles);
    app.use("/api/", checkAuthentication, coordinators);
    app.use("/api/", checkAuthentication, educations);
    app.use("/api/", checkAuthentication, occupations);
    app.use("/api/", checkAuthentication, lims_qc);
    app.use("/api/", checkAuthentication, units);
    app.use("/api/", checkAuthentication, bm_register);
    app.use("/api/", checkAuthentication, district);
    app.use("/api/", checkAuthentication, location);
    app.use("/api/", checkAuthentication, muncipality);
    app.use("/api/", checkAuthentication, marial);
    app.use("/api/", checkAuthentication, age_group);
    app.use("/api/", checkAuthentication, age_type);
    app.use("/api/", checkAuthentication, genders);
    app.use("/api/", checkAuthentication, severity);
    app.use("/api/", checkAuthentication, misreports);
    app.use("/api/", checkAuthentication, camps);
    app.use("/api/", checkAuthentication, specialities);
    app.use("/api/", checkAuthentication, consumable_reagent_master);
    app.use("/api/", checkAuthentication, medmanthra);
    app.use("/api/", checkAuthentication, immunization);
    app.use("/api/", checkAuthentication, age_index);
    app.use("/api/", checkAuthentication, payment);
    app.use("/api/", checkAuthentication, triyas);
    app.use("/api/", checkAuthentication, superAdmin);
    app.use("/api/", checkAuthentication, constraints);
    app.use("/api/", checkAuthentication, scm_module);

    */

    //app.use("/api/", checkAuthentication, uploadFiles);
    // app.use('*', function(req, res) {
    //     logs.create(req, 'routes', '404 page', false, "Requested URL is not found");
    //     res.send("404, Sorry this file could not found")
    // })

}