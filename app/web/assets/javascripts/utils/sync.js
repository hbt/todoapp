define(['socket', 'backbone', 'collections/tasks', 'store'], function(WS, Backbone, Tasks) {

    // TODO(hbt): consider using namespace when defining collections for easy referencing
    var collections = {}
    _.each(arguments, function(v) {
        if (v.modelName) {
            collections[v.modelName] = v
        }
    })

    var Sync = function() {
            var backboneLocalStorageSync = Backbone.localSync

            /**
             * returns socket
             * */

            function connect() {
                // TODO(hbt) initialize socket events
                return Sync.socket = WS.connect(AppConfig.server)
            }

            /**
             * disconnects current socket
             * */

            function disconnect() {
                return Sync.socket.disconnect()
            }

            var RemoteSync = {

                handleRemoteFetch: function(modelName, attrs, docs) {
                    attrs.skip_remote = true
                    if (attrs.force_reset) attrs.silent = false

                    _.each(docs, function(doc) {
                        Sync.callbacksCount++;
                        RemoteSync.handleRemoteUpdate(Sync.socket.socket.sessionid, modelName, attrs, doc)
                    })
                },

                fetch: function(method, model, options, error) {
                    Sync.socket.emit('model/read', model.modelName, options, RemoteSync.handleRemoteFetch)

                },

                handleRemoteUpdate: function(clientId, modelName, attrs, doc) {
                    if (clientId === Sync.socket.socket.sessionid && attrs.roomUpdate) return;
                    attrs.skip_remote = true
                    Sync.callbacksCount--;
                    var collection = collections[modelName]
                    var model = collection._byId[doc.id]

                    // TODO(hbt): abstract into collections.findById
                    // soft deleted model are not in the collection but still are in local storage
                    if (!model) {
                        var json = collection.localStorage.find({
                            id: doc.id
                        })
                        model = json && new collection.model(json)

                        // add model to the collection if it is not deleted (case of multiple windows but same storage)
                        if (model && !collection.get(model.get('id')) && !model.get('deletedAt')) {
                            collection.add(model)
                        }
                    }

                    // do not save if remote model is older than what's currently in storage
                    c.l('comeback', doc.title, doc, doc.updatedAt, model && model.get('updatedAt'), attrs)
                    if (model) {
                        if (doc.updatedAt >= model.get('updatedAt')) {
                            c.l('saving from remote', doc)
                            model.save(doc, attrs)
                        }
                    } else if (!doc.deletedAt) {
                        c.l('creating from remote')
                        model = collection.create(doc, _.extend(attrs, {
                            at: 0
                        }))
                    }
                },

                save: function(method, model, options, error) {
                    c.l('save remote', model.toJSON())
                    if (!options.skip_callback) Sync.callbacksCount++;
                    Sync.connect().emit('model/save', model.modelName, model.toJSON(), options, RemoteSync.handleRemoteUpdate);
                }
            }

            /**
             * handle remote sync operations
             */

            function remoteSync(method, model, options, error) {
                switch (method) {
                case "read":
                    RemoteSync.fetch.apply(this, arguments)
                    break;
                case "create":
                case "update":
                case "delete":
                    RemoteSync.save.apply(this, arguments)
                    break;
                    break;
                }
            }

            function syncLocalAndRemote(method, model, options, error) {
                c.l(method + ' local', model.toJSON())
                // save locally
                if (!options.skip_local) backboneLocalStorageSync.apply(this, arguments)

                // save remotely
                if (!options.skip_remote) remoteSync.apply(this, arguments)
            }

            /**
             * initialize backbone localstorage + remote syncing
             */

            function initialize() {
                // create socket
                Sync.connect()

                Sync.socket.on('update_one', RemoteSync.handleRemoteUpdate)

                // overwrite backbone sync
                Backbone.sync = syncLocalAndRemote
            }

            return {
                init: initialize,
                connect: connect,
                disconnect: disconnect
            }
        }()
        Sync.callbacksCount = 0

    return Sync
})
