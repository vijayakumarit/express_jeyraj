var logs = require('../services/application_logs');
exports.paginate = function(req) {
    try {
        var pages = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sortBy: { _id: parseInt(req.query.orderBy) || -1 }
        };

        return pages;
    } catch (err) {
        if (MASTER_LOGS) {
            logs.create(req, 'paginate', 'paginate', false, err);
        };

        res.send(err);
    }
}