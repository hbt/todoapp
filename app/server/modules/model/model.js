var db = require('../../db')
var _ = require('underscore')

var events = {
    read: function(modelName, opts, callback) {
        db[modelName].find({
            userId: this.userId,
            deletedAt: null
        }, function(err, docs) {
            if (err) throw err

            callback(modelName, opts, docs)
        })
    },

    count: function(modelName, callback) {
        db[modelName].count({
            userId: this.userId,
            deletedAt: null
        }, function(err, count) {
            callback(count)
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

                function resumeCallbacks() {
                    if (!opts.skip_callback) callback(client.id, modelName, opts, doc)
                    opts.roomUpdate = true
                    opts.silent = false
                    client.manager.sockets['in'](client.userId).emit('update_one', client.id, modelName, opts, doc)
                }

                // risk of duplicates when dealing with slow machines
                // (callback takes too long to reach and more than one object is created with same id but different _id)
                db[modelName].count({
                    id: model.id
                }, function(err, count) {
                    // do we have duplicates?
                    if (count > 1) {
                        // get all of them
                        db[modelName].find({
                            id: model.id
                        }, function(err, dupDocs) {
                            // get most recent doc
                            var recentDoc = dupDocs.shift()

                            _.each(dupDocs, function(dupDoc) {
                                if (dupDoc.updatedAt > recentDoc.updatedAt) {
                                    recentDoc = dupDoc
                                } else {
                                    // delete if not recent
                                    dupDoc.remove()
                                }
                            })

                            doc._id = recentDoc._id
                            events.save(modelName, model, opts, callback)
                            doc.save(resumeCallbacks)
                        })
                    } else {
                        resumeCallbacks()
                    }
                })
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
