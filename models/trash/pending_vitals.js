var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        patient_details: {
            type: String, //Here patient_id will store
            required: true,
            ref: 'users'

        },
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },
        center_id: {
            type: Number, //Here _id of center will store
            required: true,
            ref: 'centers'

        },
        pending_vitals: {
            type: Boolean,
            required: true,
            default: true
        },
        is_remote_consultation: {
            type: Boolean,
            required: false,
            default: false
        },
        scheduled_on: {
            type: Date,
            required: true
        },
        speciality: {
            type: String, //For remote consultation will store speciality
            required: false
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        }


    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'pending_vitals_trash'
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

            mongoose.model('pending_vitals_trash', schema);
            module.exports._model = mongoose.model('pending_vitals_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}