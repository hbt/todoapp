define(['socket', 'backbone', 'collections/tasks', 'collections/tags', 'store'], function(WS, Backbone, Tasks, Tags) {

    var Sync = function() {
            var backboneLocalStorageSync = Backbone.localSync

            /**
             * returns socket
             * */

            function connect() {
                // TODO(hbt) initialize socket events. in case of a disconnect, it should set all the "on" events again on the new socket (check initialize)
                // Note(hbt): setting the "on" events more than one time will trigger duplicated actions
                Sync.socket = WS.connect(AppConfig.server, {
                    'try multiple transports': false
                })

                // if we trigger a disconnect, reconnect
                if(!Sync.socket.socket.open && !Sync.socket.socket.connected && !Sync.socket.socket.connecting && !Sync.socket.socket.reconnecting) {
                    Sync.socket.socket.reconnect()
                }
                
                return Sync.socket
            }

            /**
             * disconnects current socket
             * */

            function disconnect() {
                return Sync.connect().disconnect()
            }

            var RemoteSync = {

                handleRemoteFetch: function(modelName, attrs, docs) {
                    attrs.skip_remote = true
                    if (attrs.force_reset) attrs.silent = false


                    Sync.callbacksCount--;
                    Sync.callbacksCount += docs.length
                    _.each(docs, function(doc) {
                        RemoteSync.handleRemoteUpdate(Sync.connect().socket.sessionid, modelName, attrs, doc)
                    })
                },

                fetch: function(method, model, options, error) {
                    c.l('read remote', model)
                    if (!options.skip_callback) Sync.callbacksCount++;
                    Sync.connect().emit('model/read', model.modelName, options, RemoteSync.handleRemoteFetch)
                },

                handleRemoteUpdate: function(clientId, modelName, attrs, doc) {
                    if (clientId === Sync.connect().socket.sessionid && attrs.roomUpdate) return;
                    attrs.skip_remote = true
                    Sync.callbacksCount--;
                    var collection = AppConfig.collections[modelName]
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
                    c.l('comeback', doc.title, doc, attrs.roomUpdate, doc.updatedAt, model && model.get('updatedAt'), attrs)
                    if (model) {
                        if (doc.updatedAt >= model.get('updatedAt')) {
                            model.save(doc, attrs)
                        }
                    } else if (!doc.deletedAt) {
                        model = collection.create(doc, _.extend(attrs, {
                            at: 0
                        }))
                    }
                },

                save: function(method, model, options, error) {
                    c.l('save remote', model.toJSON())
                    if (!options.skip_callback) Sync.callbacksCount++;
                    Sync.connect().emit('model/save', method, model.modelName, model.toJSON(), options, RemoteSync.handleRemoteUpdate);
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

            function fetchCollections() {
                _.each(AppConfig.collections, function(collection) {
                    collection.fetch()
                })
            }

            /**
             * initialize backbone localstorage + remote syncing
             */

            function initialize() {
                // create socket
                Sync.connect()

                Sync.connect().on('update_one', RemoteSync.handleRemoteUpdate)

                // overwrite backbone sync
                Backbone.sync = syncLocalAndRemote
            }

            return {
                init: initialize,
                connect: connect,
                disconnect: disconnect,
                fetchCollections: fetchCollections
            }
        }()
        Sync.callbacksCount = 0

    return Sync
})
