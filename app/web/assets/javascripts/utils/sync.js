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

                fetch: function(method, model, options, error) {
                    var ids = _.keys(model._byId)
                },

                handleRemoteUpdate: function(clientId, modelName, attrs, doc) {
                    if (clientId === Sync.socket.socket.sessionid && attrs.roomUpdate) return;
                    var model = collections[modelName]._byId[doc.id]

                    // do not save if remote model is older than what's currently in storage
                    if (model && doc.updatedAt >= model.get('updatedAt')) {
                        model.save(doc, _.extend(attrs, {
                            skip_remote: true
                        }))

                        model.trigger('remote_update')
                    } else if (!doc.deletedAt) {
                        Tasks.create(doc, _.extend(attrs, {
                            at: 0,
                            skip_remote: true
                        }))
                    }
                },

                save: function(method, model, options, error) {
                    c.l('save remote', model.toJSON())
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
                backboneLocalStorageSync.apply(this, arguments)

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

        return Sync
})
