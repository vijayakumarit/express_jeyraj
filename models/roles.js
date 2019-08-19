var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        title: {
            type: String,
            required: true
        },
        actual_role:{
             type: String,
            required: true,
            unique: true,
            uniqueCaseInsensitive: true

        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        isMrc: {
            type: Boolean,
            required: true,
            default: false
        },
        isSpeciality: {
            type: Boolean,
            required: true,
            default: false
        },
        isAddress: {
            type: Boolean,
            required: true,
            default: false
        },
        isAssignCenter: {
            type: Boolean,
            required: true,
            default: false
        },
        isRegisteredNumber: {
            type: Boolean,
            required: true,
            default: false
        },
        description: String,
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        author: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
        },

        author_type: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
        },
        created: {
            type: String,
            required: true,
            default: Date.now
        },
        status_log: [{
            _id: String,
            message: String,
            author: String,
            author_type: String,
            created: {
                type: Date,
                default: Date.now
            }
        }],
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        reason_for_delete: {
            type: String,
            required: false
        },
        deleted_by: {
            type: String,
            required: false
        },
        deleted_time: {
            type: Date,
            required: false
        },
        deleted_by_role: {
            type: String,
            required: false
        }
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'roles'
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

            mongoose.model('roles', schema);
            module.exports._model = mongoose.model('roles');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
