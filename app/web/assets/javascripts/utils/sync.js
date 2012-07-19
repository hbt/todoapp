define(['socket'], function(WS) {
    var Sync = function() {
            function connect() {
                return Sync.socket = WS.connect(AppConfig.server)
            }
            return {
                connect: connect,
                disconnect: function() {
                    Sync.socket.disconnect()
                }
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
