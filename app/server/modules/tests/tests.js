var db = require('../../db')
var _ = require('underscore')

var events = {

    /**
     * checks if socket is alive
     */
    isAlive: function(callback) {
        callback('alive')
    },

    /**
     * checks if we can connect to the database
     */
    isDatabaseAlive: function(callback) {
        // TODO(hbt): Change query so it doesn't return too many results.
        db.Task.find({}, function(err, docs) {
            callback('alive')
        })
    }
}

function handleConnection(client) {
    _.each(events, function(v, k) {
        client.on('tests/' + k, events[k])
    })
}

exports.handleConnection = handleConnection
