var db = require('../../db')
var _ = require('underscore')

var events = {
    isAlive: function(callback) {
        callback('alive')
    },

    isDatabaseAlive: function(callback) {
        db.Task.find({}, function(err, docs) {
            callback('alive')
        })
    }
}

function handleConnection(client) {
    _.each(events, function(v,k) {
        client.on('tests/' + k, events[k])
    })
}

exports.handleConnection = handleConnection