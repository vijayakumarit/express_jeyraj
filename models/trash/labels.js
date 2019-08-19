var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');



module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        view: String,
        /** For New Center start here**/
        center_id: Object,
        financial_center_id: Object,
        center_type: Object,
        center_group: Object,
        center_drug_list: Object,
        center_name: Object,
        middle_name: Object,
        last_name: Object,
        image: Object,
        mobile: Object,
        alternative_phone: Object,
        address: Object,
        mandal: Object,
        muncipality: Object,
        district: Object,
        city: Object,
        state: Object,
        country: Object,
        zipcode: Object,
        remark: Object,
        timings: Object,
        isActive: Object,
        spoc_name: Object,
        spoc_email: Object,
        spoc_phone: Object,
        spoc_alternative_phone: Object,
        documents: Object,
        /** For New Center end here**/

        /** For New Roles start here**/
        actual_role: Object,
        description: Object,
        /** For New Roles end here**/

        author: {
            type: String,
            required: true
        },
        author_type: {
            type: String,
            required: true
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
                collection: 'labels_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);
            // module.exports.validate(schema);
            schema.plugin(uniqueValidator, {
                message: ' {PATH} - " {VALUE} "  is already exists.'
            });

            mongoose.model('labels_trash', schema);
            module.exports._model = mongoose.model('labels_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
