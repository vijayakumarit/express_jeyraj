var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        patientID: String,
        filename: String,
        description: String,
        created: Date,
        spoke: String,
        inS3: Boolean,
        s3Path: Object
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'userfiles_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);

            mongoose.model('userfiles_trash', schema);
            module.exports._model = mongoose.model('userfiles_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
