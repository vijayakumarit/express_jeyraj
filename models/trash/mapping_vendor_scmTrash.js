var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var AutoIncrement = require('mongoose-sequence');
var uniqueValidator = require('mongoose-unique-validator');
// var deepPopulate = require('mongoose-deep-populate')(mongoose);


module.exports = {
    _schema: null,
    _schema_def: {
        _id: String,
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'
        },
        vendor_mapping_trash_id:{
            type: String
        },
        vendor: {
            type: Array,
            ref : 'vendor_scm'
        },
        state: {
            type: Number,
            ref: 'states'
        },
        district: {
            type: Number,
            ref: 'districts'
        },        
        created_on: {
            type: Date,
            default: Date.now,
        },
        author:{
            type: String,
        },
        author_type:{
            type: String,
        },
        created_by:{
            type: String,
        },
        updated_on:{
            type: Date,
            default: Date.now,
        },
        updated_by:{
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        reason_for_delete: {
            type: String,
        },
        deleted_by: {
            type: String,
        },
        deleted_on: {
            type: Date,
            default: Date.now,
        },
        deleted_by_role: {
            type: String,
        },
        deleted_person_name:{
            type: String,
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
                collection: 'mapping_vendor_scmTrash'
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


            mongoose.model('mapping_vendor_scmTrash', schema);
            module.exports._model = mongoose.model('mapping_vendor_scmTrash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}