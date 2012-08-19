define(['mixins', 'store', 'models/tag', 'collections/tags'], function(Mixins, Store, Tag, Tags) {
    var Model = Backbone.Model.extend({
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

    Mixins.patterns.applyParentClassPattern(Model)

    _.extend(Model.prototype, Mixins.Models.CreatedUpdatedAt)
    _.extend(Model.prototype, Mixins.Models.CustomGetters)
    _.extend(Model.prototype, Mixins.Models.DeletedAt)

    AppConfig.models['Task'] = Model

    return Model
})
