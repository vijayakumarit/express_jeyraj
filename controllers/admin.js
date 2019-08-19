var service = require('../services/admin');
var logs = require('../services/application_logs');

/**
* @api {get}  /specialities
* @apiExample /specialities

* @apiDescription
*  Get the specialities list from db
*/
exports.getSpecialities = function(req, res) {
    try {
        service.getSpecialities(req).then(function(data) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getSpecialities', true, data);
            }
            res.send(data);
        }).fail(function(err) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getSpecialities', false, err);
            }
            res.send(err);
        })
    } catch (err) {
        if (MASTER_LOGS) {
            logs.create(req, 'admin', 'getSpecialities', false, err);
        }
        res.send(err);
    }
}

/**
* @api {get}  /languages
* @apiExample /languages

* @apiDescription
*  Get the languages list from db
*/
exports.getLanguages = function(req, res) {
    try {
        service.getLanguages(req).then(function(data) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getLanguages', true, data);
            }
            res.send(data);
        }).fail(function(err) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getLanguages', false, err);
            }
            res.send(err);
        })
    } catch (err) {
        if (MASTER_LOGS) {
            logs.create(req, 'admin', 'getLanguages', false, err);
        }
        res.send(err);
    }
}

/**
* @api {post}  /applicarions
* @apiExample /applications

* @apiDescription
*  Save Application in DB
*/
exports.saveApplication = function(req, res) {
    try {
        service.saveApplication(req).then(function(data) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'saveApplication', true, data);
            }
            res.send(data);
        }).fail(function(err) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'saveApplication', false, err);
            }
            res.send(err);
        })
    } catch (err) {
        if (MASTER_LOGS) {
            logs.create(req, 'admin', 'saveApplication', false, err);
        }
        res.send(err);
    }
}
exports.getApplications = function(req, res) {
    try {
        service.getApplications(req).then(function(data) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getApplications', true, data);
            }
            res.send(data);
        }).fail(function(err) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getApplications', false, err);
            }
            res.send(err);
        })
    } catch (err) {
        if (MASTER_LOGS) {
            logs.create(req, 'admin', 'getApplications', false, err);
        }
        res.send(err);
    }
}
exports.getApplicationDetails = function(req, res) {
    try {
        service.getApplicationDetails(req).then(function(data) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getApplicationDetails', true, data);
            }
            res.send(data);
        }).fail(function(err) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'getApplicationDetails', false, err);
            }
            res.send(err);
        })
    } catch (err) {
        if (MASTER_LOGS) {
            logs.create(req, 'admin', 'getApplicationDetails', false, err);
        }
        res.send(err);
    }
}
exports.updateApplicationDetails = function(req, res) {
    try {
        service.updateApplicationDetails(req).then(function(data) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'updateApplicationDetails', true, data);
            }
            res.send(data);
        }).fail(function(err) {
            if (MASTER_LOGS) {
                logs.create(req, 'admin', 'updateApplicationDetails', false, err);
            }
            res.send(err);
        })
    } catch (err) {
        if (MASTER_LOGS) {
            logs.create(req, 'admin', 'updateApplicationDetails', false, err);
        }
        res.send(err);
    }
}

var paginate = function(req) {
    return require('./paginate').paginate(req);
}