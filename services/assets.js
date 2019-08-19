var model = require('../models/assets');
var asset_type_model = require('../models/asset_types');
var model_trash = require('../models/trash/assets');
var asset_type_model_trash = require('../models/trash/asset_types');
var Q = require('q');
var async = require('async');

var config = require("../configurations/filters/assets");



/**
* @api {post}  /asset/new
* @apiExample /asset/new

* @apiDescription
*  To create new asset

* @apiServiceDefinition {addAsset}
*  Send the req.body data into mongoose model.
*  Mongoose {save} function will be stored into database and return promise

*/

exports.addAsset = function(req) {

    var assets = model.model(true);
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId;

    assets._id = new ObjectId();
    assets.code = req.body.code;
    assets.description = req.body.description;
    assets.amount = req.body.amount;
    assets.quantity = req.body.quantity;
    assets.date_of_purchase = req.body.date_of_purchase;
    assets.asset_type = req.body.asset_type;
    assets.remarks = req.body.remarks;
    assets.center_id = req.body.center_id;
    assets.application_id = req.body.application_id;
    assets.isActive = req.body.isActive;
    assets.author = req.body.author;
    assets.author_type = req.body.author_type;
    assets.created = new Date();

    assets.save(function(error, userData) {
        if (error) {

            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else {

            deferred.resolve({
                status: "success",
                message: "You have  added Asset successfully"
            });
        }
    });


    return deferred.promise;
}


/**
* @api {get}  /assets
* @apiExample /assets?page=2&limit=5

* @apiDescription
*  To get list of Assets

* @apiServiceDefinition {findAllAssets}
*  Get list of assets based on filter {isActive}
*  Mongoose paginate will return the list of assets according to page and limit.
*/

exports.findAllAssets = function(fields, filter, pagination) {
    var assets = model.model(false);
    var asset_types = asset_type_model.model(false);
    var deferred = Q.defer();
    /* pagination.sortBy = {
         _id: -1
     };*/

    // filter.isActive = filter.isActive || true;
    if (filter.isActive) {
        filter.isActive = (filter.isActive.toLowerCase() === 'false' || filter.isActive === 0 || filter.isActive.toLowerCase() === 'no') ? false : true;
    }

    assets.paginate(filter, {
            columns: config.select_assets_list[0],
            page: pagination.page,
            limit: parseInt(pagination.limit),
            sort: pagination.sortBy
        },
        function(err, list) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } else {

                deferred.resolve({
                    status: "success",
                    message: list.docs,
                    total_pages: list.pages,
                    total_items: list.total
                })
            }
        }
    );
    return deferred.promise;
}


/**
* @api {get}  /asset/:assetID    {assetID - is mongodb's object id} 
* @apiExample /asset/bj6jhnfert673wjncb65t3

* @apiDescription
*  To get particular asset based on asset ID.

* @apiServiceDefinition {findAssetsByID}
*  To get particular asset based on asset ID.
*/

exports.findAssetsByID = function(req) {
    var assets = model.model(false);
    var asset_types = asset_type_model.model(false);
    var deferred = Q.defer();
    var assetID = req.params.assetID;
    assets.find({
        _id: assetID
    }, function(err, data) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else {
            deferred.resolve({
                status: "success",
                message: data
            });
        }

    })

    return deferred.promise;

}


/**
* @api {put}  /asset/:assetID    {assetID - is mongodb's object id} 
* @apiExample /asset/bj6jhnfert673wjncb65t3

* @apiDescription
*  To update particular asset based on asset ID.

* @apiServiceDefinition {updateAssetByID}
*  To update particular asset based on asset ID.
*  When update any record, it need status_log.
*  The status_log contains update_message, author, author_type and created date and time.

*@apiTrashDefinition {saveAssetTrash}
*   Once any record getting update, the old data will be save in trash collection. for future reference.
*/
exports.updateAssetByID = function(data) {
    var assets = model.model(false);
    var deferred = Q.defer();

    var tofind = data._id;
    var status_log = {
        message: data.log.changed_message,
        author: data.log.author,
        author_type: data.log.author_type,
        created: new Date()
    };
    if (data.status_log && data.status_log.length > 0) {
        data.status_log.push(status_log);
    } else {
        data.status_log = [];
        data.status_log.push(status_log);
    }
    delete(data._id);
    saveAssetTrash(tofind).then(function(info) {
        assets.findOneAndUpdate({
            _id: tofind
        }, data, function(err, updatedata) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } else {

                deferred.reject({
                    status: 'success',
                    message: updatedata
                });
            }
        })
    })
    return deferred.promise;

}

/**
* @api {put}  /delete-assets/:assetID    {assetID - is mongodb's object id} 
* @apiExample /delete-assets/bj6jhnfert673wjncb65t3

* @apiDescription
*  To delete particular asset based on asset ID.

* @apiServiceDefinition {deleteAsset}
*  To delete particular asset based on asset ID.
*  {findOneAndRemove} is mongoose function to remove particular document from collection.
*  When delete any record, it need status_log, reason for delete
*  The status_log contains delete_reason, author, author_type and created date and time.

*@apiTrashDefinition {saveAssetTrash}
*   Once any record getting delete, the deleted data will be save in trash collection. for future reference.
*/
exports.deleteAsset = function(req) {
    var data = req.body;
    var assets_trash = model_trash.model(true);
    var assets = model.model(false);
    var deferred = Q.defer();


    var ObjectId = require('mongoose').Types.ObjectId;

    assets_trash._id = req.body._id;
    assets_trash.code = req.body.code;
    assets_trash.description = req.body.description;
    assets_trash.quantity = req.body.quantity;
    assets_trash.asset_type = req.body.asset_type;
    assets_trash.remarks = req.body.remarks;
    assets_trash.center_id = req.body.center_id;
    assets_trash.application_id = req.body.application_id;
    assets_trash.isActive = req.body.isActive;
    assets_trash.author = req.body.author;
    assets_trash.author_type = req.body.author_type;
    assets_trash.status_log = req.body.status_log;

    assets_trash.isDeleted = true;
    assets_trash.reason_for_delete = req.body.reason_for_delete;
    assets_trash.deleted_by = req.body.deleted_by;
    assets_trash.deleted_time = new Date();
    assets_trash.deleted_by_role = req.body.deleted_by_role;
    var status_log = {
        message: 'Deleted by ' + req.body.deleted_person_name,
        author: req.body.deleted_by,
        author_type: req.body.deleted_by_role,
        created: new Date()
    };
    if (req.body.status_log && req.body.status_log.length > 0) {
        req.body.status_log.push(status_log);
    } else {
        req.body.status_log = [];
        req.body.status_log.push(status_log);
    }



    var tofind = req.body._id;
    delete(req.body._id);
    data.isDeleted = true;
    data.reason_for_delete = req.body.reason_for_delete;
    data.deleted_by = req.body.deleted_by;
    data.deleted_time = new Date();
    data.deleted_by_role = req.body.deleted_by_role;
    var status_log = {
        message: 'Deleted by ' + req.body.deleted_person_name,
        author: req.body.deleted_by,
        author_type: req.body.deleted_by_role,
        created: new Date()
    };
    if (data.status_log && data.status_log.length > 0) {
        data.status_log.push(status_log);
    } else {
        data.status_log = [];
        data.status_log.push(status_log);
    }



    var trashData = req.body;
    assets.findOneAndRemove({
        _id: tofind
    }, function(err, updatedata) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else {
            saveAssetTrash(trashData).then(function(data) {
                deferred.resolve({
                    status: "success",
                    message: "Asset deleted successfully"
                });
            }).fail(function(err) {
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            });

        }
    })
    return deferred.promise;

}



/**
* @api {post}  /asset-types
* @apiExample /asset-types

* @apiDescription
*  To create new asset type

* @apiServiceDefinition {saveAssetType}
*  Send the req.body data into mongoose model.
*  Mongoose {save} function will be stored into database and return promise

*/
exports.saveAssetType = function(req) {

    var assets = asset_type_model.model(true);
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId;

    assets._id = new ObjectId();
    assets.name = req.body.name;
    assets.description = req.body.description;

    // assets.center_id = req.body.center_id;
    assets.isActive = req.body.isActive;
    assets.author = req.body.author;
    assets.author_type = req.body.author_type;
    assets.created = new Date();

    assets.save(function(error, data) {
        if (error) {

            var errorMessage = require('./error_logs').getModelErrors(error);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else {

            deferred.resolve({
                status: "success",
                message: "You have  added Asset successfully"
            });
        }
    });


    return deferred.promise;
}


/**
* @api {get}  /asset-types
* @apiExample /asset-types?page=2&limit=5

* @apiDescription
*  To get list of Asset types

* @apiServiceDefinition {findAllAssetTypes}
*  Get list of asset types based on filter {isActive}
*  Mongoose paginate will return the list of asset types according to page and limit.
*/
exports.findAllAssetTypes = function(fields, filter, pagination) {
    var assets = asset_type_model.model(false);
    var deferred = Q.defer();


    // filter.isActive = filter.isActive || true;
    if (filter.isActive) {
        filter.isActive = (filter.isActive.toLowerCase() === 'false' || filter.isActive === 0 || filter.isActive.toLowerCase() === 'no') ? false : true;
    }

    delete(filter.application_id)
    assets.paginate(filter,
        pagination,
        function(err, list) {
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } else {

                deferred.resolve({
                    status: "success",
                    message: list.docs,
                    total_pages: list.pages,
                    total_items: list.total
                })
            }
        }
    );
    return deferred.promise;
}

/**
* @api {get}  //asset-type/:typeID    {typeID - is mongodb's object id} 
* @apiExample /asset-type/bj6jhnfert673wjncb65t3

* @apiDescription
*  To get particular asset type based on ID.

* @apiServiceDefinition {findAssetTypeByID}
*  To get particular asset type based on ID.
*/
exports.findAssetTypeByID = function(req) {
    var assets = asset_type_model.model(false);
    var deferred = Q.defer();
    var assetID = req.params.typeID;
    assets.find({
        _id: assetID
    }, function(err, data) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else {
            deferred.resolve({
                status: "success",
                message: data
            });
        }

    })

    return deferred.promise;

}

/**
* @api {put}  /asset-type/:typeID    {typeID - is mongodb's object id} 
* @apiExample /asset-type/bj6jhnfert673wjncb65t3

* @apiDescription
*  To update particular asset type based on ID.

* @apiServiceDefinition {updateAssetType}
*  To update particular asset type based on ID.
*  When update any record, it need status_log.
*  The status_log contains update_message, author, author_type and created date and time.

*@apiTrashDefinition {saveAssetTypeTrash}
*   Once any record getting update, the old data will be save in trash collection. for future reference.
*/
exports.updateAssetType = function(data) {
    var assets = asset_type_model.model(false);
    var deferred = Q.defer();

    var tofind = data._id;
    var status_log = {
        message: data.log.changed_message,
        author: data.log.author,
        author_type: data.log.author_type,
        created: new Date()
    };
    if (data.status_log && data.status_log.length > 0) {
        data.status_log.push(status_log);
    } else {
        data.status_log = [];
        data.status_log.push(status_log);
    }

    var trashData = data;
    console.log(data)
    delete(data._id);
    saveAssetTypeTrash(tofind).then(function(info) {
        console.log("info ", info)
        assets.findOneAndUpdate({
            _id: tofind
        }, data, function(err, updatedata) {
            console.log("updated data ", updatedata)
            if (err) {
                var errorMessage = require('./error_logs').getModelErrors(err);
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            } else {

                deferred.resolve({
                    status: 'success',
                    message: updatedata
                });


                //return deferred.promise;

            }
        })
    })
    return deferred.promise;

}

/**
* @api {put}  /delete-asset-type/:typeID    {typeID - is mongodb's object id} 
* @apiExample /delete-asset-type/bj6jhnfert673wjncb65t3

* @apiDescription
*  To delete particular asset type based on ID.

* @apiServiceDefinition {deleteAssetType}
*  To delete particular asset type based on ID.
*  {findOneAndRemove} is mongoose function to remove particular document from collection.
*  When delete any record, it need status_log, reason for delete
*  The status_log contains delete_reason, author, author_type and created date and time.

*@apiTrashDefinition {saveAssetTypeTrash}
*   Once any record getting delete, the deleted data will be save in trash collection. for future reference.
*/
exports.deleteAssetType = function(req) {

    var assets = asset_type_model.model(false);
    var assets_trash = asset_type_model_trash.model(true);
    var deferred = Q.defer();

    var ObjectId = require('mongoose').Types.ObjectId;

    assets_trash._id = req.body._id;
    assets_trash.name = req.body.name;
    assets_trash.description = req.body.description;


    assets_trash.isActive = req.body.isActive;
    assets_trash.author = req.body.author;
    assets_trash.author_type = req.body.author_type;
    assets_trash.status_log = req.body.status_log;

    assets_trash.isDeleted = true;
    assets_trash.reason_for_delete = req.body.reason_for_delete;
    assets_trash.deleted_by = req.body.deleted_by;
    assets_trash.deleted_time = new Date();
    assets_trash.deleted_by_role = req.body.deleted_by_role;


    var tofind = req.body._id;

    delete(req.body._id);


    var status_log = {
        message: 'Deleted by ' + req.body.deleted_person_name,
        author: req.body.deleted_by,
        author_type: req.body.deleted_by_role,
        created: new Date()
    };

    assets_trash.status_log = status_log;
    var trashData = req.body;
    trashData.status_log = req.body.status_log;
    assets.findOneAndRemove({
        _id: tofind
    }, function(err, updatedata) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else {

            saveAssetTypeTrash(trashData).then(function(data) {
                deferred.resolve({
                    status: "success",
                    message: "You have  deleted Asset type successfully"
                });
            }).fail(function(err) {
                deferred.reject({
                    status: 'error',
                    message: errorMessage
                });
            });
        }
    })
    return deferred.promise;

}

exports.checkAssetTypeUniqueFields = function(data) {
    var assets = asset_type_model.model(false);
    var deferred = Q.defer();

    assets.find({
        /* name: {
             $regex: data.name,
             $options: 'i'
         }*/
        name: data.name
    }, function(err, assetData) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else if (assetData.length > 1) {
            deferred.reject({
                status: 'error',
                message: 'Name - "' + data.name + '" is already exists'
            });
        } else {
            deferred.resolve({
                status: 'success',
                message: 'NOT_DUPLICATE'
            });
        }
    })
    return deferred.promise;
}
exports.checkAssetUniqueFields = function(data) {
    var assets = model.model(false);
    var deferred = Q.defer();

    assets.find({
        code: data.code
    }, function(err, assetData) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else if (assetData.length > 1) {
            deferred.reject({
                status: 'error',
                message: 'Code - "' + data.code + '" is already exists'
            });
        } else {
            deferred.resolve({
                status: 'success',
                message: 'NOT_DUPLICATE'
            });
        }
    })
    return deferred.promise;
}

// Trash for Assets

function saveAssetTrash(id) {
    var data = model.model(false);
    var assets = model_trash.model(true);
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId;
    data.find({
        _id: id
    }, function(err, list) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else if (list.length > 0) {
            var req = list[0];
            assets._id = new ObjectId();
            assets.code = req.code;
            assets.asset_trash_id = id;

            assets.description = req.description;
            assets.amount = req.amount;
            assets.quantity = req.quantity;
            assets.date_of_purchase = req.date_of_purchase;
            assets.asset_type = req.asset_type;
            assets.remarks = req.remarks;
            assets.center_id = req.center_id;
            assets.isActive = req.isActive;
            assets.author = req.author;
            assets.author_type = req.author_type;
            assets.created = new Date();
            assets.status_log = req.status_log;

            assets.save(function(error, userData) {
                if (error) {

                    var errorMessage = require('./error_logs').getModelErrors(error);
                    deferred.reject({
                        status: 'error',
                        message: errorMessage
                    });
                } else {

                    deferred.resolve({
                        status: "success",
                        message: "You have  added Asset to Trash successfully"
                    });
                }
            });
        }
    });

    return deferred.promise;

}

//trash for asset type

function saveAssetTypeTrash(id) {
    var data = asset_type_model.model(false);
    var assets_trash = asset_type_model_trash.model(true);
    var deferred = Q.defer();
    var ObjectId = require('mongoose').Types.ObjectId;
    data.find({
        _id: id
    }, function(err, list) {
        if (err) {
            var errorMessage = require('./error_logs').getModelErrors(err);
            deferred.reject({
                status: 'error',
                message: errorMessage
            });
        } else if (list.length > 0) {
            var req = list[0];
            assets_trash._id = new ObjectId();
            assets_trash.name = req.name;
            assets_trash.description = req.description;
            assets_trash.asset_types_trash_id = id;

            // assets.center_id = req.body.center_id;
            assets_trash.isActive = req.isActive;
            assets_trash.author = req.author;
            assets_trash.author_type = req.author_type;
            assets_trash.created = new Date();
            assets_trash.status_log = req.status_log;
            assets_trash.save(function(error, data) {
                if (error) {

                    var errorMessage = require('./error_logs').getModelErrors(error);
                    deferred.reject({
                        status: 'error',
                        message: errorMessage
                    });
                } else {

                    deferred.resolve({
                        status: "success",
                        message: "You have  added Asset type into Trash successfully"
                    });
                }
            });
        }
    });

    return deferred.promise;


}