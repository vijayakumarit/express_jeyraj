var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');



module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        group_code: {
            type: Number,
            required: [false, 'Group Code is required']

        },
        description: {
            type: String,
            required: [false, 'Description is required']

        },
        groups_trash_id: {
            type: String,
            required: false

        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },

        author: {
            type: String,
            required: true
        },
        author_type: {
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
                collection: 'groups_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);
            // module.exports.validate(schema);
            schema.plugin(uniqueValidator, {
                message: ' {PATH} - " {VALUE} "  is already exists.'
            });

            mongoose.model('groups_trash', schema);
            module.exports._model = mongoose.model('groups_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
