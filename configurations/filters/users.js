module.exports = {
    select_patient_list: [
        '_id uhid first_name last_name email gender age birthDate phone  present_address image center_id client_id created'
    ],
    select_patient_vitals_list : [
        '_id uhid  first_name email  gender age birthDate phone  present_address image center_id auto_vitals_id created'
    ],
    patient_details: [
        '_id uhid  first_name email  gender age birthDate phone bloodgroup relationship marital_status mother_name present_address permanent_address address_proof_type address_proof_number center_id client_id medmantra_instant_UHID consent_form is_consent_JH'
    ],


    minimum_generic: {
        _id: 1,
        name: 1,
        image: 1,
        gender: 1,
        birthDate: 1,
        usertype: 1,
        userFrom: 1,
        premium: 1,
        username: 1,
        userlogin: 1
    },
    minimum_doctors: {
        speciality: 1,
        languagesKnown: 1,
        city: 1,
        zipcode: 1,
        state: 1,
        qualification: 1,
        display: 1,
        doctor_status: 1,
        isRemoteDoctor: 1
    },

    expand_patient: {
        city: 1,
        zipcode: 1,
        state: 1,
        address: 1,
        phone: 1,
        email: 1,
        languagesKnown: 1,
        source: 1

    },
    expand_doctor: {
        username: 1,
        speciality: 1,
        languagesKnown: 1,
        mcinum: 1,
        rating: 1,
        views: 1,
        image: 1,
        phone: 1,
        qualification: 1,
        aboutMe: 1,
        city: 1,
        zipcode: 1,
        state: 1

    },

    doctor_search_filter: [
        'application_id',
        'speciality',
        'state',
        'ZipCode',
        'username',
        'premium',
        'rating',
        'email',
        'phone',
        'mother_name',
        'languagesKnown', {
            'city': {
                field: "city",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        },

        {
            'name': {
                field: "first_name",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        }
        /*, // Added to demonstrate
                {
                    'phone_greater': {
                        field: "phone",
                        value: {},
                        dynamic: "$gt"
                    }
                }*/
    ],

    user_search_filter: [

        'application_id',
        'state',
        'ZipCode',
        'username',
        'email',
        'city',
        'phone',
        'alternative_phone',
        'center_id',
        'mother_name',
        /*'name',
        irst_name',
        'last_name',*/
        {
            'uhid': {
                field: "uhid",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        }

        , {
            'name': {
                field: "first_name",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        }
        /*, // Added to demonstrate
                 {
                 'phone_greater': {
                 field: "phone",
                 value: {},
                 dynamic: "$gt"
                 }
                 }*/
    ],
    paramedic_search_filter: [

        'application_id',
        'state',
        'ZipCode',
        'username',
        'email',
        'city',
        'phone',
        'mother_name',

        'center_id',

        {
            'name': {
                field: "first_name",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        }

    ]
}