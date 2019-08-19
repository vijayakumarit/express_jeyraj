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
        item_trash_id: {
            type: String
        },
        itemCategory:{
            type: Object,
        },
        itemName:{
            type: String,
        },
        description:{
            type: String,
        },
        modelNumber:{
            type: String,
        },
        itemCatNumber:{
            type: String,
        },
        units:{
            type: Object,
        },
        pricePerUnit:{
            type: Number,
        },
        setOfItems:{
            type: Number,
        },
        totalCost:{
            type: Number,
        },
        GST:{
            type: String,
        },
        MOQ:{
            type: Number,
        },
        isClinical:{
            type: Boolean,
            default: false
        },
        consumptionCategory:{
            type: Object,
        },
        created_on: {
            type: Date,
        },
        author: {
            type: String
        },
        author_type:{
            type: String
        },
        created_by: {
            type: String,
        },
        updated_on:{
            type: Date,
        },
        updated_by:{
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        reason_for_delete: {
            type: String
        },
        deleted_by: {
            type: String
        },
        deleted_on: {
            type: Date
        },
        deleted_by_role: {
            type: String
        },
        deleted_person_name:{
            type: String,
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
        comments:{
            type:String
        }

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'item_scm_trash'
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


            mongoose.model('item_scm_trash', schema);
            module.exports._model = mongoose.model('item_scm_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}