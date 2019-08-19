var Q = require('q');
//var applications_model = require('../models/trash/maste');


/**
* @api {get}  /specialities
* @apiParams {Boolean} - {optional - isactive}
* @apiExample /specialities

* @apiDescription
*  Get the specialities list from db

* @apiServiceDefinition {getSpecialities}
* Getting list of specialities based on isActive filter.
*/
exports.getSpecialities = function(req) {
    var specialities = require('../models/specialities').model(false);
    var deferred = Q.defer();
    var filter = {};
    filter.isDeleted = req.params.isDeleted;
    filter.isActive = req.params.isActive;
    if (filter.isDeleted) {
        filter.isDeleted = (filter.isDeleted.toLowerCase() === 'true' || filter.isActive === 1 || filter.isActive.toLowerCase() === 'yes') ? true : false;
    } else {
        filter.isDeleted = false;
    }
    specialities.paginate({}, {
            sort: {
                title: 1
            }
        },

        function(err, data) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });

            } else {
                deferred.resolve({
                    status: "success",
                    message: data.docs
                })
            }

        })
    return deferred.promise;
}

/**
* @api {get}  /languages
* @apiParams {Boolean} - {optional - isactive}
* @apiExample /languages

* @apiDescription
*  Get the languages list from db

* @apiServiceDefinition {getSpecialities}
* Getting list of languages based on isActive filter.
*/
exports.getLanguages = function(req) {
    var languages = require('../models/languages').model(false);
    var deferred = Q.defer();
    var filter = {};
    filter.isDeleted = req.params.isDeleted;
    filter.isActive = req.params.isActive;
    if (filter.isDeleted) {
        filter.isDeleted = (filter.isDeleted.toLowerCase() === 'true' || filter.isActive === 1 || filter.isActive.toLowerCase() === 'yes') ? true : false;
    } else {
        filter.isDeleted = false;
    }
    languages.paginate({}, {
            limit: req.query.limit || 100,
            sort: {
                title: 1
            }
        },

        function(err, data) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });

            } else {
                deferred.resolve({
                    status: "success",
                    message: data.docs
                })
            }

        })
    return deferred.promise;
}

exports.saveApplication = function(req) {
    var applications = applications_model.model(true);
    var deferred = Q.defer();


    var ObjectId = require('mongoose').Types.ObjectId;
    applications._id = new ObjectId();
    applications.title = req.body.title;
    applications.url = req.body.url ? req.body.url.toLowerCase() : '';
    applications.description = req.body.description;
    applications.isActive = req.body.isActive || true;
    applications.author = req.body.author;
    applications.author_type = req.body.author_type;
    applications.created = new Date();

    applications.save(function(err, data) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });

        } else {
            deferred.resolve({
                status: "success",
                message: data
            })
        }

    })
    return deferred.promise;

}

exports.getApplications = function(req) {

    var applications = applications_model.model(false);
    var deferred = Q.defer();
    var filters = {};
    if (req.query.title) {
        filters.title = { $regex: req.query.title, $options: 'i' };
    }
    if (req.query.url) {
        filters.url = req.query.url.toLowerCase();
    }

    applications.find(filters, function(err, data) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });

        } else {
            deferred.resolve({
                status: "success",
                message: data
            })
        }

    })
    return deferred.promise;


}

exports.getApplicationDetails = function(req) {

    var applications = applications_model.model(false);
    var deferred = Q.defer();

    applications.find({ _id: req.params.id }, function(err, data) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });

        } else {
            deferred.resolve({
                status: "success",
                message: data
            })
        }

    })
    return deferred.promise;


}
exports.updateApplicationDetails = function(req) {

    var applications = applications_model.model(false);
    var deferred = Q.defer();
    var tofind = req.body._id;
    delete(req.body._id);

    applications.findOneAndUpdate({ _id: tofind }, req.body, function(err, data) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });

        } else {
            deferred.resolve({
                status: "success",
                message: data
            })
        }

    })
    return deferred.promise;


}