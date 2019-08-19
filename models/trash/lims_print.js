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
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },
        test_group: {
            type: String,
            required: true
        },
        print_trash_id: {
            type: String,
            required: false

        },
        sample_type: {
            type: String,
            required: true
        },
        sample_instructions: {
            type: String,
            required: false
        },
        method: {
            type: String,
            required: false
        },
        report_estimated_date: {
            type: Number, //add no.of Days to present date. This logic for front-end
            required: false,
            default: 1
        },
        abbrevation: {
            type: String,
            required: false
        },
        result_type: {
            type: String,
            required: false
        },
        print_title: {
            type: String,
            required: false
        },
        print_description: {
            type: String,
            required: false
        },
        print_order: {
            type: Number,
            required: false
        },
        print_group: {
            type: String,
            required: false
        },
        print_flag: {
            type: Boolean,
            required: false
        },
        sample_flag: {
            type: Boolean,
            required: false
        },
        comments: {
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
                collection: 'lims_print_trash'
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

            mongoose.model('lims_print_trash', schema);
            module.exports._model = mongoose.model('lims_print_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}