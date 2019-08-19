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
        center_id:{
            type : Number,
            required : false,
            ref : 'centers'
        },
        patient_id: {
            type: String,
            required: true,
            ref: 'patients'
        },
        rch_id : {
            type : String,
            required : false
        },
        pw_sno : {
            type : String,
            required : false
        }, 
        hbin_previous_visit : {
            type : Boolean,
            required : false
        },
        asha_name: {
            type: String,
            required: false
        },
        registration_date: {
            type: Date,
            required: false
        },
        pw_name: {
            type: String,
            required : false
        },

        husband_name: {
            type: String,
            required: false
        },
        religion: {
            type: String,
            required: false
        },
        caste: {
            type: String,
            required: false
        },
        bpl_apl: {
            type: String,
            required: false
        },
        trimester_registered: {
            type: String,
            required: false
        },
        date_of_birth: {
            type: Date,
            required: false
        },
        pw_weight: { 
            type: Number,
            required: false
        },
        lmp: {
            type: Date,
            required: false
        },
        edd: {
            type: Date,
            required: false
        },
        past_illness : {
            tb : Boolean,
            diabetes : Boolean,
            hypertension : Boolean,
            heart_diseases : Boolean,
            epileptic : Boolean,
            sti_rti : Boolean,
            hiv : Boolean,
            hepatits_b : Boolean,
            asthma : Boolean,
            none : Boolean
        },
        past_obstetric_history : {
            gravida: {
                type: Number,
                required: false
            },
            para: {
                type: Number,
                required: false
            },
            living: {
                type: Number,
                required: false
            },
            abortions: {
                type: Number,
                required: false
            },
            deaths: {
                type: Number,
                required: false
            }
        },
        hbsag : {
            type : String,
            required : false
        },
        hiv_screening_test : {
            type : String,
            required : false
        },

        vdrl : {
            type : String,
            required : false
        },

        hbsag_done : {
            type : String,
            required : false
        },
        HIV_Test_done : {
            type : String,
            required : false
        },
        vdrl_done : {
            type : String,
            required : false
        },
        hbsag_done_date : {
            type : Date,
            required : false
        },
        HIV_Test_done_date : {
            type : Date,
            required : false
        },
        vdrl_done_date : {
            type : Date,
            required : false
        },
        prenatal : {
            type: [String],
            required: false
        },
        intrapartum : {
            type: [String],
            required: false
        },
        postnatal : {
            type: [String],
            required: false
        },
        tt1: {
            type: Date,
            required: false
        },
        tt2: {
            type: Date,
            required: false
        },
        tt1_no : {
            type : Boolean,
            required : false
        },
        tt1_given_outside : {
            type : Boolean,
            required : false
        },
        tt2_no : {
            type : Boolean,
            required : false
        },
        tt2_given_outside : {
            type : Boolean,
            required : false
        },
        pregnancy_complaints : {
            type : [String],
            required : false
        },
        pallor : {
            type  :String,
            required : false
        },
        IFA_tabs_given : {
            type : Number,
            required : false
        },
        fundal_height_uterus_size : {
            type : Number,
            required : false
        },
        foetal_heart_rate : {
            type : Number,
            required : false
        },
        foetal_presentational : {
            type : String,
            required  :false
        },
        foetal_movements : {
            type : Number,
            required : false
        },
        other_symptoms_high_risk : {
            type : [String],
            required : false
        },
        is_first_anc_visit : {
            type: Boolean,
            required: false
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        },
        author: {
            type: String,
            required: [true, "Please logout from the session and re-login to the application"],
            ref : 'resources'
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
        updated_on : {
            type : Date,
            required : false
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
        }]

    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'anc'
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


            mongoose.model('anc', schema);
            module.exports._model = mongoose.model('anc');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}