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
        },

        addAll: function() {
            Tasks.each(this.addOne)
        },

        addOne: function(model) {
            var view = new TaskEdit(model)
            $('#tasks').prepend(view.render().el)
        }
    })

    return TaskListView
})
