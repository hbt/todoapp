var db = require('../../db')
var _ = require('underscore')

var events = {
    save: function(modelName, model, callback) {
        var client = this

        db[modelName].findOne({
            id: model.id
        }, function(err, doc) {
            if (err) throw err

            if (!doc) {
                doc = new db[modelName]()
                doc.userId = client.userId
            }

            doc = _.extend(doc, model)

            doc.save(function() {
                callback(doc)
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
