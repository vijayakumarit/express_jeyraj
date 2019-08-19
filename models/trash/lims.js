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
        consultation_id: {
            type: String,
            required: true
        },
        lims_trash_id: {
            type: String,
            required: false

        },
        doctor_id: {
            type: String,
            required: true,
            ref: 'resources'
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
        test_group: {
            type: String,
            required: true
        },
        test_created_on: {
            type: Date, //Doctor Suggested Date
            required: false
        },
        is_emergency: {
            type: Boolean,
            required: false,
            default: false
        },
        sample_id: {
            type: Number,

            required: false
        },
        is_sample_collected: {
            type: Boolean,
            required: true,
            default: false
        },
        sampled_collected_on: {
            type: Date,
            required: false
        },
        sample_remarks: {
            type: String,
            required: false
        },
        is_sample_damaged: {
            type: Boolean,
            required: false
        },
        sample_damaged_on: {
            type: Date,
            required: false
        },
        sample_damaged_comments: {
            type: String,
            required: false
        },
        is_resamples_collected: {
            type: Boolean,
            required: false
        },
        resamples_collected_on: {
            type: Date,
            required: false
        },
        is_redo_test: {
            type: Boolean,
            required: false
        },
        redo_test_on: {
            type: Date,
            required: false
        },
        redo_comments: {
            type: String,
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
        patient_id: {
            type: String,
            required: false,
            ref: 'users'
        },
        patientName: {
            type: String,
            required: false
        },
        patient_uhid: {
            type: String,
            required: false
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
        reports_uploaded_time: {
            type: Date,
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

        is_reports_authenticated: {
            type: Boolean,
            required: false
        },
        reports_authenticated_by: {
            type: String,
            required: false
        },
        reports_authenticated_person_name: {
            type: String,
            required: false
        },
        reports_authentication_remarks: {
            type: String,
            required: false
        },
        reports_authenticated_time: {
            type: Date,
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
                collection: 'lims_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);

            mongoose.model('lims_trash', schema);
            module.exports._model = mongoose.model('lims_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}