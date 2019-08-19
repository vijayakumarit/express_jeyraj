var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../configurations/connections/db.js');
var AutoIncrement = require('mongoose-sequence');
var uniqueValidator = require('mongoose-unique-validator');
// var deepPopulate = require('mongoose-deep-populate')(mongoose);


module.exports = {
    _schema: null,
    _schema_def: {
        _id: String,
        application_id: {
            type: String,
            required: true,
            ref: 'master_applications'
        },
        vendor: {
            type: Array,
            required: false,
            ref : 'vendor_scm'
        },
        state: {
            type: Number,
            required: false,
            ref: 'states'
        },
        district: {
            type: Number,
            required: [false, "District is required"],
            ref: 'districts'
        },        
        created_on: {
            type: Date,
            default: Date.now,
            required: false
        },
        author:{
            type: String,
            required: false
        },
        author_type:{
            type: String,
            required: false
        },
        created_by:{
            type: String,
            required: false
        },
        updated_on:{
            type: Date,
            default: Date.now,
            required: false
        },
        updated_by:{
            type: String,
            required: false
        },
        isDeleted: {
            type: Boolean,
            default: false,
            required: false
        },
        reason_for_delete: {
            type: String,
            required: false
        },
        deleted_by: {
            type: String,
            required: false
        },
        deleted_on: {
            type: Date,
            default: Date.now,
            required: false
        },
        deleted_by_role: {
            type: String,
            required: false
        },
        deleted_person_name:{
            type: String,
            required: false
        },
        status_log: [{
            _id: String,
            message: String,
            author: String,
            author_type: String,
            author_name: String,
            created: {
                type: Date,
                default: Date.now
            }
        }]
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'mapping_vendor_scm'
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
            schema.plugin(uniqueValidator, {
                message: ' {PATH} - " {VALUE} "  is already exists.'
            });
            // schema.plugin(deepPopulate);


            mongoose.model('mapping_vendor_scm', schema);
            module.exports._model = mongoose.model('mapping_vendor_scm');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}