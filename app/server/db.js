var _ = require('underscore')

var mongoose = require('mongoose');
require('./common_utils')
var config = require('./config').getConfig()

exports.init = function() {
        initDb()
        initSchema()
    }

    /**
     * connects to database based on config.js
     */

function initDb() {
    // build string like mongodb://username:password@localhost/todos
    var str = ["mongodb://"]
    config.db.user && str.push([config.db.user, ":", config.db.pwd, "@", ])

    str.push([config.db.host, ":", config.db.port, "/", config.db.name])
    str = _.flatten(str).join('')

    // connect and throw error if it fails
    mongoose.connect(str, function(err) {
        if (err) throw err
    });
}

/**
 * define model (tables)
 */

function initSchema() {
    // TODO(hbt): updates required fields + indexes
    exports.Task = mongoose.model('Task', new mongoose.Schema({
        id: {
            type: String,
            index: true,
            required: true
        },
        title: String,
        done: Boolean,
        userId: {
            type: String,
            index: true,
            required: true
        },
        createdAt: Number,
        updatedAt: Number,
        deletedAt: Number
    }));

    exports.User = mongoose.model('User', new mongoose.Schema({
        id: {
            type: String,
            index: true,
            required: true
        },
        email: {
            type: String,
            index: true
        },
        googleData: String,
        createdAt: Number,
        updatedAt: Number,
        // logins array of timestamps
        loggedAt: Array
    }));
}
