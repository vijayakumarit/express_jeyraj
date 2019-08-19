var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var AutoIncrement = require('mongoose-sequence');




module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        list_code: {
            type: Number,
            required: false


        },
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },
        pharmacy_trash_id: {
            type: String,
            required: false

        },
        description: {
            type: String,
            required: [true, 'Description is required']

        },
        center_id: {
            type: [Number],
            required: false,
            ref: 'centers'
        },
        items: {
            type: Array,
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
            type: Date,
            required: true,
            default: Date.now
        },
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
        }]

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'pharmacy_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);
            /*schema.plugin(AutoIncrement, {
                inc_field: 'uhid'
            });*/
            /*  //  schema.plugin(uniqueValidator, {
  message: ' {PATH} - " {VALUE} "  is already exists.'
  });
*/
            // schema.plugin(deepPopulate);


            mongoose.model('pharmacy_trash', schema);
            module.exports._model = mongoose.model('pharmacy_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}