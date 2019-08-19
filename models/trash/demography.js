var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        demography_trash_id: {
            type: String,
            required: false
        },
        title: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        first_name: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        last_name: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        gender: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        email: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        phone: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        alternate_phone: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        blood_group: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        date_of_birth: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        age: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },

        mother_name: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        mcts_id: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        religion: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        caste: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        marital_status: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        height: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        weight: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        income_group: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        aadhar_number: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        address_proof: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        address_proof_number: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        education: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        occupation: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        citizenship: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        present_address: [{
            address1: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            address2: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            pincode: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            district: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            municipality: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            location: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            city: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            state: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            country: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            }
        }],
        same_as_present_address: {
            title: String,
            placeholder: String,
            isRequired: Boolean,
            isDisplay: Boolean,
            defaultValue: String,
            error_message: String
        },
        perminant_address: [{
            address1: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            address2: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            pincode: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            district: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            municipality: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            location: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            city: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            state: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            },
            country: {
                title: String,
                placeholder: String,
                isRequired: Boolean,
                isDisplay: Boolean,
                defaultValue: String,
                error_message: String
            }
        }],


        author: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
        },

        author_type: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"]
        },
        created: {
            type: String,
            required: true,
            default: Date.now
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
        }],
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
                collection: 'demography_trash'
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

            mongoose.model('demography_trash', schema);
            module.exports._model = mongoose.model('demography_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}
