var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        patientId: String,
        role: String,
        token: String,
        created: Date
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'usersessions_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);

            mongoose.model('usersessions_trash', schema);
            module.exports._model = mongoose.model('usersessions_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
