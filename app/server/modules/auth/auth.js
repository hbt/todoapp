var db = require('../../db')
var _ = require('underscore')

var events = {
    login: function(userId, callback) {
        db.User.findOne({id: userId}, function(err, doc){
            if(err)
                throw err
            if(!doc) {
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
    }
}

function handleConnection(client) {
    _.each(events, function(v,k) {
        client.on('auth/' + k, events[k])
    })
}

exports.handleConnection = handleConnection