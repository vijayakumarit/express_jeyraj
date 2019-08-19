var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');



module.exports = {
    _schema: null,

    _schema_def: {

        _id: String,
        url: String,
        method: String,
        page: String,
        method_name: String,
        IpAddress: String,
        browser: Array,
        headers: Object,
        params: Object,
        body: Object,
        query: Object,
        response_type: String,
        response: String,
        sessionID: String,
        token: String,
        userID: String,
        application_id: String,
        created: {
            type: Date,
            required: true,
            default: Date.now
        }

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'application_logs'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);
            schema.plugin(uniqueValidator, {
                message: ' {PATH} - " {VALUE} "  is already exists.'
            });

            mongoose.model('application_logs', schema);
            module.exports._model = mongoose.model('application_logs');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}