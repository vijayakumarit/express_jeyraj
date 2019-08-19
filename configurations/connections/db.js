var mongoose = require('mongoose');
var tunnel = require('tunnel-ssh');
require('../dev');


/*
module.exports = {
    _db: null,
    init: function() {
        if (!module.exports._db) {
            var config = {
                username: '',
                host: '',
                password: '',
                port: 22,
                dstPort: 27017
            };
            var server = tunnel(config, function(error, server) {
                if (error) {
                    console.log("SSH connection error: " + error);
                }
                console.log("ssh")
                mongoose.connect('mongodb://username:password@'+MONGO_SERVER_NAME+'/' + MONGO_DB_NAME, { useNewUrlParser: true });

                var db = mongoose.connection;
                db.on('error', console.error.bind(console, 'DB connection error:'));
                db.once('open', function() {
                    console.log("DB is connected");
                });

            });
        }
        return module.exports._db;
    }

}
*/

// Scripts for Production
// make my script take it from the env variables
const options = {
    useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500 // Reconnect every 500ms
 // poolSize: 10, // Maintain up to 10 socket connections
};
const DB_URI =  'mongodb://' + MONGO_SERVER_NAME + '/' + MONGO_DB_NAME;

// Define some basic methods to
// connect/disconnect to the DB
    const db = {
        
          connect () {
            return mongoose.connect(DB_URI, options)
          },
        
          disconnect () {
            return mongoose.connection.close(() => {
              process.exit(0)
            })
          }
        }


// This let mongoose use the node's default promises
mongoose.Promise = global.Promise
// Logs for our app
mongoose.connection.on('connected', () => {
 console.log('Mongoose connection open to ' + DB_URI)
})

// More logs...
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

// Logs that I hope to not see
mongoose.connection.on('error', (err) => {
 console.error(err)
})

// Handle process terminations
// this ensures that there is any connection
// open with DB when I stop the app
process
  .on('SIGINT', db.disconnect)
  .on('SIGTERM', db.disconnect)

// finally I only expose the methods to being used by my app script
module.exports = db


