var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../configurations/connections/db.js');
var uniqueValidator = require('mongoose-unique-validator');


module.exports = {
    _schema: null,

    _schema_def: {
        _id: {
            type: String,
            required: true
        },
        application_id: {
            type: String,
            required: false,
            ref: 'master_applications'

        },
        consultation_trash_id: {
            type: String,
            required: true
        },
        patient_uhid: {
            type: String,
            required: [false, 'Patient details not found'],
            ref: 'users'
        },
        patient_id: {
            type: String,
            required: [true, 'Patient details not found'],
            ref: 'users'
        },
        center_uhid: { //Center_code from centers collection
            type: Number,
            required: false
        },
        case_sheet_order_number: { //This will have 4 digit code
            type: String,
            required: false
        },
        case_sheet_number: { //This will be combination of center_uhid + case_sheet_order_number
            type: Number,
            required: true


        },
        is_ANC: {
            type: Boolean,
            required: false,
            default: false

        },
        visit_type: { //VISIT_TYPE will be NEW, REVIEW, REPEAT, REMOTE
            type: String,
            required: true

        },

        current_symptoms: [{
            symptom: {
                type: String,
                required: true
            },
            symptom_duration: {
                type: Number,
                required: true
            },
            symptom_duration_type: {
                type: String,
                required: true
            },
            onset: {
                type: Boolean,
                required: true
            },
            severity: {
                type: String,
                required: true
            }
        }],
        /*        current_symptoms: {
                    type: [String],
                    required: [true, 'Please enter Current Symptoms']
                },
                symptom_duration: {
                    type: Number,
                    required: false
                },
                symptom_duration_type: {
                    type: String,
                    required: false
                },
                severity: {
                    type: String,
                    required: false

                },
                onset: {
                    //If False then Gradual and true then Sudden
                    type: Boolean,
                    required: false
                },
        */
        presenting_illness: {

            type: String,
            required: false

        },

        past_history: {
            medical_history: {
                type: String,
                required: false
            },
            surgical_history: {
                type: String,
                required: false
            },
            drug_history: {
                type: String,
                required: false
            },
            personal_history: {
                type: String,
                required: false
            },
            family_history: {
                type: String,
                required: false
            },
            recent_investigations: {
                type: String,
                required: false
            },
            visited_any_doctor: {
                type: Boolean,
                required: false
            },
            recent_doctor_prescription: {
                type: String,
                required: false
            },
            medicine_for_present_complaints: {
                type: String,
                required: false
            }
        },
        menstrual_history: {
            last_period: {
                type: Date,
                required: false
            },
            lmp_not_known: {
                type: Boolean,
                required: false,
                default: false
            },
            menstrual_cycles: {
                type: Number,
                required: false
            },
            complaints: {
                type: String,
                required: false
            },
            menarche: {
                type: Boolean,
                required: false
            },
            menarche_comments: {
                type: String,
                required: false
            },
            menopause: {
                type: Boolean,
                required: false
            },
            menopause_comments: {
                type: String,
                required: false
            },

            select_drop_quantity: {
                type: String,
                required: false
            },

            cycle_frequency: {
                type: Number,
                required: false
            },
            clots: {
                type: Boolean,
                required: false
            },
            dysmenorrhea: {
                type: Boolean,
                required: false
            },
            discharge: {
                type: Boolean,
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
            expected_delivery_date: {
                type: Date,
                required: false
            }
        },
        obstetric_history: {
            /*pregnancy: {
                type: String,
                required: false
            },
            gpl_score: {
                type: String,
                required: false
            },
            anc_visits: {
                type: String,
                required: false
            },
            medication_history: {
                type: String,
                required: false
            },
            tt1: {
                type: Boolean,
                required: false
            },
            tt2: {
                type: Boolean,
                required: false
            },
            complaints_during_pregnancy: {
                type: String,
                required: false
            },
            pregnancy_risk: {
                type: String,
                required: false
            },
            preious_pregnancy_type: {
                type: String,
                required: false
            },
            term_of_delivery: {
                type: String,
                required: false
            },
            delivery_type: {
                type: String,
                required: false
            },
            place_of_birth: {
                type: String,
                required: false
            },
            baby_birth_weight: {
                type: Number,
                required: false
            },
            birth_time: {
                type: Date,
                required: false
            },
            first_breast_feed: {
                type: Date,
                required: false
            },
            baby_cry_after_birth: {
                type: Date,
                required: false
            },

            complications_during_pregnancy: {
                type: String,
                required: false
            },
            term_during_event: {
                type: String,
                required: false
            },
            reason_for_occurence: {
                type: String,
                required: false
            }*/
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
        vitals: [{
            _id: String,
            height: {
                type: Number,
                required: [false, 'Please enter Height of Patient']
            },
            weight: {
                type: Number,
                required: [false, 'Please enter weight of Patient']
            },
            bmi: {
                type: Number,
                required: false
            },
            systolicBP: {
                type: Number,
                required: false
            },
            diastolicBP: {
                type: Number,
                required: false
            },
            pulse: {
                type: Number,
                required: false
            },
            spo2: {
                type: Number,
                required: false
            },
            respiratoryRate: {
                type: Number,
                required: false
            },
            temperature: {
                type: Number,
                required: false
            },
            created: {
                type: Date,
                required: true,
                default: Date.now
            },
            author: {
                type: String,
                required: true,
                ref: 'resources'
            },
            author_type: {
                type: String,
                required: true
            },
            author_name: {
                type: String,
                required: false
            }
        }],
        allergies: {
            food: Boolean,
            food_comments: String,
            medicine: Boolean,
            medicine_comments: String,
            air_borne: Boolean,
            air_borne_comments: String,
            latex: Boolean,
            latex_comments: String,
            seasonal_variations: Boolean,
            seasonal_variations_comments: String,
            nothing: Boolean

        },
        physical_examination: {
            PALLOR: {
                type: Boolean,
                required: false,
                default: false
            },
            ICTERUS: {
                type: Boolean,
                required: false,
                default: false
            },
            CYANOSIS: {
                type: Boolean,
                required: false,
                default: false
            },
            CLUBBING: {
                type: Boolean,
                required: false,
                default: false
            },
            KOILONYCHIA: {
                type: Boolean,
                required: false,
                default: false
            },
            EDEMA: {
                type: Boolean,
                required: false,
                default: false
            },
            EDEMA_NOTES: {
                type: String,
                required: false
            },
            LYMPHADENOPATHY: {
                type: Boolean,
                required: false,
                default: false
            },
            LYMPHADENOPATHY_TYPE: {

                type: [String],
                required: false

            }
        },
        other_examinations: {
            type: Boolean,
            required: false,
            defaut: false

        },
        other_examination_comments: {
            type: String,
            required: false

        },
        patient_documents: Array,
        status: { //status will be NEW, CLOSED
            type: String,
            required: [true, "Status is required"]
        },
        is_remote_consultation: {
            type: Boolean,
            required: false,
            default: false
        },
        is_parent_case_sheet: {
            type: Boolean,
            required: false,
            default: false
        },
        parent_case_sheet_number: {
            type: Number,
            required: false
        },
        created: {
            type: Date,
            required: true,
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
        center_id: {
            type: Number,
            required: [false, "Center Code is required"],
            ref: 'centers'
        },
        paramedic_id: {
            type: String,
            required: true,
            ref: 'resources'
        },

        doctor_uhid: {
            type: String,
            required: false, //because problem from paramedic side.
            ref: 'resources'
        },
        doctor_id: {
            type: String,
            required: false, //because problem from paramedic side.
            ref: 'resources'
        },
        doctor_advice: {
            type: String,
            required: false
        },
        desease_group: {
            type: String,
            required: false
        },
        provisional_diagnosis: {
            type: String,
            required: false
        },
        final_diagnosis: {
            type: String,
            required: false
        },

        who_desease: {
            type: Array, //It is having desease, group, who_name
            required: false
        },

        medications: [{
            _id: String,
            name: String,
            strength: String,
            dosage: String,
            frequency: String,
            startDate: Date,
            endDate: Date,
            duration: Number,
            when_to_take: String,
            notes: String

        }],
        diagnostic_tests: [{
            _id: String,
            test_name: String,
            group_name: String, //Test name related Group
            when_to_take: Date,
            is_emergency: {
                type: Boolean,
                required: false,
                default: false
            },
            doctor_adviced_on: {
                type: Date,
                required: false,
                default: Date.now
            },
            sample_id: Number
            //Here we have to give one more field to refer test details.
            // so whenever fetching record we need to fetch test details as well
            /*test_details: {
                type: String,
                ref: 'lims'
            }*/

        }],
        review_date: {
            type: Date,
            required: false
        },
        review_days: {
            type: Number,
            required: false
        },
        is_referred_to_speciality: {
            type: Boolean,
            required: false,
            default: false
        },
        speciality: {
            type: String,
            required: false
        },
        doctor_comments: { //this comes when doctor refer to specialist
            type: String,
            required: false
        },
        referred_to_speciality_on: {
            type: Date,
            required: false
        },
        scheduled_on: {
            type: Date,
            required: false
        },
        is_speciality_consultation_accepted: {
            type: Boolean,
            required: false,
            default: false
        },
        speciality_consultation_accepted_on: {
            type: Date,
            required: false
        },
        speciality_consultation_accepted_doctor: {
            type: String,
            required: false
        },
        is_referred_to_hospital: {
            type: Boolean,
            required: false,
            default: false
        },
        hospital_details: {
            name: String,
            contact_person: String,
            speciality: String,
            address: String,
            reason_for_refferal: String
        },
        is_closed: {
            type: Boolean,
            required: false,
            default: false

        },
        case_sheet_open_time: {
            type: Date,
            required: false
        },
        case_sheet_close_time: {
            type: Date,
            required: false
        },
        updated_on: {
            type: Date,
            required: false,
            default: Date.now

        },
        is_no_show: {
            type: Boolean,
            required: false,
            default: false
        },
        no_show_comments: { //No show by Patient, no show by doctor, if empty then system had updated as now show
            type: String,
            required: false
        },
        no_show_remarks: { //If any remarks
            type: String,
            required: false
        },
        status_log: [{
            _id: String,
            author: String,
            message: String,
            time: {
                type: Date,
                required: false,
                default: Date.now
            }

        }],
        video_details: {
            sessionId: String,
            token: String,
            apiKey: String
        },
        video_records: {
            type: Array,
            required: false
        }



    },

    schema: function() {
        if (!module.exports._schema) {
            module.exports._schema = new mongoose.Schema(module.exports._schema_def, {
                collection: 'consultations_trash'
            });
        }

        return module.exports._schema;
    },

    _model: null,

    model: function(new_instance) {
        if (!module.exports._model) {
            var schema = module.exports.schema();
            /*  var options = {
                  customCollectionName: "consultations_log"
              }*/
            schema.plugin(uniqueValidator, {
                message: ' {PATH} - " {VALUE} "  is already exists.'
            });

            schema.plugin(mongoosePaginate);
            // schema.plugin(mongooseHistory, options);

            mongoose.model('consultations_trash', schema);
            module.exports._model = mongoose.model('consultations_trash');
        }

        return new_instance ?
            new module.exports._model() :
            module.exports._model;
    }
}