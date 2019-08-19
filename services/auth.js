var model = require('../models/users');
var video_auth_model = require('../models/trash/video_authentication');
var auth_logs_model = require('../models/authentication_logs');
var resource_model = require('../models/resource');
var center_model = require('../models/trash/centers');
var center_type_model = require('../models/trash/center_type');
//var configResource = require('../configurations/filters/resource');
//var configResourceCentertype = require('../configurations/filters/center_type');
//var master_applications_model = require('../models/master_applications');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Q = require('q');
var crypto = require('crypto');
var extend = require('node.extend');
var moment = require('moment');


function check_password(user, pwd) {
    var dbpasswd = user.password.split(':');
    var user_pwd = pwd + dbpasswd[1];

    var hash = crypto.createHash('md5').update(user_pwd).digest("hex");
    var sha256Hash = crypto.createHash('sha256').update(user_pwd).digest("hex");
    if (hash === dbpasswd[0]) {
        return true;
    }else if(sha256Hash === dbpasswd[0]){
        return true;
    } 
    else {
        return false;
    }
}


exports.login = function(req) {
    var resource = resource_model.model(false);
    var centerModel = center_model.model(false);
    var centertypeModel = center_type_model.model(false);

    var deferred = Q.defer();
    var filters = {
        email: req.body.email.toLowerCase(),
        isActive: true,
        application_id: req.body.application_id
    };
    // if(req.headers['global-user']){
    //     delete(filters.application_id);
    // }
    resource.find(filters, function(eu, user) {
        if (eu) {
            deferred.reject({
                status: "error",
                message: eu
            });
        } else if (user.length > 0) {
            
            var isValidPwd = check_password(user[0], req.body.password);
            //Temparorily Disabled
            // if (isValidPwd && !user[0].is_loggedin) {
            if (isValidPwd) {
                // if (user[0].role == 'admin' || (user[0].role !== 'admin' && user[0].application_id == req.body.application_id)) {

                updateUserWithToken(user[0], req.sessionID, req.body.application_id);

                req.session.userID = user[0]._id;


                // Attach center list to which the resource has assigned
                centerModel.find({ resources: user[0]._id, isActive: true }, configResource.center_details_by_resource[0]).
                populate([{
                    path: 'center_type',
                    model: 'center_types',
                    select: configResourceCentertype.center_type_details[0]
                }]).exec(function(err, centerList) {

                    if (err) {
                        deferred.reject({
                            status: "error",
                            message: err
                        });
                    } else {
                        if (user[0].role != 'admin' && user[0].mrc != true && centerList.length <= 0) {
                            deferred.reject({
                                status: "error",
                                message: "No centers assigned"
                            });

                        } else {
                            const payload = {
                                admin: user[0].email 
                              };
                            var token = jwt.sign(payload, "superSecret", {
                                expiresIn: "12h" // expires in 12 hours
                              });

                            if (user[0].mrc !== true && user[0].role != 'admin' && user[0].role != 'coordinator' && user[0].role.toLowerCase() != 'misuser' && !user[0].active_center_id || user[0].active_center_id == "") {
                                user[0].active_center_id = centerList[centerList.length - 1]._id;
                                user[0].active_center_name = centerList[centerList.length - 1].first_name;
                            }
                            deferred.resolve({
                                status: "success",
                                message: user,
                                jwttoken : token
                            });
                        }

                    }
                })





                /*} else {
                    deferred.reject({
                        status: "error",
                        message: "Invalid Email/Password"
                    });
                }*/

            }
            /*else if (isValidPwd && user[0].is_loggedin) {

                           deferred.reject({
                               status: "error",
                               message: "Someone is Already logged-in, Please try after some time."
                           });
                       }*/
            else {
                deferred.reject({
                    status: "error",
                    message: "Invalid Password"
                });
            }
        } else {
            deferred.reject({
                status: "error",
                message: "Invalid email"
            });
        }
    })

    return deferred.promise;
}


exports.forgotPassword = function(req) {
    var user = resource_model.model(false);
    var deferred = Q.defer();
    user.find({
        email: req.body.email.toLowerCase()
    }, function(err, data) {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            });
        } else if (data.length > 0) {
            deferred.resolve({
                status: "success",
                message: data
            });
        } else {
            deferred.reject({
                status: "error",
                message: "It looks like the email is not registered with us."
            });

        }

    })

    return deferred.promise;

}
exports.resetPassword = function(req) {
    var user = resource_model.model(false);
    var deferred = Q.defer();
    user.find({
        _id: req.body._id
    }, function(err, data) {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            });
        } else if (data.length > 0) {
            var salt = crypto.randomBytes(32).toString('base64');
            if (!req.body.password) {
                req.body.password = 'default';
            }
            var user_pwd = req.body.password + salt;
            var vhash = crypto.createHash('sha256').update(user_pwd).digest("hex");
            var password = vhash + ":" + salt;

            user.update({
                _id: req.body._id
            }, {
                $set: {
                    password: password
                }
            }, function(error, userData) {
                if (error) {
                    deferred.reject({
                        status: "error",
                        message: err
                    });
                } else {
                    deferred.reject({
                        status: "success",
                        message: "Your password changed successfully"
                    });
                }
            })


        } else {
            deferred.reject({
                status: "error",
                message: "Invalid user"
            });

        }

    })

    return deferred.promise;

}

exports.checkEmailexist = function(email) {
    var users = model.model(false);
    var deferred = Q.defer();

    users.find({
        email: email
    }, function(err, data) {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            });


        } else if (data.length > 0) {

            deferred.reject({
                status: "error",
                message: "This email is already exists"
            });

        } else {
            deferred.resolve({
                status: "success",
                message: "proceed"
            });

        }
    })
    return deferred.promise;
}

exports.findVideoAuthenticationDetails = function(req) {
    var video = video_auth_model.model(false);
    var master_applications = master_applications_model.model(false);
    var deferred = Q.defer();
    //Single sign on
    /*if(req.query.is_global_user && (req.query.is_global_user === true || req.query.is_global_user == 'true')){
        filter = {}
    } else {*/
        filter = {
            application_id: req.query.application_id
        } 
   // }
    video.find(filter).populate([{
        path: 'application_id',
        model: 'master_applications'
    }]).exec( function(err, data) {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            });
        } else {
            deferred.resolve({
                status: "success",
                message: data
            });

        }
    })
    return deferred.promise;
}
exports.logout = function(req) {
    var users = resource_model.model(false);
    var deferred = Q.defer();
    var user = req.body;
    var id = user._id;
    delete(user._id);
    user.is_loggedin = false;
    user.last_logout_time = new Date();

    users.findOneAndUpdate({
        _id: id
    }, { $set: { is_loggedin: false, last_logout_time: new Date() } }, { upsert: true, new: true }, function(err, data) {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            });


        } else {
            updateAuthLogs(id);
            deferred.resolve({
                status: "success",
                message: "updated"
            });

        }
    })
    return deferred.promise;
}

function updateUserWithToken(user, sessionID, application_id) {
    var users = resource_model.model(false);
    var deferred = Q.defer();
    var id = user._id;
    delete(user._id);
    var ObjectId = require('mongoose').Types.ObjectId;
    user.token = new ObjectId();
    user.is_loggedin = true;
    user.last_login_time = new Date();

    users.findOneAndUpdate({
        _id: id
    }, user, function(err, data) {
        if (err) {
            deferred.reject({
                status: "error",
                message: err
            });


        } else {

            insertAuthLogs(user, user.token, sessionID, application_id);
            deferred.resolve({
                status: "success",
                message: "updated"
            });

        }
    })
    return deferred.promise;

}

function insertAuthLogs(userID, token, sessionID, application_id) {
    var resource = auth_logs_model.model(true);
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId;
    var resource_role = userID.role;
    resource._id = new ObjectId();
    resource.resource_id = userID;
    resource.token = token;
    resource.application_id = application_id;
    resource.sessionID = sessionID;
    resource.login_time = new Date();
    resource.is_logout = false;
    resource.created = new Date();
    resource.role = resource_role;

    resource.save(function(err, doc) {
        if (err) {
            deferred.reject({ status: "error", message: err });
        } else {
            deferred.resolve({ status: "success", message: doc })
        }
    })


    return deferred.promise;
}


function updateAuthLogs(userID) {
    var resource = auth_logs_model.model(false);
    var deferred = Q.defer();


    resource.find({ resource_id: userID, is_logout: false }).sort({ _id: -1 }).exec(function(err, list) {
        if (err) {
            // console.log("error1 ", err);
            deferred.reject({ status: "error", message: err });
        } else if (list.length > 0) {
            list[0].is_logout = true;
            list[0].logout_time = new Date();
            var id = list[0]._id;
            // console.log(list[0]);
            delete(list[0]._id);
            resource.findOneAndUpdate({ _id: id }, list[0], function(error, data) {
                if (error) {
                    // console.log("error2 ", error)
                    deferred.reject({ status: "error", message: error });
                } else {
                    deferred.resolve({ status: "success", message: data });
                }
            })

        } else {
            // console.log("error3 ", "No record found ", { resource_id: userID, is_logout: false });
            deferred.reject({ status: "error", message: "No record found" })
        }
    })


    return deferred.promise;

}