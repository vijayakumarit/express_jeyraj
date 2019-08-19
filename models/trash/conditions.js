var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        Role: String,
        SNOMED_CID: Number,
        SNOMED_FSN: String,
        SNOMED_CONCEPT_STATUS: String,
        UMLS_CUI: String,
        OCCURRENCE: Number,
        USAGE: Number,
        FIRST_IN_SUBSET: Number,
        IS_RETIRED_FROM_SUBSET: String,
        LAST_IN_SUBSET: String,
        REPLACED_BY_SNOMED_CID: String




    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'conditions_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);

            mongoose.model('conditions_trash', schema);
            module.exports._model = mongoose.model('conditions_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
