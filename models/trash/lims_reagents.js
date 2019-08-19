var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        test_id: {
            type: String,
            required: true,
            ref: 'lims_ranges'
        },
        reagent_name: {
            type: String,
            required: true
        },
        reagent_trash_id: {
            type: String,
            required: false

        },
        quantity: {
            type: Number,
            required: true
        },
        units: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: false,
            default: 0
        },
        min_order_quantity: {
            type: Number,
            required: false,
            default: 0
        },
        min_order_quantity_units: {
            type: String,
            required: false
        },
        asset_id: {
            type: String,
            required: false,
            ref: 'assets'
        },
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
                collection: 'lims_reagents_trash'
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

            mongoose.model('lims_reagents_trash', schema);
            module.exports._model = mongoose.model('lims_reagents_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
