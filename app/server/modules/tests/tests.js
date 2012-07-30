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
        db.Task.count({}, function(err, docs) {
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
