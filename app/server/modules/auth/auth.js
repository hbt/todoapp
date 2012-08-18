var db = require('../../db')
var _ = require('underscore')

var config = require('../../config').getConfig()

var events = {

    /**
     * logs user ID in
     * - authentication or anonymous account creation
     * - assigns userId to current socket
     */
    login: function(userId, callback) {
        this.userId = userId
        var client = this

        db.User.findOne({
            id: userId
        }, function(err, doc) {
            if (err) throw err
            if (!doc) {
                doc = new db.User()
                doc.id = userId
                doc.createdAt = +new Date()
            }

            client.join(client.userId);

            doc.updatedAt = +new Date()
            doc.loggedAt.push(+new Date())
            doc.save(function() {
                callback(doc)
            })

        })
    },

    googleLogin: function(json, callback) {
        db.User.findOne({
            email: json.user.email
        }, function(err, doc) {
            if (err) throw err

            // create?
            if (!doc) {
                doc = new db.User()
                doc.id = uniqueID()
                doc.email = json.user.email
                doc.createdAt = +new Date()
            }

            doc.googleData = JSON.stringify(json)
            doc.updatedAt = +new Date()
            doc.loggedAt.push(+new Date())
            doc.save(function() {
                if (callback) callback(doc)
            })
        })
    },

    migrateData: function(fromId, toId, toCreatedAt, callback) {
        // find user to migrate from
        db.User.findOne({
            id: fromId
        }, function(err, fromDoc) {
            if (err) throw err

            if (!fromDoc) console.log('migration failed. No document with id ' + fromId)

            // find user to migrate to
            db.User.findOne({
                id: toId,
                createdAt: toCreatedAt
            }, function(err, toDoc) {
                if (err) throw err

                if (!toDoc) console.log('migration failed. No document with id ' + toId)

                var models = ['Task']

                // loop through the models and set the new user ID
                _.each(models, function(modelName, modelIndex) {
                    db[modelName].find({
                        userId: fromId
                    }, function(err, docs) {
                        if (err) throw err

                        // trigger callback if there is nothing to migrate
                        var isLastDocument = modelIndex === models.length - 1 && docs.length === 0
                        if (isLastDocument) callback()

                        _.each(docs, function(doc, docIndex) {
                            doc.userId = toId

                            // trigger callback on the last migrated item
                            isLastDocument = modelIndex === models.length - 1 && docIndex === docs.length - 1
                            if (isLastDocument) {
                                doc.save(callback)
                            } else {
                                doc.save()
                            }
                        })
                    })
                })
            })
        })
    }
}

function handleConnection(client) {
    _.each(events, function(v, k) {
        client.on('auth/' + k, events[k])
    })
}

exports.handleConnection = handleConnection

// config google  login
var cauth = require('connect-auth')
exports.expressConfig = cauth({
    strategies: [
    cauth.Google2({
        appId: config.google.id,
        appSecret: config.google.secret,
        callback: config.google.callback,
        requestEmailPermission: true
    })],
    trace: true
})

var url = require('url')
exports.expressMiddleware = function() {
        return function(req, res, next) {
            var urlp = url.parse(req.originalUrl, true)
            if (urlp.query.login_with) {
                req.authenticate([urlp.query.login_with], function(error, authenticated) {
                    if (error) {
                        // Something has gone awry, behave as you wish.
                        console.log(error);
                        res.render('error')
                    } else {
                        if (authenticated === undefined) {
                            // The authentication strategy requires some more browser interaction, suggest you do nothing here!
                        } else {
                            // We've either failed to authenticate, or succeeded (req.isAuthenticated() will confirm, as will the value of the received argument)
                            next();
                        }
                    }
                });
            } else {
                next();
            }
        }
    }

exports.handleLoginPage = function(req, res) {
    if (req.isAuthenticated()) {
        var json = req.getAuthDetails()
        events.googleLogin(json, function(doc) {
            var url = config.app.url + "#googleLogin/" + doc.id + "/" + doc.createdAt
            res.render('main', {
                auth: true,
                url: url
            })
        })
    } else {
        // render login page
        res.render('main')
    }
}
