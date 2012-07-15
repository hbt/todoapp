define(['mixins', 'store'], function(Mixins, Store) {
    var Task = Backbone.Model.extend({
        model: "Task",
        localStorage: new Store("tasks"),
        defaults: {
            title: ""
        }
    });

    _.extend(Task.prototype, Mixins.Models.CreatedUpdatedAt)

    return Task
})
