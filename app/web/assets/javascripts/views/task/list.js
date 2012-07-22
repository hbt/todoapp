define(['collections/tasks', 'views/task/edit'], function(Tasks, TaskEditView) {
    var TaskListView = Backbone.View.extend({
        initialize: function() {
            Tasks.bind('add', this.addOne, this)
            Tasks.bind('reset', this.addAll, this)
        },

        addAll: function() {
            Tasks.each(this.addOne)
        },

        addOne: function(model) {
            var view = new TaskEditView(model)
            $('.all-tasks').prepend(view.render().el)
        }
    })

    return TaskListView
})
