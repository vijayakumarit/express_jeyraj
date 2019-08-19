var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        test_name: {
            type: String,
            required: true

        },
        test_code: { //test_code is Short Name for Test
            type: String,
            required: false

        },
        range_trash_id: {
            type: String,
            required: false

        },
        test_group: {
            type: String,
            required: true
        },
        sample_type: {
            type: String,
            required: true
        },
        test_parameters: [{
            _id: String,
            parameter: String,
            code: String,
            display: {
                type: Boolean,
                default: true
            },
            gender: String,
            min_age: Number,
            max_age: Number,
            age_type: String,
            min_value: Number,
            max_value: Number,
            control_value: Number,
            min_panic_number: Number,
            max_panic_number: Number,
            order: Number,
            group: String,
            units: String,
            result_type: String,
            expected_result_value: String, //This will be only for result_type string
            remarks: String,
            created: {
                type: Date,
                default: Date.now
            },
            author: String,
            author_type: String,
            result_value: String, //This is only for machine integration,
            raw_result_value: String


        }],
        materials: [{
            _id: String,
            name: String, //material name
            quantity: Number, //material quantity
            units: String //material quantity units

        }],
        sample_types: [{
            _id: String,
            name: String,
            quantity: Number,
            units: String,
            description: String

        }],
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
                collection: 'lims_ranges_trash'
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

            mongoose.model('lims_ranges_trash', schema);
            module.exports._model = mongoose.model('lims_ranges_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
