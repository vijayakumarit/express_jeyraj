module.exports = {

    select_assets_list: [
        '_id code description quantity asset_type isActive remarks '
    ],
    assets_details: [
        '_id code description quantity asset_type center_id date_of_purchase amount total_amount remarks isActive'

    ],

    select_assets_type_list: [
        '_id name description isActive'
    ],
    assets_type_details: [
        '_id name description isActive'

    ],
    minimum_generic: {
        _id: 1,
        code: 1,
        description: 1,
        quantity: 1,
        asset_type: 1,
        center_id: 1,
        remarks: 1,
        isActive: 1,
        author: 1,
        author_type: 1,
        created: 1,
        isDeleted: 1,
        reason_for_delete: 1,
        deleted_by: 1,
        deleted_time: 1,
        deleted_by_role: 1
    },
    minimum_asset_types: {
        _id: 1,
        name: 1,
        description: 1,
        isActive: 1,
        author: 1,
        author_type: 1,
        created: 1,
        isDeleted: 1,
        reason_for_delete: 1,
        deleted_by: 1,
        deleted_time: 1,
        deleted_by_role: 1
    },
    asset_search_filter: [

        'center_id',
        'application_id',

        'code',
        'author',
        'isActive',
        'isDeleted', {
            'asset_type': {
                field: "asset_type",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        }, {
            'name': {
                field: "name",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        }, {
            'description': {
                field: "description",
                value: {
                    $options: 'i'
                },
                dynamic: "$regex"
            }
        }

    ]
}