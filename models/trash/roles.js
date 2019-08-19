var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        title: {
            type: String
        },
        actual_role: {
            type: String
        },
        role_trash_id: {
            type: String

        },
        slug: {
            type: String
        },
        isMrc: {
            type: Boolean,
            default: false
        },
        isSpeciality: {
            type: Boolean,
            default: false
        },
        isAddress: {
            type: Boolean,
            default: false
        },
        isAssignCenter: {
            type: Boolean,
            default: false
        },
        isRegisteredNumber: {
            type: Boolean,
            default: false
        },
        description: String,
        isActive: {
            type: Boolean,
            default: true
        },
        author: {
            type: String,
            required: [false, "Please logout from the session and re-login to the application"]
        },

        author_type: {
            type: String,
            required: [false, "Please logout from the session and re-login to the application"]
        },
        created: {
            type: String,
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
            default: false
        },
        reason_for_delete: {
            type: String
        },
        deleted_by: {
            type: String
        },
        deleted_time: {
            type: Date
        },
        deleted_by_role: {
            type: String
        }
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'roles_trash'
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

            mongoose.model('roles_trash', schema);
            module.exports._model = mongoose.model('roles_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
