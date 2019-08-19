var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        speciality: {
            type: String,
            required: [true, "Speciality is required"]
        },
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },
        schedule_date: {
            type: Date,
            required: [true, "Schedule Date is required"]
        },
        number_of_slots_per_day: {
            type: Number,
            required: [true, "Number of slots per day is required"]
        },
        is_holiday: {
            type: Boolean,
            required: false
        },
        timings: [{
            _id: String,
            start_time: {
                type: Date, //Date with time
                required: [true, "Start time is required"]
            },
            end_time: {
                type: Date, //Date with time
                required: [true, "end time is required"]
            },
            number_of_doctors: {
                type: Number,
                required: [true, "Please enter number of doctors"]
            }
        }],
        // available_slots: [Date],
        available_slots: [{
            _id: String,
            time: Date,
            is_allocated: Boolean
        }],

        booked_slots: [{
            _id: String,
            time: Date, //Date with time
            consultation_id: {
                type: String,
                ref: 'consultations'
            },
            patient_id: {
                type: String,
                ref: 'users'
            },
            center_id: {
                type: Number,
                ref: 'centers'
            },
            created: Date,
            no_show: {
                no_show_by: String,
                no_show_by_name: String,
                no_show_by_type: String,
                updated: Date
            }
        }],
        removed_booked_slots: [{
            _id: String,
            time: Date, //Date with time
            consultation_id: {
                type: String,
                ref: 'consultations'
            },
            center_id: {
                type: String,
                ref: 'centers'
            },
            patient_id: {
                type: String,
                ref: 'users'
            },
            created: Date,
            reason_for_delete: String,
            no_show: {
                no_show_by: String,
                no_show_by_name: String,
                no_show_by_type: String,
                updated: Date
            }

        }],

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
                collection: 'doctor_schedule_trash'
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

            mongoose.model('doctor_schedule_trash', schema);
            module.exports._model = mongoose.model('doctor_schedule_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}