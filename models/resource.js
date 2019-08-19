var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../configurations/connections/db.js');
var AutoIncrement = require('mongoose-sequence');
var uniqueValidator = require('mongoose-unique-validator');
// var deepPopulate = require('mongoose-deep-populate')(mongoose);


module.exports = {
    _schema: null,

    _schema_def: {
        _id: String,
        application_id: {
            type: String,
            required: true,
            ref: 'master_applications'

        },
        employee_id: {
            type: String,
            required: true,
            unique: true
        },
        center_id: {
            type: [Number],
            required: false,
            ref: 'centers'
        },
        /*
                assigned_centers: {
                    type: String,
                    required: false,
                    ref: 'centers'
                },*/
        active_center_id: {
            type: Number,
            required: false,
            ref: 'centers'
        },
        active_camp_id: {
            type: String,
            required: false,
            ref: 'camps'
        },
        active_center_name: {
            type: String,
            required: false
        },
        /* active_center_id: {
             value : Number,
             cc_type: String,
             cc_details : {}
         },*/
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
            lowercase: true,
            unique: true,
            required: [true, "Email field is required"],
            uniqueCaseInsensitive: true
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
            required: [false, "About Me field is required"]
        },
        gender: {
            type: String,
            required: [false, "Gender field is required"]
        },
        age: {
            type: Number,
            required: [false, "Age field is required"]
        },
        phone: {
            type: Number,
            //   unique: true,
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
            required: [false, "Address  field is required"]
        },
        location: {
            type: Number,
            required: [false, "Location is required"],
            ref: 'locations'
        },
        municipality: {
            type: Number,
            required: [false, "Municipality field is required"],
            ref: 'municipalities'
        },
        district: {
            type: Number,
            required: [false, "District field is required"],
            ref: 'districts'
        },
        city: {
            type: String,
            required: false
        },
        state: {
            type: Number,
            required: true,
            ref: 'states'
        },
        districtManagerState:{
            type: Number,
            required: false,
            ref: 'states'
        },
        districtManagerDistrict:{
            type: Number,
            required: false,
            ref: 'districts'
        },
        assined_project:{
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false,
            default: 'India'
        },
        zipcode: {
            type: Number,
            required: [false, "Pincode field is required"]
        },
        speciality: {
            type: String,
            required: [false, "Speciality field is required"]
        },
        languagesKnown: {
            type: [String],
            required: [true, "Languages are required"]
        },
        role: {
            type: String,
            required: true
        },
        actual_role: {
            type: String,
            required: true
        },
        /* address_proof_type: {
             type: String,
             required: false
         },
         address_proof_number: {
             type: String,
             required: false,
             unique: false
         },*/
        registered_number: { //MCI Registered or Board Council Regestered etc
            type: String,
            required: [false, 'Registered Number Field is required']
           /* unique: true,
            uniqueCaseInsensitive: true*/
        },
        qualification: {
            type: [String],
            required: [false, 'Qualification Field is required']
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        joining_date: {
            type: Date,
            required: false
        },
        pharmacy_access: {
            type: Boolean,
            required: false,
            default: false
        },
        lab_access: {
            type: Boolean,
            required: false,
            default: false
        },
        paramedic_access: {
            type: Boolean,
            required: false,
            default: false
        },
        is_loggedin: {
            type: Boolean,
            required: false
        },
        token: {
            type: String,
            required: false
        },
        last_login_time: {
            type: Date,
            required: false,
            default: Date.now
        },
        last_logout_time: {
            type: Date,
            required: false,
            default: Date.now
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
        is_digital_signature :{
            type : Boolean,
            required : false
        },
        usb_token_key_alias : {
            type : String,
            required : false
        },
        is_digitized_signature : {
            type : Boolean,
            required : false
        },
        digitized_signature_pin:{
            type: Number,
            required: false
        },
        digitized_signature_name:{
            type: String,
            required:false
        },
        digitized_signature_base64:{
            type: String,
            required: false
        },
        is_global_user:{// For single sign on user
            type: Boolean,
            required: false,
            default: false
        },
        is_munich_user : { // For Munich coordinators(ASHA - Munich Device Integration to diffrentiate from others)
            type : Boolean,
            required : false,
            default : false
        },
        is_scheduler: { /// for doctor who all are part of scheduler
            type : Boolean,
            required : false
        }




    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'resources'
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


            mongoose.model('resources', schema);
            module.exports._model = mongoose.model('resources');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}