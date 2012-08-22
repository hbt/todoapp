define(['mixins', 'store'], function(Mixins, Store) {
    var Model = Backbone.Model.extend({
        modelName: "Tag",
        localStorage: new Store(AppConfig.genkey("tags")),

        initialize: function() {
            // TODO(hbt): review this. I think it resets every time the object is created -- check defaults when not using save
            this.set('tasks', [])
        },

        validate: function(attrs, opts) {
            if (!attrs.title || (attrs.title && attrs.title.trim().length === 0)) {
                return "Empty title not allowed"
            }

            return false;
        },

        title: function(attr) {
            return this.getRaw(attr).trim()
        },

        addTask: function(id) {
            if (!id) return false

            var ids = this.get('tasks')
            ids.push(id)
            ids = _.unique(ids)
            this.set('tasks', ids)
            this.save()

            return true
        },

        removeTask: function(id) {
            var ids = this.get('tasks')
            this.set('tasks', _.without(ids, id))
            this.save()
        }
    });

    Mixins.patterns.applyParentClassPattern(Model)

    _.extend(Model.prototype, Mixins.Models.CreatedUpdatedAt)
    _.extend(Model.prototype, Mixins.Models.CustomGetters)
    _.extend(Model.prototype, Mixins.Models.DeletedAt)

    AppConfig.models['Tag'] = Model

    return Model
})
