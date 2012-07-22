define(['mixins', 'store'], function(Mixins, Store) {
    var Task = Backbone.Model.extend({
        modelName: "Task",
        localStorage: new Store(AppConfig.genkey("tasks")),
        defaults: {
            done: false
        },

        validate: function(attrs, opts) {
            if (!attrs.title || (attrs.title && attrs.title.trim().length === 0)) {
                return "Empty title not allowed"
            }

            return false;
        },

        title: function(attr) {
            return this.getRaw(attr).trim()
        }
    });

    _.extend(Task.prototype, Mixins.Models.CreatedUpdatedAt)
    _.extend(Task.prototype, Mixins.Models.customGetters)

    return Task
})
