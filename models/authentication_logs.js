var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        resource_id: {
            type: String,
            required: true,
            ref: 'resources'
        },
        role: {
            type: String,
            required: false,
        },
        token: {
            type: String,
            required: true
        },
        sessionID: {
            type: String,
            required: true
        },
        login_time: {
            type: Date,
            required: true

        },
        is_logout: {
            type: Boolean,
            default: false,
            required: true
        },
        logout_time: {
            type: Date,
            required: false
        },

        application_id: {
            type: String,
            required: true,
            ref: 'master_applications'

        },


        created: {
            type: Date,
            required: true,
            default: Date.now
        }

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'authentication_logs'
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

            mongoose.model('authentication_logs', schema);
            module.exports._model = mongoose.model('authentication_logs');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}