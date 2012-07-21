define(['mixins', 'store'], function(Mixins, Store) {
    var Task = Backbone.Model.extend({
        modelName: "Task",
        localStorage: new Store("tasks"),

        validate: function(attrs, opts) {
            if (!attrs.title || (attrs.title && attrs.title.trim().length === 0)) {
                return "Empty title not allowed"
            }

            return false;
        }

    });

    _.extend(Task.prototype, Mixins.Models.CreatedUpdatedAt)

    return Task
})
