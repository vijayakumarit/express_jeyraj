var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,

        schedule_date: {
            type: Date,
            required: true
        },
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },

        blocked_slots: [{
                patient_id: String,
                consultation_id: String,
                Speciality: String
            }] //List of Unique ConsultationIDs

            ,
        created: {
            type: Date,
            required: true,
            default: Date.now
        }
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'scheduled_consultations_trash'
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


            mongoose.model('scheduled_consultations_trash', schema);
            module.exports._model = mongoose.model('scheduled_consultations_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}