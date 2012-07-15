define(['jquery', 'collections/tasks', 'views/task/edit', 'views/task/new', 'socket', 'utils/utils'], function($, Tasks, TaskEdit, TaskNew, WS, Utils) {
    var TaskListView = Backbone.View.extend({
        initialize: function() {
            new TaskNew()
            Tasks.bind('add', this.addOne, this)
            Tasks.bind('reset', this.addAll, this)
            // TODO: fix
            Tasks.fetch({
                'skip_remote': true,
                'fetch_remote': true
            })

            //            c.l(Utils.fetchRemote)

            //                var socket = WS.connect('http://localhost:3000')
            //                socket.on('update_res', function(clientId, tasks) {
            //                    if(socket.socket.sessionid == clientId)
            //                        return;
            //
            //console.log(clientId, socket.socket.sessionid)
            //                    c.l('ok')
            //                    c.l(tasks)
            //                    Tasks.at(0).save({title: 'mom3'}, {skip_remote: true})
            //                    Tasks.get(tasks.id).save(tasks, {skip_remote: true})
            //
            //                    Tasks.add(tasks)
            //                    if(!_.isArray(tasks)) {
            //                        if(Tasks.get(tasks.id).get('updatedAt') != tasks.updatedAt) {
            ////                            Tasks.at(0).save({title: '++', silent: true})
            ////                            Tasks.get(tasks.id).save(tasks)
            //                            c.l('ok')
            //                        }
            //                    }
            //                })
            //                socket.emit('update', 'Task', function(clientId, tasks) {
            ////                    console.log(clientId, socket.socket.sessionid)
            ////                    c.l(tasks)
            //                    //    c.l(Tasks)
            //                    Tasks.add(tasks)
            //                });
            //                    Tasks.at(0).save({title: 'nn'})
        },

        addAll: function() {
            Tasks.each(this.addOne)
        },

        addOne: function(model) {
            var view = new TaskEdit(model)
            $('#results').prepend(view.render().el)
        }
    })

    return TaskListView
})
