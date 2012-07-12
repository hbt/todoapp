define(['jquery', 'collections/tasks', 'views/task/edit', 'views/task/new'], function($, Tasks, TaskEdit, TaskNew)
{
    var TaskListView = Backbone.View.extend(
    {
        el: $('#results'),

        initialize: function()
        {
            new TaskNew()
            Tasks.bind('add', this.addOne, this)
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
