define(['jquery', 'collections/tasks', 'views/task/new', 'views/task/edit'], function($, Tasks, TaskNew, TaskEdit){
    return Backbone.View.extend({
        initialize: function()
        {
            new TaskNew()
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
})
