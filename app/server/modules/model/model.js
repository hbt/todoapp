var db = require('../../db')
var _ = require('underscore')

var events = {
    save: function(modelName, model, opts, callback) {
        var client = this

        db[modelName].findOne({
            id: model.id
        }, function(err, doc) {
            if (err) throw err

            if (doc && doc.updatedAt > model.updatedAt) {
                return;
            } else {
                doc = new db[modelName]()
                doc.userId = client.userId
            }

            doc = _.extend(doc, model)

            doc.save(function() {
                callback(client.id, modelName, opts, doc)
                opts.roomUpdate = true
                opts.silent = false
                client.manager.sockets['in'](client.userId).emit('update_one', client.id, modelName, opts, doc)
            })
        })
    }
}

function handleConnection(client) {
    _.each(events, function(v, k) {
        client.on('model/' + k, events[k])
    })
}

exports.handleConnection = handleConnection
