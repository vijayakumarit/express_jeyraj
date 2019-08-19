var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,

        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: false
        },

        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        author: {
            type: String,
            required: [true, "Please logout from the session and re-login into the application"]
        },
        author_type: {
            type: String,
            required: [true, "Please logout from the session and re-login into the application"]
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
        }
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'titles_trash'
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


            mongoose.model('titles_trash', schema);
            module.exports._model = mongoose.model('titles_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
