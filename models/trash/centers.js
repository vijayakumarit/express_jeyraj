var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');
var AutoIncrement = require('mongoose-sequence');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        /*center_id: {
            type: Number ,
            default: 2,
            unique: true
        },*/
        application_id: {
            type: String,
            required: true,
            ref: 'master_applications'

        },

        center_abbrivation: {

            type: String
            /*,
                        unique: true,
                        uniqueCaseInsensitive: true*/

        },
        financial_center_code: {
            type: String,
            required: [false, "Please enter  Center Financial code"]

        },
        center_type: {
            type: String,
            ref: 'center_types'
        },
        centers_trash_id: {
            type: String
        },
        /*center_id: {
            type: String ,
            ref: 'center_types'
        },*/
        center_group: {
            type: String,
            ref: 'groups'
        },
        center_drug_list: {
            type: String,
            ref: 'pharmacy'
        },
        first_name: {
            type: String

        },
        middle_name: {
            type: String
        },
        last_name: {
            type: String
        },
        image: {
            type: String
        },
        phone: {
            type: Number,
            required: [false, "Phone number required"]
            /*,
                        unique: true*/
        },
        alternate_phone: {
            type: Number
        },
        address: {
            type: String
        },
        location: {
            type: String,
            required: [false, "Location is required"]
        },
        mandal: {
            type: String
        },
        muncipality: {
            type: String
        },
        district: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        zipcode: {
            type: Number
        },
        remarks: {
            type: String
        },
        timings: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        testsList: { //change to diagnostic_tests
            type: Array,
            ref: 'lims_ranges'
        },
        spoc: {
            type: String
        },
        spoc_email: {
            type: String
        },
        spoc_phone: {
            type: Number
        },
        spoc_alternate_phone: {
            type: Number
        },
        documents: {
            type: Array
        },
        resources: {
            type: [String],
            required: false,
            ref: 'resources'
        },
        author: {
            type: String
        },
        author_type: {
            type: String
        },
        created: {
            type: Date,
            default: Date.now
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
        deleted_time: {
            type: Date
        },
        deleted_by_role: {
            type: String
        },
        status_log: [{
            _id: String,
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
                collection: 'centers_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();
            //model.counterReset();

            schema.plugin(mongoosePaginate);
            // schema.plugin(AutoIncrement);
            module.exports.validate(schema);

            schema.plugin(uniqueValidator, {
                message: ' {PATH} -{VALUE}  is already exists.'
            });

            mongoose.model('centers_trash', schema);
            schema.pre('findOneAndUpdate', function(next) {
                this.options.runValidators = true;
                next();
            });


            module.exports._model = mongoose.model('centers_trash');
        }


        return new_instance ?
            new module.exports._model() : module.exports._model;
    },
    validate: function(schema) {
        /* var doc = new mongoose.Document({}, schema);
         doc.validate(function(error) {
             assert.ok(error);
             assert.equal('Path `name` is required.', error.errors['first_name'].message);
             assert.equal('Path `quest` is required.', error.errors['description'].message);
             assert.equal('Path `favoriteColor` is required.',
                 error.errors['author'].message);


         });*/
    }
}