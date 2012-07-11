App.Views.TaskList = Backbone.View.extend({

    initialize: function()
    {
        App.Tasks.bind('reset', this.addAll, this)
        App.Tasks.fetch()
    },


    addAll: function()
    {
        App.Tasks.each(this.addOne)
    },

    addOne: function(model)
    {
        var view = new App.Views.TaskEdit(model)
        view.render()
    }
})