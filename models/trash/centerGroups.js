var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        group: {
            type: String,
            required: true

        },
        isActive: {
            type: Boolean,
            required: false,
            default: false
        },
        author: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        isDeleted: {
            type: Boolean,
            required: false,
            default: false
        },
        reason_for_delete: {
            type: String,
            required: true
        },
        deleted_by: {
            type: String,
            required: true
        },
        deleted_time: {
            type: Date,
            required: true,
            default: Date.now
        },
        deleted_by_role: {
            type: String,
            required: true
        }

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'center_groups_trash'
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

            mongoose.model('center_groups_trash', schema);
            module.exports._model = mongoose.model('center_groups_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
