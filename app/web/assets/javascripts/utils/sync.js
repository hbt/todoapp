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

                handleRemoteUpdate: function(clientId, modelName, attrs, doc) {
                    if (clientId === Sync.socket.socket.sessionid && attrs.roomUpdate) return;
                    var model = collections[modelName]._byId[doc.id]
                    model.save(doc, _.extend(attrs, {
                        skip_remote: true
                    }))
                    model.trigger('remote_update')
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
                    break;
                case "create":
                case "update":
                    RemoteSync.save.apply(this, arguments)
                    break;
                case "delete":
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

////define(['jquery', 'backbone', 'socket', 'collections/tasks'], function($, Backbone, WS, Tasks) {
//    var Socket = function() {
//            var socket = WS.connect('http://localhost:3000')
//
//            function initialize() {
//                    socket.on('update_one', function(clientId, task) {
//                        if (socket.socket.sessionid == clientId) return;
//
//                        Tasks._byId[task.id].save(task, {
//                            skip_remote: true
//                        })
//                        Tasks._byId[task.id].trigger('render')
//                    })
//                }
//
//                /**
//                 sync data with backend when a save is triggered
//                */
//
//            function syncRemote(method, model, options, error) {
//                // TODO: review reconnect vs WS.connect
//                socket = WS.connect('http://localhost:3000')
//                var modelName = model.model
//                socket.emit('save', modelName, JSON.stringify(model.toJSON()), function(doc) {
//                    console.log('saved', doc)
//                })
//            }
//
//            /**
//             * fetch data from backend when loading the page
//             */
//
//            function fetchRemote(method, model, options, error) {
//                var socket = WS.connect('http://localhost:3000')
//                socket.emit('update', model.modelName, function(clientId, tasks) {
//                    _.each(tasks, function(task) {
//                        Tasks.create(task, {
//                            skip_remote: true
//                        })
//                    })
//                });
//            }
//
//            return {
//                init: initialize,
//                fetchRemote: fetchRemote,
//                syncRemote: syncRemote
//            }
//        }()
//
//        var Sync = function() {
//            var localSync = Backbone.sync
//
//            /**
//             * store in local storage
//             */
//
//            function syncLocal(method, model, options, error) {
//                localSync.apply(this, [method, model, options, error])
//                // TODO: add dirty list
//            }
//
//
//            /*
//             * dirty list of ids to be cleared by syncRemote
//             */
//
//            function addModelToDirtyList(model) {
//                var dirtyList = localStorage.getItem('dirty-tasks')
//                var dirtyIds = (dirtyList && dirtyList.split(",")) || []
//
//                dirtyIds.push(model.get("id"))
//                dirtyIds = _.uniq(dirtyIds)
//
//                localStorage.setItem('dirty-tasks', dirtyIds.join(","))
//            }
//
//            // override default backbone sync to use local storage + remote sync
//
//            function overrideBackboneSync() {
//                Backbone.sync = function(method, model, options, error) {
//                    syncLocal(method, model, options, error)
//
//                    // skip remote to avoid resaving data we already fetched
//                    // TODO add support for arrays
//                    if (!options.skip_remote) Socket.syncRemote(method, model, options, error)
//
//                    // special trigger to fetch remote
//                    // TODO get rid of this option
//                    if (options.fetch_remote) Socket.fetchRemote(method, model, options, error)
//                }
//            }
//
//            function initialize() {
//                overrideBackboneSync()
//                Socket.init()
//            }
//
//            return {
//                init: initialize
//            }
//        }()
//
//        return Sync
//})
