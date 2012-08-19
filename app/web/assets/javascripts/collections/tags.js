define(['store', 'models/tag', 'mixins'], function(Store, Tag, Mixins) {
    var Collection = Backbone.Collection.extend({
        model: Tag,
        modelName: 'Tag',
        localStorage: new Store(AppConfig.genkey("tags"))
    });

    _.extend(Collection.prototype, Mixins.Collections.DeletedAt)

    Mixins.patterns.applySingletonPattern(Collection)

    AppConfig.collections['Tag'] = Collection.getInstance()

    return Collection.getInstance()
})
