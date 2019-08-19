var model = require('../models/application_logs');
var Q = require('q');

exports.create = function(req, page, method_name, isSuccess, info) {
    var logs = model.model(true);
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId;

    //Fetching Client Browser information
    var userAgent = req.headers['user-agent'];
    var client_browser = [];
    var browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };

    for (var key in browsers) {
        if (browsers[key].test(userAgent)) {
            client_browser.push(key);

        }
    };

    logs._id = new ObjectId();
    logs.url = req.originalUrl;
    logs.method = req.method;
    logs.page = page;
    logs.method_name = method_name;
    logs.IpAddress = req.headers["ip-address"];
    logs.browser = client_browser;
    logs.headers = req.headers;
    logs.params = req.params;
    logs.body = req.body;
    logs.query = req.query;
    logs.sessionID = req.sessionID;
    logs.userID = req.session.userID;
    logs.token = req.headers["x-api-key"];
    logs.application_id = req.headers["x-application-key"];
    logs.response_type = isSuccess ? 'success' : 'error';
    logs.response = JSON.stringify(info);
    logs.created = new Date();
    logs.save(function(err, res) {
        if (err) {
            console.log("error while inserting log ", { status: "error", message: err });
            deferred.reject({ status: "error", message: err });
        } else {
            deferred.resolve({ status: "success", message: 'Log created' });
        }
    })
    return deferred.promise;
}