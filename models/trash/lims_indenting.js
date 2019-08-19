var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        title: {
            type: String,
            required: [true, "Please enter Title"]

        },
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },
        indenting_trash_id: {
            type: String,
            required: false

        },
        materials: [{
            type: { //Consumables or reagents etc...
                type: String,
                required: [true, "Please enter Material Type"]
            },
            name: {
                type: String,
                required: [true, "Please enter Material Name"]
            },
            available_quantity: { //Available quantity of that particular center
                type: String,
                required: false
            },
            quantity: {
                type: Number,
                required: [true, "Please enter Material Quantity"]
            },
            units: {
                type: String,
                required: [true, "Please enter Material Quantity Units"]
            },
            created: {
                type: Date,
                required: false
            },
            previously_raised_on: {
                type: Date,
                required: false
            },
            test_done: {
                type: Number,
                required: false
            },
            is_received: {
                type: Boolean,
                required: false,
                default: false
            }


        }],
        comments: {
            type: String,
            required: [false, "Please enter comments"]

        },
        center_id: {
            type: Number,
            required: true,
            ref: 'centers'
        },
        is_accepted: {
            type: Boolean,
            required: false,
        },

        accepted_by: {
            type: String,
            required: false,
            ref: 'resources'
        },
        accepted_time: {
            type: Date,
            required: false
        },

        is_rejected: {
            type: Boolean,
            required: false,
        },

        rejected_by: {
            type: String,
            required: false,
            ref: 'resources'
        },
        rejected_time: {
            type: Date,
            required: false
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
            type: Date,
            required: true
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
                collection: 'lims_indenting_trash'
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

            mongoose.model('lims_indenting_trash', schema);
            module.exports._model = mongoose.model('lims_indenting_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}