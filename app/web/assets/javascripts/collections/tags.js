define(['store', 'models/tag', 'mixins'], function(Store, Tag, Mixins) {
    var Collection = Backbone.Collection.extend({
        model: Tag,
        modelName: 'Tag',
        localStorage: new Store(AppConfig.genkey("tags")),


        getByName: function(name) {
            if (!name || (name instanceof Array && name.length === 0)) return null

            var res = []
            var obj = this

            if (name instanceof Array) {
                var names = name
                _.each(names, function(name) {
                    res.push(obj.where({
                        title: name
                    }))
                })
            } else {
                res = this.where({
                    title: name
                })
            }

            res = _.flatten(res)

            return res
        }
    });

    Mixins.patterns.applySingletonPattern(Collection)
    _.extend(Collection.prototype, Mixins.Collections.DeletedAt)

    AppConfig.collections['Tag'] = Collection.getInstance()

    return Collection.getInstance()
})
