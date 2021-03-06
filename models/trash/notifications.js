var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        title: String,
        description: String,
        created: Date,
        notify_type: String,
        link: String,
        sender_id: String,
        sender_type: String,
        reciever_id: String,
        reciever_type: String,
        isRead: Boolean,
        read_time: Date
    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'notifications_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);

            mongoose.model('notifications_trash', schema);
            module.exports._model = mongoose.model('notifications_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
