var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        name: {
            type: String

        },
        description: {
            type: String

        },
        asset_types_trash_id: {
            type: String

        },
        isActive: {
            type: Boolean,
            default: true
        },

        author: {
            type: String
        },
        author_type: {
            type: String
        },
        created: {
            type: Date,
            default: Date.now
        },
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
        }]

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'asset_types_trash'
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

            mongoose.model('asset_types_trash', schema);
            module.exports._model = mongoose.model('asset_types_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
