define(['mixins', 'store', 'models/tag', 'collections/tags', 'helpers/tags'], function(Mixins, Store, Tag, Tags, TagsHelper) {
    var Model = Backbone.Model.extend({
        modelName: "Task",
        localStorage: new Store(AppConfig.genkey("tasks")),
        defaults: {
            done: false,
            deletedAt: null
        },

        validate: function(attrs, opts) {
            if (!attrs.title || (attrs.title && attrs.title.trim().length === 0)) {
                return "Empty title not allowed"
            }

            return false;
        },

        getTagObjects: function() {
            return Tags.getByName(this.get('tags'))
        },

        clearTags: function() {
            var id = this.get('id')
            if (!id) return false;

            var tagObjects = this.getTagObjects() || []

            // TODO(hbt): optimize by only removing the ones we don't have already have instead of all e.g we have #a #b and we add #c
            // TODO(hbt): we should add #c instead of removing #a #b and adding #a #b and #c

            // reset array + delete current task from tags
            _.each(tagObjects, function(tagObject) {
                tagObject.removeTask(id)
            })

            return true
        },

        preSave: function(key, value, options) {
            this.set(key)

            // remove old tags
            this.clearTags()
            this.set('tags', TagsHelper.extractTags(this.get('title')))
        },

        postSave: function() {
            // add task to tags
            var id = this.get('id')
            _.each(this.get('tags'), function(tagName) {
                var tag = Tags.where({
                    title: tagName
                })
                if (tag.length === 1) tag = tag[0]
                else tag = Tags.create({
                    title: tagName
                })

                if (tag) tag.addTask(id)
            })
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
