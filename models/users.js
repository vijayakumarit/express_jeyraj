var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        application_id: {
            type: String,
            required: true,
            ref: 'master_applications'

        },
        uhid: {
            type: String,
            required: true,
            unique: true
        },
        old_uhid: {
            type: String,
            required: false
        },
        center_id: {
            type: Number,
            required: false,
            ref: 'centers'
        },
        clinic_uhid: {
            type: String,
            required: false
        },
        client_id: {
            type: Number,
            required: false
        },
        title: {
            type: String,
            required: [false, "Title  is required"]
        },
        first_name: {
            type: String,
            required: [true, "First Name  is required"]
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
            required: false
            /*validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: '{VALUE} is not a valid email'
            }*/
        },
        image: {
            type: String,
            required: false
        },

        gender: {
            type: String,
            required: [true, "Gender is required"]
        },
        age: {
            type: Number,
            required: [true, "Age is required"]
        },
        age_years: {
            type: Number,
            required: false
        },
        age_months: {
            type: Number,
            required: false
        },
        age_days: {
            type: Number,
            required: false
        },
        age_group: {
            type: String,
            required: false
        },
        age_type: {
            type: String,
            required: false
        },
        birthDate: {
            type: String,
            required: false
        },
        phone: {
            type: Number,
            default: 0,
            required: [false, "Mobile Number is required"]
        },
        alternative_phone: {
            type: Number,
            required: false
        },
        relationship: {
            relation_type: {
                type: String,
                required: false
            },
            relation_value: {
                type: String,
                required: false
            }

        },
        bloodgroup: {
            type: String,
            required: false
        },

        marital_status: {
            type: String,
            required: [false, "Marital Status is required"]
        },
        mother_name: {
            type: String,
            required: [false, "Mother Name is required"]

        },
        present_address: {
            address: {
                type: String,
                required: [false, "Address is required"]
            },
            location: {
                type: Number,
                required: [false, "Location is required"],
                ref: 'locations'
            },
            address2: {
                type: String,
                required: false
            },

            municipality: {
                type: Number,
                required: [false, "Municipality is required"],
                ref: 'municipalities'
            },
            district: {
                type: Number,
                required: [false, "District is required"],
                ref: 'districts'
            },
            city: {
                type: String,
                required: [false, "City is required"]
            },
            state: {
                type: Number,
                required: false,
                ref: 'states'
            },
            country: {
                type: String,
                required: [false, "Country is required"],
                default: 'INDIA'
            },
            zipcode: {
                type: String,
                required: [false, "PinCode is required"]
            }

        },
        is_same_address: { //If present address and Perminant address same or not
            type: Boolean,
            required: true,
            default: true

        },
        yearly_income: {
            type: String,
            required: false
        },
        permanent_address: {
            address: {
                type: String,
                required: [false, "Address is required"]
            },
            location: {
                type: Number,
                required: [false, "Location is required"],
                ref: 'locations'
            },
            municipality: {
                type: Number,
                required: [false, "Municipality is required"],
                ref: 'municipalities'
            },
            address2: {
                type: String,
                required: false
            },
            district: {
                type: Number,
                required: [false, "District is required"],
                ref: 'districts'
            },
            city: {
                type: String,
                required: [false, "City is required"]
            },
            state: {
                type: Number,
                required: false,
                ref: 'states'
            },
            country: {
                type: String,
                required: [false, "Country is required"],
                default: 'INDIA'
            },
            zipcode: {
                type: String,
                required: [false, "PinCode is required"]
            }
        },
        aadhar_card: {
            type: String,
            unique: false,
            required: [false, "Aadhar card number is required"]
        },
        address_proof_type: {
            type: String,
            required: [false, "Address Proof type is required"]
        },
        address_proof_number: {
            type: String,
            required: [false, "Address Proof Number is required"],
            unique: false,
            uniqueCaseInsensitive: false
        },
        citizenship: {
            type: String,
            required: [false, "Citizenship is required"]
        },
        occupation: {
            type: String,
            required: [false, "Occupation is required"]
        },
        education: {
            type: String,
            required: [false, "Education is required"]
        },
        religion: {
            type: String,
            required: [false, "Religion is required"]
        },
        caste: {
            type: String,
            required: [false, "Caste is required"]
        },
        incomegroup: {
            type: String,
            required: [false, "Income Group is required"]
        },
        mcts_id: {
            type: String,
            required: false
        },
        height: {
            type: Number,
            required: false
        },
        height_units: {
            type: String,
            required: false
        },
        weight: {
            type: Number,
            required: false
        },
        weight_units: {
            type: String,
            required: false
        },

        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        on_boarding_start_time: {
            type: Date,
            required: false
        },
        on_boarding_end_time: {
            type: Date,
            required: false
        },
        //newly Added Fields From KRIA

        age_type_id: {
            type: Number,
            required: false,
            ref: 'age_types'
        },

        age_group_id: {
            type: Number,
            required: false,
            ref: 'age_groups'
        },

        father_name: {
            type: String,
            required: false
        },

        husband_name: {
            type: String,
            required: false
        },

        salutation: {
            type: String,
            required: false
        },

        medmantra_instant_UHID: {
            type: String,
            required: false
        },
        auto_vitals_id: {
            type: String,
            required: false,
            ref: 'auto_vitals_upload'
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
            _id: String,
            message: String,
            author: String,
            author_type: String,
            created: {
                type: Date,
                default: Date.now
            }
        }],
        consent_form: [{
            path:String,
            consentDoc_date: {
                type: Date,
                default: Date.now
            }
         }],
         is_consent_JH: {
            type: Boolean,
            required: false,
            default: false
        },
    },

    schema: function () {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'patients'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function (new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();

            schema.plugin(mongoosePaginate);
            schema.plugin(uniqueValidator, {
                message: ' {PATH} - " {VALUE} "  is already exists.'
            });

            mongoose.model('users', schema);
            module.exports._model = mongoose.model('users');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}