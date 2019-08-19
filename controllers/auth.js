var service = require('../services/auth');
var users = require('../services/users');
var logs = require('../services/application_logs');

var sockets = require('../sockets.js');
var http = require('http');
var io = require('socket.io')(http);
var SIO;

var paginate = function(req) {
    return require('./paginate').paginate(req);
}

exports.getSocket = function(io) {
    SIO = io;
    io.sockets.on('connection', function(labtest) {
        //io.sockets.emit('BenespheraPort', {name:"from server"});
        /*serialport.on('BenespheraPortOpen', function(message){

                //PortOperations(message.portName)
            })*/
    })

};

exports.login = function(req, res) {
    try {
        if (!req.body.email) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'login', false, 'Please enter valid email');
            }
            res.send({
                status: "error",
                message: "Please enter valid email"
            })
        } else if (!req.body.password) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'login', false, 'Please enter valid password');
            }
            res.send({
                status: "error",
                message: "Please enter password"
            })
        } else {
            service
                .login(req)
                .then(function(data) {
                    if (AUTHENTICATION_LOGS) {
                        logs.create(req, 'auth', 'login', true, data);
                    }
                    res.send(data);

                })
                .fail(function(err) {
                    if (AUTHENTICATION_LOGS) {
                        logs.create(req, 'auth', 'login', false, err);
                    }
                    res.send(err);
                });

        }

    } catch (err) {
        if (AUTHENTICATION_LOGS) {
            logs.create(req, 'auth', 'login', false, err);
        }
        res.send(err);
    }
}

exports.forgotPassword = function(req, res) {
    try {
        if (!req.body.email) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'forgotPassword', false, 'Please enter valid email');
            }
            res.send({
                status: "error",
                message: "Please enter valid email"
            })
        } else {

            service.forgotPassword(req).then(function(data) {
                if (AUTHENTICATION_LOGS) {
                    logs.create(req, 'auth', 'forgotPassword', true, data);
                }

                res.send(data);

            }).fail(function(err) {
                if (AUTHENTICATION_LOGS) {
                    logs.create(req, 'auth', 'forgotPassword', false, err);
                }

                res.send(err);
            })
        }

    } catch (err) {
        if (AUTHENTICATION_LOGS) {
            logs.create(req, 'auth', 'forgotPassword', false, err);
        }
        res.send(err);
    }
}
exports.resetPassword = function(req, res) {
    try {
        if (!req.body._id) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'resetPassword', false, 'Invalid user details');
            }
            res.send({
                status: "error",
                message: "Invalid user details"
            })
        } else if (!req.body.password) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'resetPassword', false, 'Please enter new password');
            }
            res.send({
                status: "error",
                message: "Please enter your new password"
            })
        } else if (!req.body.confirmPassword) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'resetPassword', false, 'Please enter confirm password');
            }
            res.send({
                status: "error",
                message: "Please enter confirm password"
            })
        } else if (req.body.password !== req.body.confirmPassword) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'resetPassword', false, 'Passwords does not match');
            }
            res.send({
                status: "error",
                message: "Password does not match"
            })
        } else {


            service.resetPassword(req).then(function(data) {
                if (AUTHENTICATION_LOGS) {
                    logs.create(req, 'auth', 'resetPassword', true, data);
                }
                res.send(data);

            }).fail(function(err) {
                if (AUTHENTICATION_LOGS) {
                    logs.create(req, 'auth', 'resetPassword', false, err);
                }

                res.send(err);
            })
        }
    } catch (err) {
        if (AUTHENTICATION_LOGS) {
            logs.create(req, 'auth', 'resetPassword', false, err);
        }
        res.send(err);
    }
}

exports.findVideoAuthenticationDetails = function(req, res) {
    if(req.query.remote_application_id){
        req.query.application_id = req.query.remote_application_id
    }
    service.findVideoAuthenticationDetails(req).then(function(data) {
        if (WEBRTC_LOGS) {
            logs.create(req, 'auth', 'findVideoAuthenticationDetails', true, data);
        }
        res.send(data);
        console.log("Data", data);
    }).fail(function(err) {
        if (WEBRTC_LOGS) {
            logs.create(req, 'auth', 'findVideoAuthenticationDetails', false, err);
        }
        res.send(err);
    })

}

exports.logout = function(req, res) {
    try {
        service.logout(req).then(function(data) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'logout', true, data);
            }
            res.send(data);
            SIO.sockets.emit('endDashboard', "close dashboard");

        }).fail(function(err) {
            if (AUTHENTICATION_LOGS) {
                logs.create(req, 'auth', 'logout', false, err);
            }
            res.send(err);
        })

    } catch (err) {
        if (AUTHENTICATION_LOGS) {
            logs.create(req, 'auth', 'logout', false, err);
        }
        res.send(err);
    }
}