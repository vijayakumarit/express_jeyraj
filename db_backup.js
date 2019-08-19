var exec = require('child_process').exec;
var moment = require('moment');

var dbOptions = {
    /*user: '<databaseUsername>',
    pass: '<databasePassword>',*/
    host: 'localhost',
    port: 27017,
    database: MONGO_DB_NAME,
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: '/var/backups/mongobackups/'

};

module.exports = {
    dbAutoBackUp: function() {
        var newBackupDir = new moment().format('DD-MM-YYYY');
        var newBackupPath = dbOptions.autoBackupPath + newBackupDir; // New backup path for current backup process

        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath;

        if (AUTOBACKUP_SERVICE) {
            exec(cmd, function(error, stdout, stderr) {
                if (error) {
                    console.log("=============== error start ================");
                    console.log(error);
                    console.log("=============== error end ================");
                }
            });
        }
    }
}