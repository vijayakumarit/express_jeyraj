var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },

        test_name: {
            type: String,
            required: true
        },
        test_id: {
            type: String,
            required: false,
            ref: 'lims_ranges'
        },
        qc1_trash_id: {
            type: String,
            required: false

        },
        test_group: {
            type: String,
            required: true
        },
        test_created_on: {
            type: Date, //Doctor Suggested Date
            required: true
        },
        sample_id: {
            type: Number,
            required: false
        },

        lot_number: {
            type: Number,
            required: false
        },
        standard_deviation: {
            type: Number,
            required: false
        },
        labtechnician_id: {
            type: String,
            required: false,
            ref: 'resources'
        },
        labtechnician_name: {
            type: String,
            required: false
        },
        center_id: {
            type: Number,
            required: false,
            ref: 'centers'
        },

        status: {
            type: String,
            required: false
        },

        updatedOn: {
            type: Date,
            required: false
        },
        device_id: {
            type: String,
            required: false
        },
        device_name: {
            type: String,
            required: false
        },
        device_model: {
            type: String,
            required: false
        },
        reports: {
            type: Array,
            required: false
        },
        is_reports_done: {
            type: Boolean,
            required: false
        },

        raw_data: {
            type: String,
            required: false
        },
        remarks: {
            type: String,
            required: false
        },


        statusLog: [{
            _id: String,
            message: String,
            author: String,
            author_type: String,
            created: {
                type: Date,
                default: Date.now
            }
        }],
        created: {
            type: Date,
            required: true,
            default: Date.now
        }



    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'lims_qc1_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);

            mongoose.model('lims_qc1_trash', schema);
            module.exports._model = mongoose.model('lims_qc1_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}