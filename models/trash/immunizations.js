var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        patient_id: {
            type: String, //Here patient_id will store
            required: false,
            ref: 'users'

        },
        immunization_trash_id: {
            type: String,
            required: false

        },

        patient_uhid: {
            type: String,
            required: false

        },
        center_id: {
            type: Number, //Here _id of center will store
            required: false,
            ref: 'centers'

        },
        /*  vaccine_id: {
      type: String,
      required: true,
      ref: 'immunization_vaccines' //maintain vaccines master
  },
*/
        immunization_type: { //Standard and Drive
            type: String,
            required: true

        },

        vaccine: [{
            _id: String,
            age: String,
            vaccine: Array

        }],
        drive_history: Array,
        /* drive_history: [{
             vaccine: String,
             comments: String,
             created: Date
         }],*/

        /* comments: {
             type: String,
             required: false
         },*/
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        author: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
        },

        author_type: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
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
                collection: 'immunizations_trash'
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

            mongoose.model('immunizations_trash', schema);
            module.exports._model = mongoose.model('immunizations_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
