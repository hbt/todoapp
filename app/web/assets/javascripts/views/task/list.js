define(['jquery', 'collections/tasks', 'views/task/edit'], function($, Tasks, TaskEdit){
    var TaskListView = Backbone.View.extend({
       el : $('#results'),

        initialize: function()
        {
            Tasks.bind('reset', this.addAll, this)
            Tasks.fetch()
        },

        addAll: function()
        {
            Tasks.each(this.addOne)
        },

        addOne: function(model)
        {
            var view = new TaskEdit(model)
            view.render()
        }
    })

    return TaskListView
})
