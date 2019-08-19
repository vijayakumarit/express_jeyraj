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
        vendor_trash_id: {
            type: String
        },
        itemName: {
            type: Array,
            ref : 'item_scm'
        },
        vendorName:{
            type: String,
        },
        branchName:{
            type: String,
        },
        gstNumber:{
            type: String,
        },
        panNumber:{
            type: String,
        },
        address:{
            type: String,
        },
        IFSCcode:{
            type: String,
        },
        state: {
            type: Number,
            ref: 'states'
        },
        district: {
            type: Number,
            ref: 'districts'
        },        
        bankAccountNo:{
            type: Number,
        },
        bankName:{
            type: Object,
        },
        spoc1Name:{
            type: String,
        },
        spoc1Phone:{
            type: Number,
        },
        spoc1Email:{
            type: String,
        },
        spoc2Name:{
            type: String,
        },
        spoc2Phone:{
            type: Number,
        },
        spoc2Email:{
            type: String,
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
        }],
        comments:{
            type:String,
        }

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'vendor_scm_trash'
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


            mongoose.model('vendor_scm_trash', schema);
            module.exports._model = mongoose.model('vendor_scm_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}