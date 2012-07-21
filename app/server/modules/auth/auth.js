var db = require('../../db')
var _ = require('underscore')

var events = {

    /**
     * logs user ID in
     * - authentication or anonymous account creation
     * - assigns userId to current socket
     */
    login: function(userId, callback) {
        this.userId = userId

        db.User.findOne({
            id: userId
        }, function(err, doc) {
            if (err) throw err
            if (!doc) {
                doc = new db.User()
                doc.id = userId
                doc.createdAt = +new Date()
            }

            doc.updatedAt = +new Date()
            doc.loggedAt.push(+new Date())
            doc.save(function() {
                callback(doc)
            })

        })
    },

    /**
     * logs user out and disconnects
     * removes user if remove = true (test mode)
     */
    logout: function(remove, callback) {
        db.User.findOne({
            id: this.userId
        }, function(err, doc) {
            if (err) throw err

            if (remove) {
                // TODO(hbt): remove tasks
                doc.remove()
                callback('removed')
            }
        })
    }
}

function handleConnection(client) {
    _.each(events, function(v, k) {
        client.on('auth/' + k, events[k])
    })
}

exports.handleConnection = handleConnection
