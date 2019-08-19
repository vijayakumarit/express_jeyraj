var mongoose = require('mongoose');
var db = require('../configurations/connections/db.js');
var mongoosePaginate = require('mongoose-paginate');
//var uniqueValidator = require('uniqueValidator');




module.exports = {

    _schema: null,

    _schema_def: {
        _id: String,
        application_id: {
            type: String,
            required: true,
            ref: 'master_applications'

        },
        title: {
            type: String,
            required: [true, 'Title is required']
        },
        center_id: {
            type: Number,
            ref: 'centers'
        },
        district: {
            type: Number,
            ref: 'districts'
        },
        medicineList: [{
            _id: String,

            medicine_type: {
                type: String,
                ref: 'medicine_types'
            },
            medicine_name: {
                type: String,
                ref: 'medicine_names'
            },
            requested_quantity: {
                type: Number,
                required: false
            },
            available_quantity: {
                type: Number,
                required: false
            },
            last_quantity_received: {
                type: Number,
                required: false
            },
            recevied_on: {
                type: Date,
                required: false
            }
        }],
        status: { //status will be NEW, CLOSED
            type: String,
            required: [true, "Status is required"]
        },
        is_doctor_approved: {
            type: Boolean,
            required: false,
            default: false
        },
        is_doctor_rejected: {
            type: Boolean,
            required: false,
            default: false
        },
        is_supervisor_approved: {
            type: Boolean,
            required: false,
            default: false
        },
        is_supervisor_rejected: {
            type: Boolean,
            required: false,
            default: false
        },
        is_districtManager_approved: {
            type: Boolean,
            required: false,
            default: false
        },
        is_districtManager_rejected: {
            type: Boolean,
            required: false,
            default: false
        },
        is_projectManager_approved: {
            type: Boolean,
            required: false,
            default: false
        },
        is_projectManager_rejected: {
            type: Boolean,
            required: false,
            default: false
        },
        is_SCMAdmin_approved: {
            type: Boolean,
            required: false,
            default: false
        },
        is_SCMAdmin_rejected: {
            type: Boolean,
            required: false,
            default: false
        },
        is_vendor_approved: {
            type: Boolean,
            required: false,
            default: false
        },
        is_vendor_rejected: {
            type: Boolean,
            required: false,
            default: false
        },
        isEmergency: {
            type: Boolean,
            required: true,
            default: false
        },
        comments: {
            type: String,
            required: false
        },
        author: {
            type: String,
            required: true,
            ref: 'resources'
        },
        author_type: {
            type: String,
            required: true
        },
        author_name: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            required: true
        },
        status_log: [{
            message: String,
            author: String,
            author_type: String,
            author_name: String,
            created: {
                type: Date,
                default: Date.now
            }
        }],
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'pharmacy_indenting'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);
            /*schema.plugin(uniqueValidator, {
                message: ' {PATH} - " {VALUE} "  is already exists.'
            });*/

            mongoose.model('pharmacy_indenting', schema);
            module.exports._model = mongoose.model('pharmacy_indenting');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}