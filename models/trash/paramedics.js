var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var AutoIncrement = require('mongoose-sequence');
var uniqueValidator = require('mongoose-unique-validator');
var centers = require('./centers');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        uhid: {
            type: Number,
            required: true
        },
        center_id: {
            type: [String],
            required: false,
            ref: 'centers'
        },
        active_center_id: {
            type: String,
            required: false,
            ref: 'centers'
        },
        title: {
            type: String,
            required: [true, "Title field is required"]
        },
        first_name: {
            type: String,
            required: [true, "First Name field is required"]
        },
        middle_name: {
            type: String,
            required: false
        },

        last_name: {
            type: String,
            required: false
        },

        email: {
            type: String,
            lowercase: true
            required: [true, "Email field is required"]
        },
        username: {
            type: String,
            lowercase: true,
            required: [true, "Email field is required"] //For Now Email is Username
        },
        password: {
            type: String,
            required: [true, "Password field is required"]
        },
        image: {
            type: String,
            required: false
        },
        aboutMe: {
            type: String,
            required: [true, "About Me field is required"]
        },
        gender: {
            type: String,
            required: [true, "Gender field is required"]
        },
        age: {
            type: Number,
            required: [true, "Age field is required"]
        },
        phone: {
            type: Number,

            default: '0000000000',
            required: [true, "Phone number field is required"]
        },
        alternate_phone: {
            type: Number,
            required: false
        },
        mrc: { //Is Member Remote Consultation Access
            type: Boolean,
            required: true,
            default: false
        },
        address: {
            type: String,
            required: [true, "Address  field is required"]
        },
        municipality: {
            type: String,
            required: [true, "Municipality field is required"]
        },
        district: {
            type: String,
            required: [true, "District field is required"]
        },
        state: {
            type: String,
            required: [true, "State field is required"]
        },
        country: {
            type: String,
            required: true,
            default: 'India'
        },
        zipcode: {
            type: Number,
            required: [true, "Pincode field is required"]
        },
        languagesKnown: {
            type: [String],
            required: [true, "Languages are required"]
        },
        role: {
            type: String,
            required: true,
            default: 'paramedic'
        },

        registered_number: { //MCI Registered or Board Council Regestered etc
            type: String,

            required: [true, 'Registered Number Field is required']
        },
        qualification: {
            type: [String],
            required: [true, 'Qualification Field is required']
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },

        author: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
        },
        author_type: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
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
        },
        status_log: [{
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
                collection: 'paramedics_trash'
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
                message: 'Error, expected {PATH} to be unique.'
            });


            mongoose.model('paramedics_trash', schema);
            module.exports._model = mongoose.model('paramedics_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
