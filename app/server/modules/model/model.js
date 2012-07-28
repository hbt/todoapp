var db = require('../../db')
var _ = require('underscore')

var events = {
    read: function(modelName, opts, callback) {
        db[modelName].find({
            userId: this.userId
        }, function(err, docs) {
            if (err) throw err

            callback(modelName, opts, docs)
        })
    },

    save: function(modelName, model, opts, callback) {
        var client = this

        db[modelName].findOne({
            id: model.id
        }, function(err, doc) {
            if (err) throw err
            if (doc && doc.updatedAt > model.updatedAt) return;

            if (!doc) {
                doc = new db[modelName]()
                doc.userId = client.userId
            }

            doc = _.extend(doc, model)

            doc.save(function() {
                if (!opts.skip_callback) callback(client.id, modelName, opts, doc)
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
